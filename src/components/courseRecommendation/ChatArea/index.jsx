import React, { useEffect, useRef } from 'react';
import { Sparkles, User } from 'lucide-react';
import CourseCard from '../CourseCard';
import logoImg from '../../../assets/images/logo.png';
import styles from './chatArea.module.css';

/**
 * 核心对话展示区域组件
 * @param {Array} messages 当前会话的全部消息数组
 * @param {boolean} isLoading 是否正在等待 AI 的回复
 */
export default function ChatArea({ messages, isLoading }) {
  // 1. 创建一个 useRef，用来指向消息列表的末尾
  const messagesEndRef = useRef(null);

  // 2. 创建一个自动滚动的方法
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 3. 在 messages 数组或 isLoading 改变时，触发自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 状态 A：如果消息列表为空，渲染初始空状态
  if (messages.length === 0) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.emptyState}>
          <img src={logoImg} alt="AhuraLearn Logo" className={styles.logoImage} />
          <h2 className={styles.greetingTitle}>AhuraLearn</h2>
          <h3 className={styles.greetingSubTitle}>
            How can I help you today?
          </h3>
        </div>
      </div>
    );
  }

  // 状态 B：渲染聊天列表
  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageList}>
        {/* 循环遍历所有的消息渲染气泡 */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          
          return (
            <div key={index} className={`${styles.messageRow} ${isUser ? styles.userRow : styles.aiRow}`}>
              {/* 头像 */}
              <div className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.aiAvatar}`}>
                {isUser ? <User size={20} color="#64748b" /> : <Sparkles size={20} />}
              </div>
              
              {/* 消息内容与发信人名称 */}
              <div className={`${styles.messageContent} ${isUser ? styles.userContent : styles.aiContent}`}>
                <div className={styles.senderName}>{isUser ? 'You' : 'AI Assistant'}</div>
                
                {/* 文本气泡：只在有文本内容时才展示 */}
                {msg.text && (
                  <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble}`}>
                    {msg.text}
                  </div>
                )}
                
                {/* 如果 AI 回复中包含了课程推荐，则在下方循环渲染 CourseCard */}
                {!isUser && msg.recommendedCourses && msg.recommendedCourses.length > 0 && (
                  <div className={styles.coursesList}>
                    {msg.recommendedCourses.map((course, idx) => (
                      <CourseCard key={idx} course={course} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 当正在请求后端思考时，展示 Loading 动画 */}
        {isLoading && (
          <div className={`${styles.messageRow} ${styles.aiRow}`}>
            <div className={`${styles.avatar} ${styles.aiAvatar}`}>
              <Sparkles size={20} />
            </div>
            <div className={`${styles.messageContent} ${styles.aiContent}`}>
              <div className={styles.senderName}>AI Assistant</div>
              <div className={styles.loadingBubble}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* 这个空白的 div 作为滚动目标点插入到列表的最末尾 */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
