import React from 'react';
import styles from './Logo.module.css';
import logoImage from '../../../assets/images/logo.png';

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <img src={logoImage} alt="AhuraLearn Logo" className={styles.logoImage} />
      <h2 className={styles.logoText}>AhuraLearn</h2>
    </div>
  );
}
