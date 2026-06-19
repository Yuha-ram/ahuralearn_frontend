import Footer from "../../common/Footer";
import TopNav from "../../common/TopNav";
import Navbar from "../Navbar";

import styles from "./PageShell.module.css";

/**
 * PageShell 页面外壳组件
 *
 * 用于统一普通页面的整体结构，例如：
 * - TopNav
 * - Navbar / Sub Navigation
 * - Footer
 *
 * children:
 * 页面真正内容区域。
 *
 * showSubNav:
 * 是否显示二级导航栏（Navbar）。
 * 默认值为 true。
 */
export default function PageShell({ children, showSubNav = true }) {
  return (
    <div className={styles.shell}>
      {/* 顶部导航栏 */}
      <TopNav />

      {/* 二级导航栏（可选择隐藏） */}
      {showSubNav && <Navbar />}

      {/* 页面主体内容 */}
      <div className={styles.mainContent}>
        {children}
      </div>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}
