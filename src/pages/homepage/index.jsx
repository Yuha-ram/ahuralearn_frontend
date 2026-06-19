import React from 'react';
import TopNav from '../../components/common/TopNav';
import HeroBanner from '../../components/homepage/HeroBanner';
import TrendingCourses from '../../components/homepage/TrendingCourses';
import NewRecommendations from '../../components/homepage/NewRecommendations';
import Footer from '../../components/common/Footer';

// 我们可以给 Homepage 也加上一点非常简单的布局 CSS，比如背景色
import styles from './homepage.module.css';

/**
 * 初学者指南：Homepage (系统首页页面容器)
 * 这个组件相当于是一个大盒子（页面），里面装了你刚才要求拆分好的各个小部件（组件）。
 * 这样做的好处是代码非常清晰，修改顶部导航就去修改 TopNav 组件，修改尾部就去修改 Footer 组件，互不干扰。
 */
export default function Homepage() {
  return (
    <div className={styles.homepageContainer}>
      {/* 顶部导航栏 */}
      <TopNav />

      {/* 顶部轮播图大横幅 */}
      <HeroBanner />

      {/* 主要内容区域容器，方便控制它不要太宽 */}
      <main className={styles.homepageMainContent}>
        {/* 热门课程区域 */}
        <TrendingCourses />

        {/* 新课推荐区域 */}
        <NewRecommendations />
      </main>

      {/* 网站尾部 / 页脚 */}
      <Footer />
    </div>
  );
}
