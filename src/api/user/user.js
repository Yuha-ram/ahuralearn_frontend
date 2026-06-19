import request from '../request';

export const loginAPI = (data) => {
  return request.post('/auth/login', data);
};

export const registerAPI = (data) => {
  return request.post('/auth/register', data);
};

export const checkUsernameAPI = (username) => {
  return request.get(`/auth/users/exists?username=${username}`);
};

export const getSimpleInfo = () => {
  return request.get('/user/simpleInfo');
};

export const logoutAccount = async () => {
  return request.post('/auth/logout');
};

// GXC
import { myInformationMock } from './MyInformationMock';

// My Information 页面接口：默认使用 mock 数据，设置 VITE_USE_MOCK_API=false 后请求真实后端。
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';
const mockDelay = 500;

// 统一模拟接口响应延迟，保持页面 loading 效果和真实请求接近。
function mockResponse(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, mockDelay);
  });
}

// 获取 My Information 页面初始化数据，包括个人信息、学习统计和学习档案。
export async function getMyInformationPageData() {
  if (useMockApi) {
    return mockResponse(myInformationMock);
  }

  return request.get('/myInformation');
}

// 更新用户基础资料，例如姓名、角色、简介等。
export async function updateProfile(profileData) {
  if (useMockApi) {
    return mockResponse(profileData);
  }

  return request.put('/profile', profileData);
}

// 更新用户学习档案，例如学习目标、偏好方向和当前学习重点。
export async function updateLearningProfile(learningProfileData) {
  if (useMockApi) {
    return mockResponse(learningProfileData);
  }

  return request.put('/profile/learningProfile', learningProfileData);
}

// 上传用户头像，真实接口接收 FormData。
export async function uploadAvatar(formData) {
  if (useMockApi) {
    return mockResponse({
      avatarUrl: '/mock-avatar.png',
    });
  }

  return request.post('/profile/avatar', formData);
}

// 分享用户资料或学习档案。
export async function shareProfile(data) {
  if (useMockApi) {
    return mockResponse({
      success: true,
    });
  }

  return request.post('/profile/share', data);
}
