/**
 * 优雅的 UI 提示 (Toast) 函数
 * 根据传入的 type 显示不同颜色的提示 (success, error, warning)
 */
export const showToast = (message, type = 'error') => {
  const toast = document.createElement('div');
  
  const types = {
    success: {
      bgColor: '#ecfdf5',
      textColor: '#065f46',
      borderColor: '#a7f3d0',
      shadowColor: 'rgba(16, 185, 129, 0.1)',
      icon: `<svg style="width: 20px; height: 20px; margin-right: 8px; flex-shrink: 0; color: #10b981;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    },
    error: {
      bgColor: '#fef2f2',
      textColor: '#991b1b',
      borderColor: '#fecaca',
      shadowColor: 'rgba(239, 68, 68, 0.1)',
      icon: `<svg style="width: 20px; height: 20px; margin-right: 8px; flex-shrink: 0; color: #ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    },
    warning: {
      bgColor: '#fffbeb',
      textColor: '#92400e',
      borderColor: '#fde68a',
      shadowColor: 'rgba(245, 158, 11, 0.1)',
      icon: `<svg style="width: 20px; height: 20px; margin-right: 8px; flex-shrink: 0; color: #f59e0b;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
    }
  };

  const config = types[type] || types.error;

  toast.innerHTML = `
    ${config.icon}
    <span>${message}</span>
  `;

  Object.assign(toast.style, {
    position: 'fixed',
    top: '24px',
    left: '50%',
    transform: 'translate(-50%, -10px)',
    backgroundColor: config.bgColor,
    color: config.textColor,
    border: `1px solid ${config.borderColor}`,
    padding: '12px 20px',
    borderRadius: '12px',
    boxShadow: `0 10px 15px -3px ${config.shadowColor}, 0 4px 6px -2px ${config.shadowColor}`,
    zIndex: '9999',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    opacity: '0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  });
  document.body.appendChild(toast);
  
  // 淡入和滑动动画
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  }, 10);
  
  // 3秒后淡出并移除
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -10px)';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
};
