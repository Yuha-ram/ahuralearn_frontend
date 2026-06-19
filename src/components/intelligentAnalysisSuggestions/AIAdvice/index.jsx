import React, { useState, useRef, useEffect } from 'react';
import styles from './aiAdvice.module.css';
import { sendChatMessage } from '../../../api/exam/exam';


const AIChatAssistant = () => {
  // 1. 定义状态
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: 'Hello! I am your AI study assistant. Based on your test results, I recommend reviewing "Supervised Learning". What specific concepts would you like to discuss?' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 控制 AI 思考状态
  
  // 用于自动滚动到最新消息的 Ref
  const chatEndRef = useRef(null);

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 2. 真实 API 驱动的处理发送消息的逻辑
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

// 先把用户的输入存到一个变量里，因为我们马上就要清空输入框了
    const userText = inputText.trim();

    // 立即显示用户的输入
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, newUserMsg]);
    
    // 清空输入框并显示 AI 加载动画
    setInputText('');
    setIsLoading(true);

    // ==========================================
    // 🔌 留给后端的 API 接入点 (TODO)
    // 以后在这里将 setTimeout 替换为 fetch/axios 请求
    // const response = await fetch('YOUR_BACKEND_API', { ... });
    // ==========================================
    // TODO: 替换为后端的真实 API 调用


    try {
      // 发送真实的网络 POST 请求（等待大模型返回结果）
      const response = await sendChatMessage(userText);
      
      // 请求成功，把后端返回的数据包装成消息对象
      const aiReply = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: response.data.reply 
      };
      
      // 将 AI 的回复追加到聊天列表中
      setMessages((prev) => [...prev, aiReply]);
      
    } catch (error) {
      console.error("AI 响应失败:", error);
      
      // 🌟 3. 错误处理：如果服务器挂了，AI 给一个友好的兜底提示
      const errorReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Sorry, I am having trouble connecting to the server right now. Please try again later."
      };
      setMessages((prev) => [...prev, errorReply]);
      
    } finally {
      // 无论请求成功还是失败，最后都要关闭加载动画
      setIsLoading(false);
    }
  };


  // 支持按下 Enter 键直接发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止默认换行
      handleSendMessage();
    }
  };

  return (
    <div className={styles['ai-chat-container']}>
      {/* 头部信息 */}
      <div className={styles['chat-header']}>
        <div className={styles.icon}>🤖</div>
        <div>
          <h2>AI Study Assistant</h2>
          <p>Ask me anything to clarify concepts or get deeper insights.</p>
        </div>
      </div>

      {/* 聊天记录展示区 */}
      <div className={styles['chat-window']}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles['chat-bubble-wrapper']} ${msg.sender === 'user' ? styles['user-wrapper'] : styles['ai-wrapper']}`}>
            <div className={`${styles['chat-bubble']} ${msg.sender === 'user' ? styles['user-bubble'] : styles['ai-bubble']}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* 当 AI 正在“思考”时显示的加载动画 */}
        {isLoading && (
          <div className={`${styles['chat-bubble-wrapper']} ${styles['ai-wrapper']}`}>
            <div className={`${styles['chat-bubble']} ${styles['ai-bubble']} ${styles['typing-indicator']}`}>
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        {/* 用于锚点定位，保证永远滚动到最底部 */}
        <div ref={chatEndRef} />
      </div>

      {/* 底部输入区 */}
      <div className={styles['chat-input-area']}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question... (Press Enter to send)"
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={!inputText.trim() || isLoading}
          className={styles['send-btn']}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatAssistant;