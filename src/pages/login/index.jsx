import React from 'react';
import LeftBanner from '../../components/auth/LeftBanner';
import LoginForm from '../../components/auth/LoginForm';
import styles from './login.module.css';

export default function Login() {
  return (
    <div className={styles.pageContainer}>
      <LeftBanner />
      <div className={styles.formSection}>
        <LoginForm />
      </div>
    </div>
  );
}
