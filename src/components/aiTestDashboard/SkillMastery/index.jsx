import { useState, useEffect } from 'react';
import styles from './skillMastery.module.css';

const SkillMastery = ({ skills, layout = 'horizontal' }) => {

// 状态：控制动画是否开始
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 组件挂载 100 毫秒后触发动画
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // 清理定时器
    return () => clearTimeout(timer);
  }, []);


  // ✅ 这里必须显式调用 return 来返回 UI

  return (
  <section className={`${styles.card} ${styles['skill-mastery']}`}>
    <h4 className={styles['skill-title']}>Skill Mastery</h4>

    <div className={styles['skills-grid']}
    style={layout === 'vertical' ? { gridTemplateColumns: '1fr', gap: '20px' } : {}}
    >
      
      {skills.map((skill) => (
        <div className={styles['skill-item']} key={skill.name}>
          <div className={styles['skill-name']}
          style={layout === 'vertical' ? { whiteSpace: 'nowrap' } : {}}
          >
            <span>{skill.name}</span>

{/* ✅ 动态显示数字 */}
            <span className={styles['skill-percentage']}>
              {isLoaded ? skill.value : 0}%
            </span>
          </div>

          <div className={styles['progress-bar']}>
            <div
              className={`${styles['progress-fill']} ${styles[skill.className] || ''}`}
              
              // ✅ 动态控制宽度，触发 CSS 的 transition 动画
              style={{ width: isLoaded ? `${skill.value}%` : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
  </section>
);
}
export default SkillMastery;


