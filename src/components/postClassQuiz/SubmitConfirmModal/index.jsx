import React from 'react';
import styles from './submitConfirmModal.module.css';

/**
 * 提交确认弹窗组件
 * @param {boolean} isOpen 决定弹窗是否显示
 * @param {number} flaggedCount 父组件传过来的、目前带有标记的题目数量
 * @param {function} onCancel 点击"返回检查"关闭弹窗
 * @param {function} onConfirm 点击"继续提交"触发后端请求
 */
export default function SubmitConfirmModal({ isOpen, flaggedCount, onCancel, onConfirm }) {
  // 如果 isOpen 为假，直接返回 null，什么都不渲染
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* 常驻文本 */}
        <h3 className={styles.title}>
          您已完成所有题目，确认要提交答卷吗？
        </h3>
        
        {/* 动态提示：如果父组件传下来的 flaggedCount 不等于 0，则渲染警告提示 */}
        {flaggedCount !== 0 && (
           <div className={styles.warningText}>
             ⚠️ 提示：您还有 {flaggedCount} 道题目被标记为不确定。
           </div>
        )}

        {/* 按钮行 */}
        <div className={styles.buttonsWrapper}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            返回检查
          </button>
          
          <button className={styles.submitBtn} onClick={onConfirm}>
            继续提交
          </button>
        </div>
      </div>
    </div>
  );
}
