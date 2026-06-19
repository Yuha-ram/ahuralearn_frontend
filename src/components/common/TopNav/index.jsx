import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { logoutAccount, getSimpleInfo } from '../../../api/user/user';
import styles from './TopNav.module.css';

// 假设本地 logo 已经存在 /assets/images/logo.png
import logoImage from '../../../assets/images/logo.png';

import { getNotificationsData } from "../../../api/notification/notifications";
import { showToast } from '../toast';
const notificationsUpdatedEvent = "notifications-updated";
const notificationStateKey = "__ahuralearnNotificationState";

function getNotificationState() {
  if (!window[notificationStateKey]) {
    window[notificationStateKey] = {
      acknowledgedPlanIds: [],
      deletedPlanIds: [],
    };
  }

  return window[notificationStateKey];
}

function getUnreadNotificationCount(plans = []) {
  const { acknowledgedPlanIds, deletedPlanIds } = getNotificationState();

  return plans.filter(
    (plan) =>
      !acknowledgedPlanIds.includes(plan.id) && !deletedPlanIds.includes(plan.id)
  ).length;
}

/**
 * 初学者指南：TopNav (顶栏组件)
 * 该组件提供了全局的导航功能，包含了搜索框、用户信息下拉展示，以及登出功能。
 */
export default function TopNav() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  const [notificationCount, setNotificationCount] = useState(0);

  // 模拟从本地缓存读取用户信息。实际项目中，往往在登录成功后把这些信息存入 localStorage
  const [userInfo, setUserInfo] = useState({
    username: 'Guest',
    email: 'guest@example.com',
    enrolledCourses: 0,
    avatar: 'https://via.placeholder.com/150'
  });

  // 控制个人信息下拉菜单的显示状态
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const hideTimeoutRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // 页面加载完成后，先尝试从 localStorage 获取用户信息并更新到组件状态 (State) 中，防止闪烁
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (err) {
        console.warn("Failed to parse stored user info", err);
      }
    }

    // 然后异步向后端请求最新的用户数据，并同步到本地与 State 中
    const fetchUserInfo = async () => {
      try {
        const response = await getSimpleInfo();
        const fetchedUser = response;
        if (fetchedUser) {
          // 如果后端返回的结构没提供头像等字眼，这里可以做一个合并或映射
          const updatedUser = {
            ...fetchedUser,
            // 假设缺少某些属性还可以合并默认值
            avatar: fetchedUser.avatar || 'https://ahuralearn.oss-ap-southeast-3.aliyuncs.com/user/avatar/defaultAvatar.jpg'
          };
          setUserInfo(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.warn("Failed to fetch user info from backend", error);
        // 为了演示，如果没有登录数据，可以给一个默认假数据测试
        if (!storedUser) {
          setUserInfo({
            username: 'Student 01',
            email: 'student01@gmail.com',
            enrolledCourses: 3,
            avatar: 'https://i.pravatar.cc/150?img=47'
          });
        }
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    let ignore = false;

    const updateNotificationCount = async () => {
      try {
        const notificationsData = await getNotificationsData();

        if (!ignore) {
          setNotificationCount(
            getUnreadNotificationCount(notificationsData.expiringPlans ?? [])
          );
        }
      } catch (err) {
        if (!ignore) {
          console.warn("Failed to load notification count", err);
        }
      }
    };

    updateNotificationCount();

    window.addEventListener(notificationsUpdatedEvent, updateNotificationCount);
    window.addEventListener("storage", updateNotificationCount);

    return () => {
      ignore = true;
      window.removeEventListener(
        notificationsUpdatedEvent,
        updateNotificationCount
      );
      window.removeEventListener("storage", updateNotificationCount);
    };
  }, []);

  /**
   * 处理搜索行为
   * 当用户在输入框里按下回车键时，我们要拿到输入框的文字，并将页面跳转到探索（搜索）页面。
   */
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      // if (searchKeyword.trim() !== '') {
      //   // 使用 useNavigate 提供的 navigate 函数进行 URL 的跳转，携带 query 参数
      //   navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
      // }

      // 使用 useNavigate 提供的 navigate 函数进行 URL 的跳转，携带 query 参数
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  /**
   * 登出处理
   * 调用后端登出接口，并清理用户数据，然后跳回登录页
   */
  const handleLogout = async () => {
    try {
      // 1. 发送网络请求，通知后端我们要登出（即使报错我们也应该清理前端缓存）
      await logoutAccount();
      showToast('Logout successful', "success");
    } catch (err) {
      console.warn("Logout request failed, proceeding to clear local state.", err);
      showToast('Logout failed', "error");
    } finally {
      // TODO 2. 清除浏览器缓存中的凭证信息信息
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');

      // 3. 强制页面跳转回登录页面
      navigate('/login');
    }
  };

  return (
    <div className={styles.topNavContainer}>
      <div className={styles.navLeft}>
        <div className={styles.logoArea}>
          <img src={logoImage} alt="AhuraLearn Logo" className={styles.logoIcon} />
          <h1 className={styles.logoTitle}>AhuraLearn</h1>
        </div>

        <div className={styles.navHomepage}>
          {/* 【修改点】：将Homepage包裹在一个Link组件中，跳转到/homepage */}
          <Link to="/homepage" className={styles.navLinkItem}>Homepage</Link>
        </div>
      </div>

      {/* 中部：搜索框 */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} onClick={handleSearch} />
        <input
          type="text"
          placeholder="What do you want to learn?"
          className={styles.searchInput}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className={styles.navRight}>
        <div className={styles.navExtraLinks}>
          {/* 【修改点】：追加 navLearnWithAI 样式类，进行专门的位置覆盖，不再受外层容器全局牵连。 */}
          <Link to="/featureHub" className={`${styles.navLinkItem} ${styles.navLearnWithAI}`}>Learn with AI</Link>
          <Link to="/dashboard" className={styles.navLinkItem}>My Profile</Link>
        </div>

        <div className={styles.navRightIcons}>
          <Link
            to="/notifications"
            className={styles.notificationIconWrapper}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className={styles.notificationBadge}>
                {notificationCount}
              </span>
            )}
          </Link>

          {/* 头像区域：鼠标放置上去展示 profileDropdownMenu */}
          <div 
            className={styles.avatarWrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img src={userInfo.avatar} alt="User Avatar" className={styles.avatarImage} />

            {/* 下拉悬浮菜单 */}
            <div className={`${styles.profileDropdownMenu} ${isDropdownVisible ? styles.dropdownVisible : ''}`}>
              <div className={styles.dropdownUserInfo}>
                <h3 className={styles.dropdownUsername}>{userInfo.username}</h3>
                <p className={styles.dropdownEmail}>{userInfo.email}</p>
                <p className={styles.dropdownEnrolled}>Enrolled Courses: {userInfo.enrolledCourses}</p>
              </div>
              {/* 点击执行 handleLogout 函数 */}
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
