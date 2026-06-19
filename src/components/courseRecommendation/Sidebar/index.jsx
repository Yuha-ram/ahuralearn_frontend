import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Menu, PlusSquare, History, Settings } from 'lucide-react';
import { fetchHistorySessions } from '../../../api/ai/aiService';
import styles from './sidebar.module.css';

/**
 * 左侧历史会话侧边栏组件
 * @param {boolean} isOpen 侧边栏是否展开
 * @param {function} toggleSidebar 切换侧边栏展开/收起状态的方法
 */
export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const { sessionId: currentSessionId } = useParams();
  const [sessions, setSessions] = useState([]);

  // 组件挂载时请求历史会话列表
  useEffect(() => {
    const loadSessions = async () => {
      try {
        // 请求后台接口
        // const res = await fetchHistorySessions();
        // const data = res.data?.data || res.data;
        // setSessions(data);

        // 为了让你能看到效果，这里给一份 Mock 数据
        setSessions([
          { id: '101', title: 'Java basics help' },
          { id: '102', title: 'React router issues' },
          { id: '103', title: 'How to use Redux' },
        ]);
      } catch (err) {
        console.error('Failed to load history sessions', err);
      }
    };
    loadSessions();
  }, []);

  const handleNewChat = () => {
    // 跳转到没有 sessionId 的基础路由，实现"新建对话"
    navigate('/courseRecommendation');
  };

  const handleSelectSession = (id) => {
    // 点击某条历史记录，跳转到对应的对话详情
    navigate(`/courseRecommendation/${id}`);
  };

  return (
    <div className={`${styles.sidebarContainer} ${!isOpen ? styles.sidebarClosed : ''}`}>
      {/* 顶部操作区 */}
      <div className={styles.topActions}>
        <button className={styles.iconButton} onClick={toggleSidebar} title="Toggle sidebar">
          <Menu size={20} />
          <span className={styles.iconText}>Menu</span>
        </button>

        <button
          className={`${styles.iconButton} ${styles.newChatBtn}`}
          onClick={handleNewChat}
          title="New Chat"
        >
          <PlusSquare size={20} />
          <span className={styles.iconText}>New Chat</span>
        </button>

        {/* 历史记录按钮，在收起状态下显示，展开状态下可隐藏或作为头部 */}
        <button className={styles.iconButton} title="History">
          <History size={20} />
          <span className={styles.iconText}>History</span>
        </button>
      </div>

      {/* 历史记录列表区，只有展开时显示 */}
      <div className={styles.historySection}>
        <div className={styles.historyTitle}>Recent</div>
        <div className={styles.historyList}>
          {sessions.map(session => (
            <button
              key={session.id}
              className={`${styles.historyItem} ${currentSessionId === String(session.id) ? styles.historyItemActive : ''}`}
              onClick={() => handleSelectSession(session.id)}
            >
              {session.title}
            </button>
          ))}
        </div>
      </div>

      {/* 底部设置项 */}
      <div className={styles.bottomActions}>
        <button className={styles.iconButton} title="Settings">
          <Settings size={20} />
          <span className={styles.iconText}>Settings</span>
        </button>
      </div>
    </div>
  );
}
