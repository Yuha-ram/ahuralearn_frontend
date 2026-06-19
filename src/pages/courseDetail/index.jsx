import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetail, getSyllabus, getEnrollmentStatus, enrollCourse } from '../../api/course/course';

import TopNav from '../../components/common/TopNav';
import CourseHeader from '../../components/courseDetail/CourseHeader';
import CourseTabs from '../../components/courseDetail/CourseTabs';
import InstructorCard from '../../components/courseDetail/InstructorCard';
import Footer from '../../components/common/Footer';

import styles from './courseDetail.module.css';

export default function CourseDetail() {
  /**
   * 1. 初学者指南：获取 URL 参数
   *  使用 useParams 钩子，我们可以从浏览器的地址栏里把课程的 ID (courseId) 提取出来。
   *  比如你的网址是 /course/123，这里就能拿到 123。我们要用这个 ID 去找后端要对应课程的数据。
   */
  const { courseId } = useParams();
  const navigate = useNavigate();

  // 每次进入页面时，滚动到最顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  // 定义组件需要的状态 (State)
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    description: '',
    rating: 0,
    reviews: 0,
    enrollCount: 0,
    difficulty: '',
    instructor: {},
    durationInfo: { approxHours: 0, weeksToComplete: 0 },
    aboutCourse: '',
    outcomes: [],
    syllabus: []
  });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [latestSectionId, setLatestSectionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 2. 初学者指南：页面加载时向后端请求数据
   * useEffect 可以让我们在组件刚被加载到页面上时，自动执行里面的代码。
   * 这里我们要同时发起两个请求：获取课程的详细信息，以及查询当前用户有没有报名这个课。
   */
  useEffect(() => {
    // 如果没有获取到 courseId（例如路由配置错误），直接返回，不要发请求
    if (!courseId) return;

    const fetchPageData = async () => {
      try {
        setIsLoading(true); // 开始请求前，页面进入加载状态

        // 暂时注释掉 getEnrollmentStatus，因为后端暂未实现该接口，会导致 404 从而引发 Promise.all 走入 catch
        // 等后端接口写好后，取消这里的注释并将原来的调用加回去即可。
        const [detailRes, syllabusRes, enrollRes] = await Promise.all([
          getCourseDetail(courseId),
          getSyllabus(courseId),
          getEnrollmentStatus(courseId)
        ]);

        // 请求成功后，提取后端返回的数据。
        // 兼容带 code: 200 包裹层的真实后端结构，以及原本的 mock 数据结构
        const detailData = detailRes;

        const syllabusData = syllabusRes;

        const enrollData = enrollRes;

        // 处理 outcomes（可能为字符串或数组）
        let parsedOutcomes = [];
        try {
          if (typeof detailData.outcomes === 'string') {
            if (detailData.outcomes.trim().startsWith('[')) {
              parsedOutcomes = JSON.parse(detailData.outcomes);
            } else {
              parsedOutcomes = detailData.outcomes.split(/[\n;]+/).map(i => i.trim()).filter(Boolean);
            }
          } else if (Array.isArray(detailData.outcomes)) {
            parsedOutcomes = detailData.outcomes;
          }
        } catch (e) {
          console.error("Failed to parse outcomes", e);
        }

        // 仅合并补充属性，保持后端原始属性名不变
        const currentCourseData = {
          ...detailData,
          outcomes: parsedOutcomes.length > 0 ? parsedOutcomes : (detailData.outcomes || []),
          syllabus: syllabusData.chapters || syllabusData.syllabus || syllabusData || []
        };

        setCourseData(currentCourseData);
        setIsEnrolled(enrollData ? enrollData.enrolled : false);
        setLatestSectionId(enrollData ? enrollData.latestSectionId : null);

      } catch (err) {
        // 如果网络请求失败了，会进入这里，我们在页面上提示错误
        setError('Failed to load course details. Please try again later.');

        // 当拿不到数据时展示空的骨架
        setCourseData({
          name: 'Unknown Course',
          categoryName: 'Uncategorized',
          subtitle: '',
          rating: 0,
          reviewCount: 0,
          enrolledCount: 0,
          difficultyLevel: '',
          hoursRequired: 0,
          instructor: {},
          description: '',
          outcomes: [],
          syllabus: []
        });
      } finally {
        // 不管上面的请求是成功还是失败，最后这一步一定会执行，我们要关掉加载状态
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [courseId]); // 这个数组里写着 courseId，意思是只有当 courseId 发生变化时，这个 useEffect 才需要重新跑一次。

  /**
   * 初学者指南：处理报名按钮的点击事件
   * 当用户点击 Header 里的报名按钮时，调用这个函数来向后端发起报名。
   */
  const handleEnrollClick = async () => {
    try {
      await enrollCourse(courseId);
      // 报名成功后，我们不再需要重新刷新整个页面，只要把状态 isEnrolled 改为 true 就可以了。
      setIsEnrolled(true);
      alert('Successfully enrolled!');
    } catch (err) {
      alert('Enrollment API request failed. Pretending success for UI preview...');
      setIsEnrolled(true); // for testing the UI
    }
  };

  const handleContinueLearning = () => {
    const firstLessonId = courseData?.syllabus?.[0]?.sections?.[0]?.id || '';
    const targetLessonId = latestSectionId ? latestSectionId : firstLessonId;

    if (targetLessonId) {
      navigate(`/learning/${courseId}/${targetLessonId}`);
    } else {
      navigate(`/learning/${courseId}`);
    }
  };

  // 不再提前返回 loading 状态，而是让骨架结构在透明度、或原本 UI 结构里显示
  // 但是如果 error 存在，可以选择顶部弹出一个 toast 或者其他提示。
  // 万一有奇怪的错误导致数据是空的，我们也防范一下
  if (!courseData) {
    return <div className={styles.errorWrapper}>No course data found.</div>;
  }

  return (
    <div className={`${styles.courseDetailContainer} ${isLoading ? styles.loadingState : ''}`}>
      <TopNav />

      <CourseHeader
        courseData={courseData}
        isEnrolled={isEnrolled}
        onEnrollClick={handleEnrollClick}
        onContinueLearning={handleContinueLearning}
      />

      <div className={styles.courseMainContent}>
        <div className={styles.mainLeftColumn}>
          <CourseTabs courseData={courseData} />
        </div>

        <div className={styles.mainRightColumn}>
          <InstructorCard instructorData={courseData.instructor} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
