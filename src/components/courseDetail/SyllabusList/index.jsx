import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './SyllabusList.module.css';

export default function SyllabusList({ syllabusData }) {
  // 初学者指南：记录当前哪个“手风琴”是展开的。只允许展开一个，存 id。如果没有展开就是 null。
  const [expandedId, setExpandedId] = useState(null);

  const toggleAccordion = (id) => {
    // 如果点的是已经展开的，就关掉；否则展开新点击的
    setExpandedId(prev => (prev === id ? null : id));
  };

  if (!syllabusData || syllabusData.length === 0) {
    return <div className={styles.syllabusEmptyText}>No syllabus available.</div>;
  }

  return (
    <div className={styles.syllabusContainer}>
      <h2 className={styles.syllabusTitle}>Syllabus</h2>
      <div className={styles.accordionList}>
        {syllabusData.map((item, index) => {
          const isExpanded = expandedId === item.id;
          
          return (
            <div 
              key={item.id || index} 
              className={`${styles.accordionItem} ${isExpanded ? styles.expanded : ''}`}
            >
              <div 
                className={styles.accordionHeader} 
                onClick={() => toggleAccordion(item.id)}
              >
                <div className={styles.accordionLeft}>
                  {/* 周数字图标圆圈 */}
                  <div className={styles.weekNumberCircle}>
                    {index + 1}
                  </div>
                  <div className={styles.accordionTitleBox}>
                    <h4 className={styles.accordionTitle}>{item.title}</h4>
                    <p className={styles.accordionSummary}>{item.description}</p>
                  </div>
                </div>
                
                <div className={styles.accordionRight}>
                  {isExpanded ? (
                    <ChevronUp className={styles.chevronIcon} size={24} />
                  ) : (
                    <ChevronDown className={styles.chevronIcon} size={24} />
                  )}
                </div>
              </div>
              
              {/* 初学者指南：这里判断如果是展开状态，就展示里面的内容。 */}
              {isExpanded && (
                <div className={styles.accordionBody}>
                  {item.sections && item.sections.length > 0 ? (
                    <ul className={styles.sectionList}>
                      {item.sections.map((section, idx) => (
                        <li key={section.id || idx} className={styles.sectionItem}>
                          <div className={styles.sectionLeft}>
                            <span className={styles.sectionIcon}>▶</span>
                            <span className={styles.sectionTitle}>{section.title}</span>
                          </div>
                          {(section.durationFormat || section.duration) && (
                            <span className={styles.sectionDuration}>
                              {section.durationFormat || `${section.duration} seconds`}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.placeholderText}>
                      No sections available for this chapter.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
