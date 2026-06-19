import React from 'react';
import styles from './filterMenu.module.css';

/**
 * 初学者指南：过滤菜单组件 (FilterMenu)
 * 该组件负责向用户展示下拉筛选框。
 * 它不自己存储“选中的值”，而是通过 `filters` 属性从父组件读取，
 * 当用户更改选项时，调用父组件传下来的 `onFilterChange` 方法通知父组件更新。
 * 这种模式被称为“受控组件”或“状态提升”。
 */
export default function FilterMenu({ filters, onFilterChange }) {
  return (
    <div className={styles.filterMenuContainer}>
      <div className={styles.filtersWrapper}>
        {/* Rating Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Course Rating</label>
          <div className={styles.selectWrapper}>
            <select 
              className={styles.select}
              value={filters.minRating}
              onChange={(e) => onFilterChange('minRating', e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="4.5">4.5 & Up</option>
              <option value="4.0">4.0 & Up</option>
              <option value="3.5">3.5 & Up</option>
            </select>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Difficulty</label>
          <div className={styles.selectWrapper}>
            <select 
              className={styles.select}
              value={filters.difficulty}
              onChange={(e) => onFilterChange('difficulty', e.target.value)}
            >
              <option value="">Any Difficulty</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sort Filter */}
      <div className={styles.sortWrapper}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Sort by</label>
          <div className={styles.selectWrapper}>
            <select 
              className={styles.select}
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
            >
              <option value="relevance">Most Relevant</option>
              <option value="highest_rated">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
