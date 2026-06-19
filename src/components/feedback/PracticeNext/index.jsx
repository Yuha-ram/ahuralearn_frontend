import styles from './practiceNext.module.css';
import { useNavigate } from 'react-router-dom';

const PracticeNext = () => {
  const navigate = useNavigate();// 1. 初始化 navigate
  const handlePracticeClick = () => {
    // 2. 跳转到做题界面
    // ⚠️ 注意：这里的 '/exam' 需要替换为你 App.jsx 或 main.jsx 中实际为 ExamController 配置的路由路径
    // 比如可能是 '/adaptive-test' 或者 '/quiz' 等等
    navigate('/exam'); 
  };

  return (
    <div className={styles.card}>
      <div className={styles['header-container']}>
        <div className={styles['practice-icon']}>
          ⚡
        </div>
        <div>
          <h2 className={styles.title}>Practice Next</h2>
          <p className={styles.subtitle}>Strengthen your skills with curated challenges designed for your current gaps.</p>
        </div>
      </div>
      
      <div className={styles['practice-card']}>
        <span className={styles['practice-type']}>Practice</span>
        <h3>Promise Chaining Challenge</h3>
        <p>Test your understanding of error propagation in long promise chains.</p>

        {/* 3. 给按钮绑定点击事件 */}
        {/* 统一调用顶部定义的函数 */}
        <button onClick={handlePracticeClick}>Try problem</button>
        
      </div>
    </div>
  );
};

export default PracticeNext;
