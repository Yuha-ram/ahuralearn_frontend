import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TopNav from '../../components/common/TopNav';
import Footer from '../../components/common/Footer';
import VideoPlayer from '../../components/videoLearning/VideoPlayer';
import CourseSidebar from '../../components/videoLearning/CourseSidebar';
import LessonTabs from '../../components/videoLearning/LessonTabs';
import LessonInstructorCard from '../../components/videoLearning/LessonInstructorCard';
import styles from './VideoLearning.module.css';
import { getCoursePlayDetails, getPlaybackProgress, getPlaybackUrl } from '../../api/course/course';
import { showToast } from '../../components/common/toast';
import { BiLogOutCircle } from 'react-icons/bi';

export default function VideoLearning() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  // ----- 状态管理区域 -----
  // loading 状态，页面初始化时展示给用户加载提示
  const [isLoading, setIsLoading] = useState(true);
  // error 状态，捕获接口错误并展示
  const [error, setError] = useState(null);

  // 课程整体信息（讲师、基础描述等）
  const [courseInfo, setCourseInfo] = useState({});
  // 课程所有课时列表
  const [lessonList, setLessonList] = useState([]);
  // 总体学习进度百分比（例如 35%）
  const [overallProgress, setOverallProgress] = useState(0);

  // 当前正在播放的课时详细信息（我们需要传给子组件的）
  const [currentLesson, setCurrentLesson] = useState(null);
  // 上次观看的时间进度秒数，用于断点续播
  const [lastWatchTime, setLastWatchTime] = useState(0);

  // ----- 生命周期与副作用区域 -----
  // useEffect：在组件挂载和 courseId 发生变化时，向后端请求课程详细数据
  useEffect(() => {
    if (!courseId || !lessonId) return;

    const fetchLearningData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [detailsRes, progressRes, urlRes] = await Promise.all([
          getCoursePlayDetails(courseId, lessonId),
          getPlaybackProgress(courseId, lessonId),
          getPlaybackUrl(courseId, lessonId)
        ]);

        let detailsData = detailsRes;
        let progressData = progressRes;
        let playUrl = urlRes;

        if (!detailsData || !progressData) {
          throw new Error("Incomplete data returned from server");
        }

        setCourseInfo({ instructor: detailsData.instructor });

        const completedIds = new Set(progressData.completedSectionIds || []);
        let flatSections = [];

        const chapters = (detailsData.chapters || []).map(chapter => {
          const newSections = (chapter.sections || []).map(section => {
            let status = 'locked';
            if (completedIds.has(section.id)) {
              status = 'completed';
            }
            const s = { ...section, status };
            flatSections.push(s);
            return s;
          });
          return { ...chapter, sections: newSections };
        });

        // Simple pass left-to-right to unlock
        flatSections.forEach((s, idx) => {
          if (idx === 0 && s.status === 'locked') s.status = 'unlocked';
          if (idx > 0 && flatSections[idx - 1].status === 'completed' && s.status === 'locked') {
            s.status = 'unlocked';
          }
        });

        setLessonList(chapters);

        const currentSec = detailsData.currentSection;
        let targetLesson = flatSections.find(s => String(s.id) === String(lessonId));
        if (!targetLesson && flatSections.length > 0) {
          targetLesson = flatSections[0];
          navigate(`/learning/${courseId}/${targetLesson.id}`, { replace: true });
        }

        if (targetLesson) {
          setCurrentLesson({
            ...targetLesson,
            description: currentSec?.description || targetLesson.description,
            title: currentSec?.title || targetLesson.title,
            videoUrl: typeof playUrl === 'string' ? playUrl : playUrl?.url // Handle potential object wrapping
          });
        }

        setLastWatchTime(progressData.moment || 0);

        const total = flatSections.length;
        const completed = flatSections.filter(s => s.status === 'completed').length;
        setOverallProgress(total > 0 ? Math.round((completed / total) * 100) : 0);

      } catch (err) {
        showToast(err.message, "error");
        console.error("Failed to load learning details:", err);
        setError(err.message || "Failed to load learning materials. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId, lessonId]);

  // Removed the extra lessonId watcher. Data is fetched on lessonId change.

  // ----- 事件处理函数 -----
  // 处理课程课时的点击事件（由子组件 CourseSidebar 触发）
  const handleSelectLesson = (lessonVideo) => {
    // 只有状态是 "completed" 或 "unlocked" 的课时才能点击
    if (lessonVideo.status === 'locked') return;

    // 更新当前播放课时：不直接 set state，而是改变网页 URL 路由即可，
    // 路由变更后，上面的 useEffect 会监听 lessonId 并完成 currentLesson 的切换和进度重置。
    navigate(`/learning/${courseId}/${lessonVideo.id}`);
  };

  // 处理课时观看完成的逻辑，供 VideoPlayer 子组件在达到 80% 进度时调用
  const handleLessonCompleted = (completedLessonId) => {
    // 我们可以直接在前端模拟状态更新，告诉界面这节课已经完成了
    setLessonList(prevList => {
      // 拍平去找哪一个是 completed，哪一个是 next
      let foundCompleted = false;
      let nextUnloced = false;

      return prevList.map(chapter => {
        const newSections = (chapter.sections || []).map(section => {
          if (foundCompleted && !nextUnloced) {
            nextUnloced = true;
            return { ...section, status: section.status === 'locked' ? 'unlocked' : section.status };
          }
          if (section.id === completedLessonId) {
            foundCompleted = true;
            return { ...section, status: 'completed' };
          }
          return section;
        });

        return { ...chapter, sections: newSections };
      });
    });
  };

  // ----- 渲染部分 -----
  return (
    <div className={styles.pageContainer}>
      <TopNav />
      {/* 优雅降级 UI：加载中或错误 */}
      {isLoading && <div className={styles.loadingWrapper}>Loading course materials...</div>}
      {error && !isLoading && (
        <main className={styles.mainContent}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className={styles.errorContainer}>
            <h2>Oops! Failed to load course.</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              Retry
            </button>
          </div>
        </main>
      )}

      {!isLoading && !error && (
        <main className={styles.mainContent}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className={styles.gridContent}>
            {/* 左侧主要区域：视频播放器 + 底部描述 Tabs */}
            <div className={styles.leftColumn}>
              {/* 传递需要的参数给视频播放组件 */}
              {currentLesson && (
                <VideoPlayer
                  lesson={currentLesson}
                  lastWatchTime={lastWatchTime}
                  onLessonComplete={handleLessonCompleted}
                />
              )}

              {/* 描述和测试区域 */}
              <LessonTabs
                description={currentLesson?.description}
                tags={currentLesson?.tags}
                lessonId={currentLesson?.id}
                title={currentLesson?.title}
              />
            </div>

            {/* 右侧边栏：课时列表 + 讲师信息 */}
            <div className={styles.rightColumn}>
              <CourseSidebar
                overallProgress={overallProgress}
                lessonList={lessonList}
                currentLessonId={currentLesson?.id}
                onSelectLesson={handleSelectLesson}
              />
              {/* 复用或者新建讲师卡片进行隔离
                此处我们使用专为此页面隔离的 LessonInstructorCard */}
              {courseInfo.instructor && (
                <LessonInstructorCard instructorDetails={courseInfo.instructor} />
              )}
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
