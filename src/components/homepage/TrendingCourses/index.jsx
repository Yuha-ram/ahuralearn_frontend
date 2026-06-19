import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getTrendingCourses } from '../../../api/course/course';
import styles from './TrendingCourses.module.css';

/**
 * 初学者指南：TrendingCourses (热门课程组件)
 * 此组件用来展示热门课程。我们会通过接口拿去数据，
 * 当数据比较多时（大于一行能显示的个数），支持用左右箭头滚动查看。
 */
export default function TrendingCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // 当前屏幕上显示的“第一个”卡片，在数组中的位置 (滑动窗口的起始点)
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    // 异步请求函数
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getTrendingCourses();
        setCourses(response);
      } catch (err) {
        console.warn('获取热门课程失败，使用备用数据', err);

        // setError('Failed to load trending courses');

        // 为了能在本地开发时看到界面，提供 8 条模拟测试数据
        const mockData = Array.from({ length: 8 }).map((_, idx) => ({
          id: idx,
          coverUrl: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop&sig=${idx}`,
          name: [
            'Python for Data Analysis and Visualization',
            'Java Data Structures & Algorithms Masterclass',
            'Advanced UI/UX Design: Figma to Webflow',
            'Cybersecurity Basics for IT Professionals'
          ][idx % 4],
          instructorName: ['Dr. Angela Yu', 'Tim Buchalka', 'Gary Simon', 'Jason Dion'][idx % 4],
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 30000)
        }));
        setCourses(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /**
   * 点击左箭头，向左滚动一个卡片位置
   */
  const scrollLeft = () => {
    setScrollIndex(prev => Math.max(prev - 1, 0));
  };

  /**
   * 点击右箭头，向右滚动一个卡片位置
   * 注意这里简单的假定一屏展示大概 4 个卡片，所以最多滚动 (总数 - 4) 次
   */
  const scrollRight = () => {
    // 应对数据不足4个的情况
    const maxScroll = Math.max(courses.length - 4, 0);
    setScrollIndex(prev => Math.min(prev + 1, maxScroll));
  };

  const handleCardClick = (courseId) => {
    // 跳转到课程详情页 /course/:courseId
    navigate(`/course/${courseId}`);
  };

  return (
    <div className={styles.courseSectionContainer}>
      <h2 className={styles.sectionTitle}>Trending Courses</h2>

      {loading && <div className={styles.loadingText}>Loading trending courses...</div>}

      {/* 请求失败会显示的信息 */}
      {error && <div className={styles.errorText}>{error}</div>}

      {!loading && !error && courses.length > 0 && (
        <div className={styles.carouselContainer}>

          {/* 当不是在最左边时，显示左箭头 */}
          {scrollIndex > 0 && (
            <button className={`${styles.arrowButton} ${styles.arrowLeft}`} onClick={scrollLeft}>
              <ChevronLeft size={20} />
            </button>
          )}

          {/* 这里的列表用 transform 来实现左右拖动效果的偏移 */}
          <div className={styles.coursesListWrapper}>
            <div
              className={styles.coursesList}
              style={{ transform: `translateX(calc(-${scrollIndex} * (25% + 0.375rem)))` }}
            >
              {courses.map(course => (
                <div key={course.id} className={styles.courseCard} onClick={() => handleCardClick(course.id)}>
                  <img src={course.coverUrl} alt={course.name} className={styles.courseImage} />
                  <div className={styles.courseInfo}>
                    <h3 className={styles.courseTitle}>{course.name}</h3>
                    <p className={styles.instructorName}>{course.instructorName}</p>
                    <div className={styles.ratingWrapper}>
                      <span className={styles.ratingValue}>{course.rating.toFixed(1)}</span>
                      <div className={styles.ratingStarsContainer}>
                        {/* 底层：灰色的空星星 */}
                        <div className={styles.starsEmpty}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={`empty-${star}`} size={14} fill="currentColor" />
                          ))}
                        </div>
                        {/* 顶层：黄色的实心星星，通过 width 控制显示百分比 */}
                        <div 
                          className={styles.starsFilled} 
                          style={{ width: `${(course.rating / 5) * 100}%` }}
                        >
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={`filled-${star}`} size={14} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <span className={styles.reviewCount}>
                        ({course.reviewCount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 当还没滚动到最右边时，显示右箭头 */}
          {scrollIndex < courses.length - 4 && (
            <button className={`${styles.arrowButton} ${styles.arrowRight}`} onClick={scrollRight}>
              <ChevronRight size={20} />
            </button>
          )}

        </div>
      )}
    </div>
  );
}
