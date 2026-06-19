import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchQuizQuestions, submitQuizAnswers } from '../../api/course/quiz';
import QuestionCard from '../../components/postClassQuiz/QuestionCard';
import ProgressPanel from '../../components/postClassQuiz/ProgressPanel';
import NavigationButtons from '../../components/postClassQuiz/NavigationButtons';
import SubmitConfirmModal from '../../components/postClassQuiz/SubmitConfirmModal';
import styles from './postClassQuiz.module.css';

/**
 * 课后测验父组件 (PostClassQuiz)
 * 负责进行整体的状态管理（状态下钻给子组件），与后端通讯，计算派生状态等
 */
export default function PostClassQuiz() {
  // 从 URL 参数中提取 lessonId，例如路由为 /quiz/101，则 lessonId 就是 101
  const { lessonId } = useParams();

  // 使用 useNavigate 钩子来进行页面跳转
  const navigate = useNavigate();

  // ----- 页面呈现相关状态 -----
  const [questions, setQuestions] = useState([]);      // 存储从后端拉取的5道题数据
  const [isLoading, setIsLoading] = useState(true);    // 页面是否还在发请求加载中
  const [error, setError] = useState(null);            // 发现错误时的文案记录

  // ----- 答题相关核心状态 -----
  // currentIndex: 记录当前界面显示的是哪一题 (0 代表第一题，最大值为 总题数 - 1)
  const [currentIndex, setCurrentIndex] = useState(0);

  // answers: 核心的本地答题缓存，数组，每一项存储如下内容: 
  // { questionId: 1, selectedOption: 'B', isFlagged: false }
  const [answers, setAnswers] = useState([]);

  // ----- 弹窗与提交相关状态 -----
  // 控制 SubmitConfirmModal 弹窗是否显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 控制“正在提交”状态，可以用来封禁按钮避免重复点击（本例暂留作基础处理）
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 【核心功能 1：初始化拉取数据】
  // useEffect 的意思是：当组件第一次展示到网页 (挂载) 时，或者当 URL 中的 lessonId 改变时，去向后端请求数据。
  useEffect(() => {
    // 异步函数专门处理可能需要很长时间的请求行为
    const loadData = async () => {
      try {
        // 先设为加载中
        setIsLoading(true);

        // --- 下面是正规的获取题目的代码（被注释掉是因为后端还没好，防止报错崩溃） ---
        // const res = await fetchQuizQuestions(lessonId);
        // const backendData = res.data?.data || res.data; 

        // 为了方便你（初学者）看效果，我们在这提供一份 mock 假数据兜底：
        const mockQuestions = [
          {
            id: 101, // 问题ID
            title: "Which of the following is a valid declaration of a float variable in Java?", // 题干
            options: [
              { value: 'A', text: 'float f = 1.2;' },
              { value: 'B', text: 'float f = 1.2f;' },
              { value: 'C', text: 'float f = (double)1.2;' },
              { value: 'D', text: 'float f = "1.2";' },
            ]
          },
          {
            id: 102,
            title: "What is the size of an int variable in Java?",
            options: [
              { value: 'A', text: '8 bits' },
              { value: 'B', text: '16 bits' },
              { value: 'C', text: '32 bits' },
              { value: 'D', text: '64 bits' },
            ]
          },
          {
            id: 103,
            title: "Which operator is used to allocate memory to array variable in Java?",
            options: [
              { value: 'A', text: 'malloc' },
              { value: 'B', text: 'alloc' },
              { value: 'C', text: 'new' },
              { value: 'D', text: 'new malloc' },
            ]
          },
          {
            id: 104,
            title: "What is the default value of a local variable?",
            options: [
              { value: 'A', text: 'null' },
              { value: 'B', text: '0' },
              { value: 'C', text: 'Depends on the data type' },
              { value: 'D', text: 'No default value for local variables' },
            ]
          },
          {
            id: 105,
            title: "Which of these cannot be used for a variable name in Java?",
            options: [
              { value: 'A', text: 'identifier & keyword' },
              { value: 'B', text: 'identifier' },
              { value: 'C', text: 'keyword' },
              { value: 'D', text: 'none of the mentioned' },
            ]
          }
        ];

        // 把题库数据存到组件状态中
        setQuestions(mockQuestions);

        // 【初学者贴士】根据请求到的题库，我们生成一份空白的 `answers` 数据结构
        // 因为每个题目在最初都没作答、也没被标记。
        const initAnswers = mockQuestions.map(q => ({
          questionId: q.id,
          selectedOption: null, // 表示还没选
          isFlagged: false      // 表示默认没被标记
        }));

        setAnswers(initAnswers);

      } catch (err) {
        // 万一获取失败，给个错误提示
        console.error("Failed to load quiz", err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        // finally 意思是：不管成功或失败，最后都要把加载状态关掉，以便显示界面
        setIsLoading(false);
      }
    };

    // 只要有 lessonId 才开始加载
    if (lessonId) {
      loadData();
    }
  }, [lessonId]);

  // 【核心功能 2：基于核心状态，计算出派生的状态】
  // 根据题目要求，不要用多余的 useState。每次更新答案或标记，这段代码都会重新执行。
  // 通过 JS 数组过滤出所有被做了 `isFlagged: true` 标记的题目数量。
  const flaggedCount = answers.filter(a => a.isFlagged).length;

  // 【核心功能 3：处理左侧卡片的事件回调】
  // 当用户选择选项时触发
  const handleOptionSelect = (qId, optionValue) => {
    // React 中修改数组状态的正规方法：不要直接改，而是 map 复制一份新的。
    setAnswers(prev => prev.map(ans =>
      // 找到发生改动的那一题修改选项，其它的不要动它们
      // 如果用户点了已经选中的选项，我们就把它取消选中（toggle 逻辑），否则就选中新的选项
      ans.questionId === qId ? { ...ans, selectedOption: (optionValue === ans.selectedOption ? null : optionValue) } : ans
    ));
  };

  // 当用户点击右上角那面小红旗（收藏）时触发
  const handleToggleFlag = (qId) => {
    setAnswers(prev => prev.map(ans =>
      // 找到那题，然后把它的 isFlagged 这个布尔值反转 (true变false，false变true)
      ans.questionId === qId ? { ...ans, isFlagged: !ans.isFlagged } : ans
    ));
  };

  // 【核心功能 4：处理下一题/上一题/完成】
  const handlePrev = () => {
    // 只要保证当前的题目不是第一题，就跳转上一题
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    // 只要保证当前的题目不是最后一题，就跳转下一题
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  // 用户点击 Finished 或 Submit 按钮时，做第一次拦截判断
  const handleOpenSubmitModal = () => {
    // 检查是不是还有未作答的题目
    // (answeredCount: answers 中 selectedOption 有值的对象数量)
    const answeredCount = answers.filter(a => a.selectedOption).length;

    if (answeredCount < questions.length) {
      // 未达到 100% 拒绝提交
      alert(`您还有 ${questions.length - answeredCount} 道题未完成，请全部作答后再提交！`);
      return;
    }
    // 所有条件具备，则显示二次确认模态框
    setIsModalOpen(true);
  };

  // 【核心功能 5：确认提交 (向后端发请求)】
  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);

      // 按照文档要求的 JSON 字段格式重新整理数据给后端
      const payload = {
        lessonId: parseInt(lessonId, 10),
        answers: answers.map(a => ({
          questionId: a.questionId,
          selectedOption: a.selectedOption
        }))
      };

      // 调用接口给后端：
      // await submitQuizAnswers(payload);

      // 成功后关闭弹窗
      setIsModalOpen(false);

      // 【将页面平滑重定向到回之前的课件重学或其他结果页】
      navigate(`/learning/java/${lessonId}`);
      // （根据你目前的URL架构动态决定了，如果你们目前还没设计好 result 页面，就指引回 lesson）

    } catch (err) {
      console.error(err);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 顶部左上角：返回上一页
  const handleGoBack = () => {
    // useNavigate(-1) 是 React Router 专属的方法：在浏览器历史里回退 1 步。
    navigate(-1);
  };

  // ----- 以下是界面呈现部分 -----

  if (isLoading) {
    return <div className={styles.quizPage}><div className={styles.loadingWrapper}>Loading quiz questions...</div></div>;
  }

  if (error) {
    return <div className={styles.quizPage}><div className={styles.errorWrapper}>{error}</div></div>;
  }

  // 抽出我们需要往下传递的数据（只针对当前屏幕上的这一道题）
  const currentQuestion = questions[currentIndex];
  // 查找出用户的针对此题的回答数据
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  return (
    <div className={styles.quizPage}>
      {/* 顶部通栏 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>
          <ArrowLeft size={20} />
          Back to lesson
        </button>
      </header>

      {/* 采用 Grid 划分的主体两栏布局容器 (2.5对应左侧 : 1对应右侧) */}
      <main className={styles.mainContainer}>
        {/* 左侧：引入刚刚拆分的 QuestionCard */}
        <QuestionCard
          question={currentQuestion}
          currentIndex={currentIndex}
          currentAnswer={currentAnswer}
          onOptionSelect={handleOptionSelect}
          onToggleFlag={handleToggleFlag}
        >
          {/* 这里是利用组件的 "子组件插槽功能 (children)" 将 NavigationButtons 塞入其底部 */}
          <NavigationButtons
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onFinish={handleOpenSubmitModal}
          />
        </QuestionCard>

        {/* 右侧：引入进度面板 */}
        <ProgressPanel
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          onSelectQuestion={(idx) => setCurrentIndex(idx)}
          onSubmitQuiz={handleOpenSubmitModal}
        />
      </main>

      {/* 将拦截确认弹窗独立，只有 isOpen 为 true 时展示内容 */}
      <SubmitConfirmModal
        isOpen={isModalOpen}
        flaggedCount={flaggedCount}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
