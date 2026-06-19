import React from 'react';
import { Link } from 'react-router-dom';
import styles from './featureCard.module.css';

/**
 * 卡片子组件：FeatureCard
 * @param {string} title - 功能标题
 * @param {string} description - 功能描述
 * @param {string} linkTo - 点击 Try it out 后跳转的路由路径
 * @param {string} theme - 主题名 ('blue', 'green', 'purple', 'orange', 'pink', 'dark')
 * @param {React.ReactNode} icon - 传入的 React 组件或者图标
 * @param {boolean} isHighlighted - 是否高亮显示
 */
export default function FeatureCard({ title, description, linkTo, theme, icon, isHighlighted }) {
  // 【初学者提示】这里是将外界传入的 theme 字符串首字母大写，为了和 CSS 里面的类名相匹配。
  // 例如传入 'blue' 拼接后就会变成 'themeBlue'。
  const capitalizeTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
  const themeClassName = `theme${capitalizeTheme}`;

  // 【初学者提示】通过 CSS Module 引入对应的类名，如果 CSS 中没有对应的定义就会为空。
  const appliedThemeClass = styles[themeClassName] || '';
  const highlightClass = isHighlighted ? styles.glowingHighlight : '';

  return (
    /* 
      【初学者提示】在最外层容器上，同时挂上通用的 cardContainer 以及根据 theme 计算出的特殊主题类名。
      当我们加上 appliedThemeClass （比如 styles.themeBlue）之后，CSS里面的 `.themeBlue .iconWrapper` 就会生效，从而改变图标背景颜色和整体背景颜色。
    */
    <div className={`${styles.cardContainer} ${appliedThemeClass} ${highlightClass}`}>
      {/* 顶部的图标区域 */}
      <div className={styles.iconWrapper}>
        {icon}
      </div>

      {/* 文本内容区域 */}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {/* 
        底部的按钮区域，使用 react-router-dom 的 Link 标签进行单页无刷新跳转 
      */}
      <Link to={linkTo} className={styles.tryButton}>
        Try it out
      </Link>
    </div>
  );
}
