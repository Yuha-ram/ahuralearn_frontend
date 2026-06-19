import axios from 'axios';
import {
  showToast
} from '../components/common/toast';

const request = axios.create({
  baseURL: 'http://localhost:8081/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =======================
// 模块二：请求拦截器 (Request)
// =======================
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 中获取 access token
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers['accessToken'] = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =======================
// 模块三：响应拦截器 (Response) 与无感刷新
// =======================
let isRefreshing = false; // 全局刷新锁，防止并发触发多次刷新
let requestsQueue = []; // 并发请求挂起队列

request.interceptors.response.use(
  async (response) => {
    // response.data is mapping to 'Result' {code, msg, data}
    const result = response.data;

    // success
    if (result.code === 200) {
      return result.data; // Directly return the data part of Result
    }

    // Token has expired or needs refresh (assuming code 4011)
    if (result.code === 4011) {
      const originalRequest = response.config;

      // Ensure we haven't retried yet, and aren't trying to refresh the refresh token itself
      if (!originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
        originalRequest._retry = true; // Mark as retrying

        if (isRefreshing) {
          // [队列机制] 如果当前正在刷新 Token，将当前失败的请求收集起来
          return new Promise((resolve) => {
            requestsQueue.push((newAccessToken) => {
              originalRequest.headers['accessToken'] = newAccessToken;
              resolve(request(originalRequest));
            });
          });
        }

        // 锁定状态，表示开始刷新 Token
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('Refresh token not found');
          }

          // 使用原生 axios
          const res = await axios.post(
            'http://localhost:8081/auth/refresh',
            null, {
              headers: {
                'Authorization-Refresh': refreshToken
              }
            }
          );

          // 取出后端派发的新 token (依据实际接口格式)
          const newAccessToken = res.data?.data?.accessToken;
          const newRefreshToken = res.data?.data?.refreshToken;

          if (!newAccessToken) {
            throw new Error('Failed to get new access token');
          }

          // 保存新 token
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          // 修改当前原始引发 4011 的请求的头部
          originalRequest.headers['accessToken'] = newAccessToken;

          // [队列执行] 遍历刚刚被挂起的其他请求，为他们换上新 token 并重新发起
          requestsQueue.forEach(callback => callback(newAccessToken));
          requestsQueue = [];

          // 将最开始的请求重发并返回
          return request(originalRequest);

        } catch (refreshError) {
          // 如果刷新失败：大概率是 refreshToken 也过期了或者被篡改
          requestsQueue = [];
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          showToast('Login expired. Please log in again.', 'error');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    
    // failed: other business errors
    return Promise.reject(new Error(result.msg || 'Error'));
  },
  (error) => {
    // 针对非 200 HTTP 状态码的真实网络错误或服务器异常
    return Promise.reject(error);
  }
);

export default request;