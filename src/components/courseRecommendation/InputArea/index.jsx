import React, { useState } from 'react';
import { Mic, Paperclip, Send } from 'lucide-react';
import styles from './inputArea.module.css';

/**
 * 底部输入区域组件
 * @param {function} onSend 点击发送按钮或回车时的回调函数，接收输入文本作为参数
 * @param {boolean} isLoading 标识当前是否正在等待 AI 回复，用于禁用输入框和按钮
 */
export default function InputArea({ onSend, isLoading }) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    // 过滤掉空白消息
    if (!inputValue.trim() || isLoading) return;

    // 调用父组件传进来的发送方法
    onSend(inputValue.trim());

    // 发送后清空输入框
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    // 监听回车键发送
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    /* else if (e.key === 'Enter' && e.shiftKey) {
      // Shift + Enter 插入换行
      setInputValue(prev => prev + '\n');
    } */
  };

  return (
    <div className={styles.inputContainer}>
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Ask follow-up questions..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <div className={styles.iconGroup}>
            {/* 麦克风图标 (纯静态占位符) */}
            <button className={styles.iconButton} title="Speech to text">
              <Mic size={20} />
            </button>

            {/* 附件图标 (纯静态占位符) */}
            <button className={styles.iconButton} title="Attach file">
              <Paperclip size={20} />
            </button>

            {/* 发送按钮 */}
            <button
              className={styles.sendButton}
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <div className={styles.footerNote}>
          AI can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
}
