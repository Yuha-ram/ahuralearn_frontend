import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './timer.module.css';

/**
 * 计时器组件
 * @param {number|string} currentQuestionId - 当前正在作答的题目 ID
 */
const Timer = forwardRef(({ currentQuestionId }, ref) => {
  
  const [totalTime, setTotalTime] = useState(() => {
    const savedTotal = sessionStorage.getItem('examTotalTime');
    return savedTotal ? parseInt(savedTotal, 10) : 0;
  }); // 考试总耗时（秒）
  
  const [timePerQuestion, setTimePerQuestion] = useState(() => {
    const savedQTime = sessionStorage.getItem('examTimePerQuestion');
    return savedQTime ? JSON.parse(savedQTime) : {};
  }); // 记录每道题耗时的字典

  useEffect(() => {
    if (!currentQuestionId) return;

    // 每秒钟执行一次，更新总时间和当前题目的时间
    const timerInterval = setInterval(() => {
      setTotalTime((prevTotal) => {
        const newTotal = prevTotal + 1;
        // 🌟 每秒更新总时间到本地存储
        sessionStorage.setItem('examTotalTime', newTotal);
        return newTotal;
      });      
      
      setTimePerQuestion((prevTimes) => {
        const newTimes = {
        ...prevTimes,
        [currentQuestionId]: (prevTimes[currentQuestionId] || 0) + 1
      };
      // 🌟 每秒更新各题时间到本地存储
        sessionStorage.setItem('examTimePerQuestion', JSON.stringify(newTimes));
        return newTimes;
      });  
    }, 1000);

    // 清理定时器，防止内存泄漏
    return () => clearInterval(timerInterval);
  }, [currentQuestionId]);

  // 暴露 getTimeData 方法给父组件 (ExamController)，供其在交卷时拉取数据
  useImperativeHandle(ref, () => ({
    getTimeData: () => ({
      totalTimeSeconds: totalTime,
      questionTimes: timePerQuestion
    })
  }));

  // 格式化秒数为 MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentQTime = timePerQuestion[currentQuestionId] || 0;

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerHeader}>
        <span>⏱️</span> Time Tracking
      </div>
      
      <div className={styles.timeDisplay}>
        <div className={styles.timeBlock}>
          <span className={styles.label}>Total Time</span>
          <span className={styles.value}>{formatTime(totalTime)}</span>
        </div>
        
        <div className={`${styles.timeBlock} ${styles.currentBlock}`}>
          <span className={styles.label}>Current Question</span>
          <span className={styles.value}>{formatTime(currentQTime)}</span>
        </div>
      </div>
    </div>
  );
});

export default Timer;