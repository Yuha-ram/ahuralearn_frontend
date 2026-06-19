import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * 初学者指南：路由守卫 (Route Guard) 组件
 * 它的作用是包裹在特定的路由外面，起到“保安”的作用。
 * 如果没有满足条件（比如没登录），就把用户“赶”走（重定向）到另外的页面。
 */

/**
 * 私有路由守卫 (RequireAuth)
 * 用法：用于包裹需要登录才能访问的页面（如：/homepage, /course-search 等）
 * 逻辑：如果获取不到 refreshToken，说明用户没登录或登录失效，直接跳回 /login
 */
export const RequireAuth = () => {
  // 1. 关键：引入 location 监听路由变化，只要路由变了，这个组件就会重新执行
  const location = useLocation();

  // 我们只通过判断 localStorage 里是否有 refreshToken 来决定是否有权进入页面。
  // 不去深究 token 是否过期，真正的验证将在 Axios 拦截器里交给后端判断。
  const isAuthenticated = !!localStorage.getItem('refreshToken');

  if (!isAuthenticated) {
    // replace: true 表示替换当前历史记录，用户按返回键不会再回到刚才没权限的页面
    return <Navigate to="/login" replace />;
  }

  // <Outlet /> 是 react-router-dom 里的占位符，渲染所有被当前路由守卫包裹的子组件
  return <Outlet />;
};

/**
 * 反向路由守卫 (RequireGuest)
 * 用法：用于包裹 登录、注册 等只有“游客”才需要看的页面。
 * 逻辑：如果本地已经存在 refreshToken，说明已经登录过了，就没必要再看登录页了，直接跳转到首页 (/homepage)
 */
export const RequireGuest = () => {
  const isAuthenticated = !!localStorage.getItem('refreshToken');

  if (isAuthenticated) {
    return <Navigate to="/homepage" replace />;
  }

  return <Outlet />;
};
