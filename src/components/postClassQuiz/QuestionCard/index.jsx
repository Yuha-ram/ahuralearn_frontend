import React from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import styles from './questionCard.module.css';

/**
 * 左侧题目展示区组件
 * @param {object} question 当前的问题对象数据
 * @param {number} currentIndex 当前的题目索引
 * @param {object} currentAnswer 用户针对当前题目的作答情况数据组合 (包含 selectedOption, isFlagged 等)
 * @param {function} onOptionSelect 选择选项的回调函数
 * @param {function} onToggleFlag 切换标记重看的回调函数
 * @param {React.ReactNode} children 插入底部的导航按钮
 */
export default function QuestionCard({ question, currentIndex, currentAnswer, onOptionSelect, onToggleFlag, children }) {
  if (!question) return null;

  // 提取用户当前题目是否被标记重看
  const isFlagged = currentAnswer?.isFlagged || false;
  // 提取用户当前题目选择了哪个选项
  const selectedOption = currentAnswer?.selectedOption || null;

  return (
    <div className={styles.cardContainer}>
      {/* 头部信息：显示“Question N”和右上角的书签按钮 */}
      <div className={styles.cardHeader}>
        <div className={styles.questionBadge}>
          QUESTION {currentIndex + 1}
        </div>
        
        {/* 点击书签按钮，触发 onToggleFlag 回调 */}
        <button 
          className={`${styles.bookmarkButton} ${isFlagged ? styles.bookmarkActive : ''}`}
          onClick={() => onToggleFlag(question.id)}
          title="Bookmark this question"
        >
          {/* 这里我们设置如果激活了就用填充色 */}
          <Bookmark size={24} fill={isFlagged ? "currentColor" : "none"} />
        </button>
      </div>

      {/* 题目内容 */}
      <h2 className={styles.questionTitle}>
        {question.title}
      </h2>

      {/* 选项列表 */}
      <div className={styles.optionsList}>
        {question.options.map((option, index) => {
          // 判断这个选项是不是当前被选中的那一个
          const isSelected = selectedOption === option.value;
          
          return (
            // 当用户点击整个选项栏，我们调用 onOptionSelect 把对应题目的 id 和选项的值传回父组件
            <div 
              key={option.value} 
              className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
              onClick={() => onOptionSelect(question.id, option.value)}
            >
              {/* 这里是一个虚拟的单选按钮，纯 UI 效果 */}
              <div className={styles.radioVirtual}>
                <div className={styles.radioVirtualInner}></div>
              </div>
              
              <span className={styles.optionText}>{option.text}</span>
              
              {/* 如果选中了，右侧展示打勾图标 */}
              {isSelected && <CheckCircle2 className={styles.selectedIcon} size={20} />}
            </div>
          )
        })}
      </div>

      {/* 底部导航区域，我们通过 children 插槽从父组件传进来 */}
      <div className={styles.footerActions}>
        {children}
      </div>
    </div>
  );
}
