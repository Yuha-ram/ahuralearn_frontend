import React from 'react';
import LeftBanner from '../../components/auth/LeftBanner';
import SignupForm from '../../components/auth/SignupForm';
import styles from './signup.module.css';

export default function Signup() {
  return (
    <div className={styles.pageContainer}>
      <LeftBanner />
      <div className={styles.formSection}>
        <SignupForm />
      </div>
    </div>
  );
}
