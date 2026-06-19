import { useNavigate } from 'react-router-dom';
import styles from './adaptiveTestBar.module.css';

const AdaptiveTestBar = ({ onStartClick }) => {
// 删除了 useNavigate，因为现在由父组件的弹窗来决定什么时候跳转  

  return (
    <div className={styles['test-ready']}>
      <div className={styles['test-icon']}>🎯</div>
      <h3>Ready to test your knowledge?</h3>
      <p>
        Our AI engine adjusts the difficulty in real-time. Start now to get an accurate measurement of your current mastery.
      </p>
      <button className={styles['btn-test']} onClick={onStartClick}>
        Start Adaptive Test
      </button>
      <p className={styles['estimate-text']}>Estimated time: 5-10 minutes • 10 Questions max</p>
    </div>
  );
};

export default AdaptiveTestBar;