import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../../components/common/TopNav';
import Sidebar from '../../components/courseRecommendation/Sidebar';
import ChatArea from '../../components/courseRecommendation/ChatArea';
import InputArea from '../../components/courseRecommendation/InputArea';
import { fetchSessionMessages, sendRecommendMessage } from '../../api/ai/aiService';
import styles from './courseRecommendation.module.css';

/**
 * AI Course Recommendation 父组件
 * 负责整体的布局结构以及作为唯一的数据源管理组件交互
 */
export default function CourseRecommendation() {
  // 获取 URL 参数中的 sessionId
  const { sessionId } = useParams();
  
  // 用于路由跳转或替换，尤其是延迟生成会话 id 后
  const navigate = useNavigate();

  // 核心状态：当前会话的聊天消息数组
  const [messages, setMessages] = useState([]);
  
  // 核心状态：标示 AI 是否正在思考和请求中
  const [isLoading, setIsLoading] = useState(false);
  
  // 核心状态：控制左侧历史会话抽屉的开关
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 【核心功能 1：初始化加载逻辑】
  // 当组件挂载或者 sessionId 产生变化时，重新获取聊天记录
  useEffect(() => {
    const loadMessages = async () => {
      if (sessionId) {
        // 如果有着 sessionId，说明是查看历史对话
        setIsLoading(true);
        try {
          // 下方两行为真实调用接口，可以取消注释
          // const res = await fetchSessionMessages(sessionId);
          // setMessages(res.data?.data || []);
          
          // 初学者福利：为了让你能在没后端时看到页面，用一个 mock 假数据替代
          setMessages([
            { role: 'user', text: 'I want to learn OOP. Can you recommend some courses based on my recent assessment results?' },
            { 
              role: 'assistant', 
              text: "I've analyzed your recent Java Fundamentals assessment. Since you have a solid grasp of basic syntax but need to strengthen your understanding of class inheritance and polymorphism, here are my top recommendations for you:",
              recommendedCourses: [
                {
                  title: "Mastering Object-Oriented Programming in Java",
                  level: "Simple Level",
                  reason: "Focuses on your inheritance gaps"
                },
                {
                  title: "Java Data Structures & OOP Principles",
                  level: "Intermediate Level",
                  reason: "Strengthens polymorphism concepts and practices by implementing standard data structures from scratch."
                }
              ]
            }
          ]);
        } catch (error) {
          console.error("Failed to load messages", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // 如果没有 sessionId，这意味着是新建了一个全新的对话，因此清空消息
        setMessages([]);
      }
    };

    loadMessages();
  }, [sessionId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  }

  // 【核心功能 2：处理发送消息，并在必要时“偷梁换柱”URL】
  const handleSendMessage = async (userMessage) => {
    // 1. 将用户的消息先放到本地列表中，让用户立刻看到自己发送的内容
    const newUserMsg = { role: 'user', text: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    
    // 开启 loading 展示后端正在处理
    setIsLoading(true);

    try {
      // 下方两行为真实调用接口并发给后端，暂时注释掉
      // const payload = { sessionId: sessionId || null, userMessage };
      // const res = await sendRecommendMessage(payload);
      // const aiResponse = res.data?.data || res.data;

      // 模拟请求后端等待的耗时（1.5秒）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟后端返回的数据结构
      const aiResponse = {
        sessionId: sessionId || 'new-session-123', // 如果是新聊天，后端返回一个全新的 ID
        replyText: "I've analyzed your request and found some great materials. Would you like me to tailor a study plan?",
        recommendedCourses: [] // 模拟可能没有课程的情况
      };

      // 2. 将 AI 的回复追加到记录中展示给用户
      const newAiMsg = {
        role: 'assistant',
        text: aiResponse.replyText,
        recommendedCourses: aiResponse.recommendedCourses
      };
      setMessages(prev => [...prev, newAiMsg]);

      // 3. 【重点逻辑：延迟创建会话偷换 URL (Lazy Creation)】
      // 检查：如果当前路由没有 sessionId (即新对话)，并且后端返回了新生成的 sessionId，
      // 我们需要通过 { replace: true } 将当前浏览器的地址悄悄替换成带有 sessionId 的那个。
      // 这样用户就可以使用刷新或分享链接，而不会产生新开一个“空对话”的历史记录栈堆叠。
      if (!sessionId && aiResponse.sessionId) {
        navigate(`/courseRecommendation/${aiResponse.sessionId}`, { replace: true });
      }

    } catch (error) {
      console.error("Failed to send message", error);
      // 万一失败了补充一条系统消息提示错误
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble processing your request right now." }]);
    } finally {
      // 不管成功失败，最后记得关掉 Loading 状态
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <TopNav />
      <div className={styles.layoutContainer}>
        {/* 左侧抽屉：展示历史记录列表 */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* 右侧为主操作区，包含中间的聊天瀑布流以及底部的输入框 */}
        <div className={styles.mainContent}>
          {/* 把全部的消息，以及当前的 loading 状态传递给中间聊天展示容器 */}
          <ChatArea messages={messages} isLoading={isLoading} />
          
          {/* 输入框负责接收打字内容，以及向上通信告知有人点击了发送 */}
          <InputArea onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
