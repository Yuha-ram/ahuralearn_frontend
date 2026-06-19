import React from 'react';
import styles from './LeftBanner.module.css';
import bgImage from '../../../assets/images/bg.png';

/**
 * 初学者指南：公共组件 LeftBanner.jsx
 */
export default function LeftBanner() {
  return (
    <div className={styles.bannerWrapper}>
      {/* 新增：绝对定位的背景层，专门方便我们独立控制图片的透明度 */}
      <div className={styles.bannerBackgroundImage} style={{ backgroundImage: `url(${bgImage})` }}></div>

      <div className={styles.bannerTitleWrapper}>
        <h1 className={styles.bannerTitle}>
          Unlock Your<br />
          Potential<br />
          with AhuraLearn.
        </h1>
        <p className={styles.bannerDescription}>
          Join a community of dedicated learners and<br />
          access premium resources designed to elevate<br />
          your professional journey.
        </p>
      </div>
    </div>
  );
}