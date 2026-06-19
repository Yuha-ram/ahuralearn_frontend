import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchCourses } from '../../api/course/course';
import TopNav from '../../components/common/TopNav';
import FilterMenu from '../../components/courseSearch/FilterMenu';
import CourseCard from '../../components/courseSearch/CourseCard';
import Pagination from '../../components/courseSearch/Pagination';
import Footer from '../../components/common/Footer';
import styles from './courseSearch.module.css';

/**
 * 课程搜索页面 (父组件)
 * 负责整个页面的状态管理，包含过滤选项、课程列表、分页数据。
 */
export default function CourseSearch() {
  // 初学者指南：使用 useSearchParams 获取 URL 中的参数，例如 /course-search?keyword=react 中的 react
  // 同时，也使用 setSearchParams 来更新 URL。这样 URL 就是你的单一真实数据源（Single Source of Truth）。
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  // 核心状态管理
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  });

  // 初学者指南：将所有的“查询条件”直接从 URL 参数中读取，而不是使用 useState 生成一个新的对象。
  // 这样，在任何地方只要更新了 URL 参数，这里的 filters 对象就会自动跟着变，触发页面的重新渲染。
  const filters = {
    pageNo: parseInt(searchParams.get('pageNo')) || 1,
    pageSize: parseInt(searchParams.get('pageSize')) || 12,
    difficulty: searchParams.get('difficulty') || '',
    minRating: searchParams.get('minRating') || '',
    sortBy: searchParams.get('sortBy') || 'relevance'
  };

  // 初学者指南：useEffect 允许我们在某些状态数组（依赖项）变化时自动执行里面的逻辑
  // 这里的依赖项是 searchParams，意味着只要搜索参数（URL过滤条件）发生改变，就会重新请求后台数据。
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // 将 filter 对象和从 url 中取得的 keyword 合并成参数发给后端
        const response = await searchCourses({ ...filters, keyword });
        
        // // 假设后端返回的数据在 data.data 或者 response直接是标准格式
        // // 根据你提供的接口定义，返回结构是 { status, data: { pagination, courses } }
        // const { list: fetchedCourses, pagination } = response;
        
        // setCourses(fetchedCourses || []);
        // if (pagination) {
        //   setPaginationMeta(pagination);
        // }

        // 提取数据部分：
        // 1. 如果是真实的 axios 响应，数据在 response.data
        // 2. 如果后端格式包了一层 { code: 200, data: ... }
        // 3. 兼容本地 mock 直接 resolve({ data: ... })
        const actualData = response;

        // 兼容真实后端的 { list, pages, total } 以及 本地 Mock 的 { courses, pagination }
        const fetchedCourses = actualData.list || [];
        const totalPages = actualData.pages || actualData.pagination?.totalPages || 1;
        const totalRecords = actualData.total || actualData.pagination?.totalRecords || 0;
        
        setCourses(fetchedCourses);
        setPaginationMeta({
          currentPage: filters.pageNo,
          totalPages: totalPages,
          totalRecords: totalRecords
        });

      } catch (error) {
        console.error('Failed to fetch search courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [searchParams]);

  // 修改任意筛选条件的处理函数
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key); // 假如值为空，我们就直接把它从URL里删掉，保持干净
    }
    
    // 只要条件变了，为了避免查出空页，默认跳回到第 1 页
    // 如果修改的本身不是页数的话
    if (key !== 'pageNo') {
      newParams.set('pageNo', '1');
    }
    
    // 调用 setSearchParams 将所有的参数推送到地址栏，这就能让浏览器的前进后退功能生效！
    setSearchParams(newParams);
  };

  // 翻页的处理函数
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > paginationMeta.totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('pageNo', newPage.toString());
    setSearchParams(newParams);
  };

  // 清除过滤方法的处理函数
  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    // 清除所有的其余参数，只保留原本可能有的 keyword
    if (keyword) {
      newParams.set('keyword', keyword);
    }
    setSearchParams(newParams);
  };

  return (
    <div className={styles.pageContainer}>
      <TopNav />
      <main className={styles.mainContent}>
        {/* 顶部标题及过滤区域 */}
        <div className={styles.headerSection}>
          <FilterMenu filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* 课程列表主体区域 */}
        <div className={styles.gridSection}>
          {isLoading ? (
            // 加载中的骨架屏占位
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className={styles.skeletonCard}></div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            // 正常渲染课程网格
            <div className={styles.courseGrid}>
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            // 搜索不到内容时的空状态
            <div className={styles.emptyState}>
              <p>No courses found matching your criteria.</p>
              <button 
                className={styles.clearBtn}
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* 底部跨页组件 */}
        {!isLoading && courses.length > 0 && paginationMeta.totalPages > 1 && (
          <div className={styles.paginationSection}>
            <Pagination 
              currentPage={paginationMeta.currentPage} 
              totalPages={paginationMeta.totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
