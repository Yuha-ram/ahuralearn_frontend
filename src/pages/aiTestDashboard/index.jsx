// 修改 Dashboard.jsx 里的数据源
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/common/TopNav';
import Footer from '../../components/common/Footer';
import AdaptiveTestBar from '../../components/aiTestDashboard/AdaptiveTestBar';
import AssessmentSummary from '../../components/aiTestDashboard/AssessmentSummary';
import SkillMastery from '../../components/aiTestDashboard/SkillMastery';
import styles from './aiTestDashboard.module.css';
import { getDashboardSummary, getAvailableCourses } from '../../api/exam/exam';


const aiTestDashboard = () => {
 // 实例化 navigate
const navigate = useNavigate();


const [skills, setSkills] = useState([]);
const [summaryData, setSummaryData] = useState(null);
const [isLoading, setIsLoading] = useState(true); // 新增：控制加载状态（一开始肯定在加载）
const [hasHistory, setHasHistory] = useState(true);

// 🌟 新增弹窗相关状态
const [isModalOpen, setIsModalOpen] = useState(false);       // 控制弹窗显示/隐藏
const [courses, setCourses] = useState([]);                  // 存储下拉列表的课程数据
const [selectedCourse, setSelectedCourse] = useState('');    // 记录用户当前选中的课程 ID
const [isLoadingCourses, setIsLoadingCourses] = useState(false); // 弹窗内的加载状态


  useEffect(() => {
 // 🌟  在 useEffect 里定义一个异步(async)函数来发请求
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true); // 开始请求前，确保 loading 是 true

        // 发起 API 请求，等待 (await) 数据返回
        const response = await getDashboardSummary();
        
        // 检查：如果接口返回 null 或者没有 summary 数据
        const fetchedSkills = response?.data?.skills;
        const fetchedSummary = response?.data?.summary;

if (!fetchedSummary) {
          // 没拿到数据，说明是新用户没考过试
          setHasHistory(false);
        } else {
          // 拿到数据，正常渲染
          setHasHistory(true);
          setSkills(fetchedSkills);
          setSummaryData(fetchedSummary);
        }
        
      } catch (err) {
        console.error("获取 Dashboard 数据失败:", err);
        // 🌟 真实后端下，如果查不到历史记录返回 404 报错，也会进这里
        // 我们不抛红色的错误，而是优雅地把它当做“没考过试”的空状态处理
        setHasHistory(false);
      } finally {
        // finally 里的代码无论请求成功还是失败，都一定会执行
        setIsLoading(false); // 请求结束，关闭 loading 动画
      }
    };

    fetchDashboardData(); // 调用上面定义好的函数
  }, []);



 // 🌟 1. 打开弹窗，并去请求可选的课程列表
  const handleOpenTestModal = async () => {
    setIsModalOpen(true);        // 马上弹出框框
    setIsLoadingCourses(true);   // 显示"加载中..."

    try {
      const res = await getAvailableCourses();
      const courseList = res.data || [];
      setCourses(courseList);
      
      // 如果拿到课程列表，默认选中第一个课程
      if (courseList.length > 0) {
        setSelectedCourse(courseList[0].id);
      }
    } catch (error) {
      console.error("获取课程列表失败:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // 🌟 2. 弹窗中点击“确认”后，携带课程 ID 跳转！
  const handleConfirmStart = () => {
    if (!selectedCourse) {
      alert("Please select a module first!");
      return;
    }
    setIsModalOpen(false);
    
    // 🔥 将选中的课程 ID 通过 URL 参数带给考试页面 (例如: /exam?moduleId=module-001)
    // 这样之后考试页面的 API 就可以根据这个 ID 去请求对应的题目了！
    navigate(`/exam?moduleId=${selectedCourse}`); 
  };
 


  return (
    <div className={styles.page}>
      <div className={styles['header-zone']}>
      <TopNav />
      </div>

      <main className={styles.container}>
        <section className={styles['header-section']}>
          <h1 className={styles['main-title']}>Adaptive Assessment</h1>
          <p className={styles['header-description']}>
            Empowering your academic journey with AI driven adaptive tests. A dynamically adaptive test based on your skill level to efficiently reflect your weaknesses.
          </p>
        </section>

      {/* 根据 isLoading 状态，决定显示什么内容 */}
        {isLoading ? (
          // 状态 1：加载中
          <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280' }}>
            <h2>Loading your performance data... 🚀</h2>
          </div>
         ) : !hasHistory ? (
          // 🌟 状态 2：空状态 (新用户没考过试，展示普通文本和引导按钮)
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '16px', 
            border: '2px dashed #cbd5e1',
            margin: '20px 0'
          }}>
            <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>Welcome to Your AI Testing Hub! 🚀</h2>
            <p style={{ color: '#64748b', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
              It looks like you haven't taken any assessments yet. Start your first adaptive test to unlock your personalized Assessment Summary and Skill Mastery charts.
            </p>
            <button 
              onClick={handleOpenTestModal}
              style={{ 
                padding: '12px 28px', 
                backgroundColor: '#0b5edd', 
                color: 'white', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              Start Your First Test Now
            </button>
          </div>
        ) : (

          // 状态 3：老用户有数据，渲染真实的图表
          <>
        <section className={styles['content-grid']}>
          {/* 跳转逻辑已经在 AdaptiveTestBar 内部处理了 */}
          <AdaptiveTestBar onStartClick={handleOpenTestModal}/>
       
          <AssessmentSummary 
          score={summaryData?.score}
                maxScore={summaryData?.maxScore}
                improvement={summaryData?.improvement}
                date={summaryData?.date}
                duration={summaryData?.duration}
                focusArea={summaryData?.focusArea}
          />
        </section>

       <SkillMastery skills={skills} />
       </>
       )}
      </main>
    
      <div className={styles['footer-zone']}>
      <Footer />
      </div>

      {/* ========================================== */}
      {/* 🌟 新增：优雅的课程选择模态弹窗 (Modal) UI */}
      {/* ========================================== */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: '#ffffff', padding: '32px', borderRadius: '16px',
            width: '450px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Select Assessment Module</h2>
            <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>
              Choose the course module you want to be tested on. The AI will generate adaptive questions based on this topic.
            </p>

            {isLoadingCourses ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: '#0b5edd', fontWeight: '500' }}>
                Fetching available modules... ⏳
              </div>
            ) : (
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', marginBottom: '32px',
                  borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none',
                  fontSize: '15px', color: '#334155', backgroundColor: '#f8fafc',
                  cursor: 'pointer'
                }}
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: '#475569' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmStart} 
                disabled={isLoadingCourses || !selectedCourse}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0b5edd', color: '#fff', cursor: 'pointer', fontWeight: '600', opacity: (isLoadingCourses || !selectedCourse) ? 0.6 : 1 }}
              >
                Confirm & Start
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default aiTestDashboard;
