import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { registerAPI, checkUsernameAPI } from '../../../api/user/user';
import Logo from '../../common/Logo';
import styles from './SignupForm.module.css';
import {showToast} from '../../common/toast';

export default function SignupForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  
  // Specific error states for inline validation
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorText) setErrorText('');
    if (name === 'username' && usernameError) setUsernameError('');
  };

  const handleUsernameBlur = async () => {
    if (!formData.username) return;
    
    // Initial Format Validation
    const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
    if (!usernameRegex.test(formData.username)) {
      setUsernameError('Username must be at least 4 characters long and only contain letters and numbers.');
      return;
    }

    // Call API to check if username exists
    setIsCheckingUsername(true);
    try {
      const response = await checkUsernameAPI(formData.username);
      // Assuming a backend response where data.exists is true if taken
      if (response && response.data && response.data.exists) {
        setUsernameError('Username is already taken.');
      }
    } catch (error) {
      // API might return 404/error in demo mode, ignore or assume ok if we can't connect,
      // but the request was made per requirements.
      console.log('Username check API failed/pending backend implementation.');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorText('Please fill in all fields.');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
    if (!usernameRegex.test(formData.username)) {
      setErrorText('Username must be at least 4 characters long and only contain letters and numbers.');
      return;
    }
    
    if (usernameError) {
      setErrorText('Please fix the username errors before submitting.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorText('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorText('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerAPI(formData);
    //还需在这做处理 判断是否注册成功 目前先假设只要API请求成功就算注册成功

      showToast('Signup Successful!', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Failed to create account.', 'error');
      setErrorText('Failed to connect to the server (Demo API).');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formBox}>
      <Logo />
      <div className={styles.formHeader}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>Join us and unlock your potential</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}><label className={styles.label}>Username</label></div>
          <div className={styles.inputWrapper}>
             <input type="text" name="username" value={formData.username} onChange={handleChange} onBlur={handleUsernameBlur} placeholder="Enter your username" className={styles.inputField} />
          </div>
          {isCheckingUsername && <p className={styles.infoText} style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '0.25rem' }}>Checking availability...</p>}
          {usernameError && <p className={styles.errorText} style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{usernameError}</p>}
        </div>
        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}><label className={styles.label}>Email Address</label></div>
          <div className={styles.inputWrapper}>
             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" className={styles.inputField} />
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}><label className={styles.label}>Password</label></div>
          <div className={styles.inputWrapper}>
             <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className={styles.inputField} />
             <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.togglePasswordBtn}>
               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}><label className={styles.label}>Confirm Password</label></div>
          <div className={styles.inputWrapper}>
             <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className={styles.inputField} />
             <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.togglePasswordBtn}>
               {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
          </div>
        </div>
        {errorText && <p className={styles.errorText}>{errorText}</p>}
        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? 'CREATING ACCOUNT...' : 'Create Account'}
        </button>
      </form>
      <div className={styles.bottomLinkText}>
        Already have an account?{' '}
        <Link to="/login" className={styles.bottomLink}>Sign in instead</Link>
      </div>
    </div>
  );
}
