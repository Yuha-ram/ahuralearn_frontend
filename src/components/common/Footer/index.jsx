import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

/**
 * 初学者指南：Footer (页脚组件)
 * 页脚一般放一些公司的简介、各种政策说明和辅助链接。
 * 这里的链接 href 都是 '#' 占位符，因为实际的页面可能还没开发好。
 */
export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      {/* 左侧：Logo 和平台宣传语 */}
      <div className={styles.footerLeft}>
        <Link to="/homepage" className={styles.footerLogoArea}>
          <h2 className={styles.footerLogoTitle}>AhuraLearn</h2>
        </Link>
        <p className={styles.footerDescription}>
          Empowering learners worldwide with affordable and expert-led education.
        </p>
      </div>

      {/* 右侧：用各种子分类包裹的一排排超链接 (Columns) */}
      <div className={styles.footerLinksContainer}>
        
        {/* 探索课程专区 */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Explore</h3>
          <a href="#" className={styles.footerLinkItem}>Business</a>
          <a href="#" className={styles.footerLinkItem}>Tech</a>
          <a href="#" className={styles.footerLinkItem}>Design</a>
        </div>

        {/* 公司相关 */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Company</h3>
          <a href="#" className={styles.footerLinkItem}>About Us</a>
          <a href="#" className={styles.footerLinkItem}>Careers</a>
          <a href="#" className={styles.footerLinkItem}>Terms</a>
        </div>

        {/* 帮助与支持 */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Support</h3>
          <a href="#" className={styles.footerLinkItem}>Help Center</a>
          <a href="#" className={styles.footerLinkItem}>Affiliate</a>
          <a href="#" className={styles.footerLinkItem}>Contact Us</a>
        </div>
        
      </div>
    </footer>
  );
}
