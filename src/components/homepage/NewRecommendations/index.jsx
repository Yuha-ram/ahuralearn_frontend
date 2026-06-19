import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getNewRecommendations } from '../../../api/course/course';
import styles from './NewRecommendations.module.css';

export default function NewRecommendations() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await getNewRecommendations();
        setCourses(response);
      } catch (err) {
        console.warn('获取新课推荐失败，使用备用数据', err);

        const mockData = Array.from({ length: 8 }).map((_, idx) => ({
          id: idx,
          coverUrl: `https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=600&auto=format&fit=crop&sig=${idx}`,
          name: [
            'Web Development with React and Next.js',
            'AI Ethics: Navigating the Future of Tech',
            'Growth Marketing Strategy for Startups',
            'Mastering AWS Cloud Infrastructure'
          ][idx % 4],
          instructorName: ['Maximilian Schwarzmüller', 'Prof. Sarah Jenkins', 'Seth Godin', 'Stephane Maarek'][idx % 4],
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 2000)
        }));
        setCourses(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const scrollLeft = () => {
    setScrollIndex(prev => Math.max(prev - 1, 0));
  };

  const scrollRight = () => {
    const maxScroll = Math.max(courses.length - 4, 0); 
    setScrollIndex(prev => Math.min(prev + 1, maxScroll));
  };

  const handleCardClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className={styles.courseSectionContainer}>
      <h2 className={styles.sectionTitle}>New Course Recommendations</h2>
      
      {loading && <div className={styles.loadingText}>Loading new recommendations...</div>}

      {error && <div className={styles.errorText}>{error}</div>}

      {!loading && !error && courses.length > 0 && (
        <div className={styles.carouselContainer}>
          
          {scrollIndex > 0 && (
            <button className={`${styles.arrowButton} ${styles.arrowLeft}`} onClick={scrollLeft}>
              <ChevronLeft size={20} />
            </button>
          )}

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
                        <div className={styles.starsEmpty}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={`empty-${star}`} size={14} fill="currentColor" />
                          ))}
                        </div>
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
