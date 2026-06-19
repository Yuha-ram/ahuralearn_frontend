import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHeroBanners } from '../../../api/course/course';
import { Link } from 'react-router-dom';
import styles from './HeroBanner.module.css';

/**
 * 初学者指南：HeroBanner (顶部横幅组件)
 * 此组件用于展示顶部轮播图。它会通过 API 请求获取后端的图片地址，
 * 然后利用状态 (state) 控制当前要展示第几张图片，以此实现轮播的交互。
 */
export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  // 初始化当前显示的轮播图索引，从 1 开始是因为前后各加了一个克隆元素，真实第一张在索引 1
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transitionDuration, setTransitionDuration] = useState(500);
  const isTransitioning = React.useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect 传入空数组 []，表示里面的代码只在组件第一次展示（挂载）到屏幕上的时候执行一次
  useEffect(() => {
    // 定义一个异步发送网络请求的内部函数
    const fetchBanners = async () => {
      try {
        setLoading(true); // 开始请求前，标记状态为加载中
        const response = await getHeroBanners();
        
        // 假设后端的返回值是 { data: [{ imageUrl, targetUrl }, ...] }
        // 注意：因为我们现在使用 mock API，真实请求可能会报错。为了不让页面崩溃，我们在 catch 里面使用备用数据
        setBanners(response);
      } catch (err) {
        // 请求报错时的处理机制 (Error Handling)
        console.warn('Banner 请求失败，使用默认演示数据代替', err);

        // setError('Failed to load banners');

        // 因为还没有真实的后端，为了让你能看到漂亮的界面，我们在发生网络错误时，放一些假数据
        setBanners([
          { 
            title: 'Banner 1',
            imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop', 
            targetUrl: '/featureHub?highlight=adaptiveAssessment'  
          },
          { 
            title: 'Banner 2', 
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop', 
            targetUrl: '/featureHub?highlight=courseRecommendation' 
          }
        ]);
      } finally {
        // 无论成功还是失败，网络请求都结束了，关闭加载状态
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  /**
   * 点击左箭头的逻辑
   */
  const handlePrev = () => {
    if (banners.length <= 1 || isTransitioning.current) return;
    isTransitioning.current = true;
    setTransitionDuration(500);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  /**
   * 点击右箭头的逻辑
   */
  const handleNext = () => {
    if (banners.length <= 1 || isTransitioning.current) return;
    isTransitioning.current = true;
    setTransitionDuration(500);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  /**
   * 监听滚动动画结束：用于实现无缝循环衔接
   */
  const handleTransitionEnd = () => {
    isTransitioning.current = false;
    if (currentIndex === 0) {
      setTransitionDuration(0);
      setCurrentIndex(banners.length);
    } else if (currentIndex === banners.length + 1) {
      setTransitionDuration(0);
      setCurrentIndex(1);
    }
  };

  /**
   * 自动轮播逻辑
   * 每隔 3 秒自动切换到下一张图片
   */
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      // 执行正确的 next 逻辑以维持统一的滑动方向
      if (!isTransitioning.current) {
        isTransitioning.current = true;
        setTransitionDuration(500);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [banners.length, currentIndex]);

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.carouselWrapper}>
        {loading && <div className={styles.loadingText}>Loading banners...</div>}
        
        {/* 请求失败会显示的信息 */}
        {error && <div className={styles.errorText}>{error}</div>}

        {/* 请求成功会展示的横幅数据 */}
        {!loading && !error && banners.length > 0 && (
          <>
            {/* a 标签实现点击横幅时进行的跳转 */}
            <div 
              className={styles.slider} 
              style={{ 
                transform: `translateX(-${(banners.length > 1 ? currentIndex : 0) * 100}%)`,
                transition: `transform ${transitionDuration}ms ease-in-out`
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {(banners.length > 1 ? [banners[banners.length - 1], ...banners, banners[0]] : banners).map((banner, index) => (
                <Link
                  key={index}
                  to={banner.targetUrl} 
                  className={styles.slideItem}
                >
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className={styles.carouselImage} 
                  />
                </Link>
              ))}
            </div>

            {/* 当图片数量大于 1 时，显示左右切换的箭头按钮 */}
            {banners.length > 1 && (
              <>
                <button className={`${styles.heroArrowButton} ${styles.heroArrowLeft}`} onClick={handlePrev}>
                  <ChevronLeft size={36} />
                </button>
                <button className={`${styles.heroArrowButton} ${styles.heroArrowRight}`} onClick={handleNext}>
                  <ChevronRight size={36} />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}