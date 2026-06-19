import React, { useState } from 'react';
import Overview from '../Overview';
import SyllabusList from '../SyllabusList';
import styles from './CourseTabs.module.css';

export default function CourseTabs({ courseData }) {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className={styles.courseTabsWrapper}>
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabItem} ${activeTab === 'Overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('Overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'Syllabus' ? styles.active : ''}`}
          onClick={() => setActiveTab('Syllabus')}
        >
          Syllabus
        </button>
      </div>

      <div className={styles.tabContentArea}>
        {activeTab === 'Overview' && (
          <Overview courseData={courseData} />
        )}

        {activeTab === 'Syllabus' && (
          <SyllabusList syllabusData={courseData?.syllabus || []} />
        )}
      </div>
    </div>
  );
}
