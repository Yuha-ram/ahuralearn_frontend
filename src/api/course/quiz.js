import request from '../request';

/**
 * 获取课程对应的课后测验题目
 * @param {string|number} lessonId 课程ID
 */
export const fetchQuizQuestions = (lessonId) => {
  return request.get('/api/quiz/questions', { params: { lessonId } });
};

/**
 * 提交用户的测验答案
 * @param {object} submitPayload 包含 lessonId 和 answers 数组的对象
 */
export const submitQuizAnswers = (submitPayload) => {
  return request.post('/api/quiz/submit', submitPayload);
};
