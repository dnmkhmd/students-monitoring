// LoginPage.tsx
import React, { useState } from 'react';
import { Input, Button, message, Space, Radio, Divider } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface LoginPageProps {
  onLogin: (success: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t, i18n } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('viewer');
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      message.error(i18n.language === 'en' ? 'Please fill in all fields' : 'Пожалуйста, заполните все поля');
      return;
    }
    
    setLoading(true);
    try {
      if (isRegister) {
        // Register flow
        await axios.post('http://localhost:8000/register', {
          email,
          password,
          full_name: fullName,
          role
        });
        message.success(i18n.language === 'en' ? 'Registration successful! Please login.' : 'Регистрация успешна! Теперь вы можете войти.');
        setIsRegister(false);
        setPassword('');
      } else {
        // Login flow
        const response = await axios.post('http://localhost:8000/login', {
          email,
          password
        });
        const { access_token, role: userRole, email: userEmail, full_name } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userFullName', full_name);
        
        // Add welcome notification
        const welcomeNotif = {
          id: Date.now(),
          message: t('notif_welcome'),
          date: new Date().toLocaleTimeString()
        };
        localStorage.setItem('user_notifications', JSON.stringify([welcomeNotif]));

        message.success(i18n.language === 'en' ? 'Welcome!' : 'Добро пожаловать!');
        onLogin(true);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || (i18n.language === 'en' ? 'Authentication error' : 'Ошибка авторизации');
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)', // Premium Emerald Gradient
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      {/* Language Selector */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 1001 }}>
        <Space style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
          <GlobalOutlined style={{ color: 'white' }} />
          <span 
            onClick={() => handleLanguageChange('kk')} 
            style={{ color: i18n.language === 'kk' ? '#10b981' : 'white', cursor: 'pointer', fontWeight: i18n.language === 'kk' ? 'bold' : 'normal' }}
          >
            KAZ
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span 
            onClick={() => handleLanguageChange('ru')} 
            style={{ color: i18n.language === 'ru' ? '#10b981' : 'white', cursor: 'pointer', fontWeight: i18n.language === 'ru' ? 'bold' : 'normal' }}
          >
            RUS
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span 
            onClick={() => handleLanguageChange('en')} 
            style={{ color: i18n.language === 'en' ? '#10b981' : 'white', cursor: 'pointer', fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}
          >
            ENG
          </span>
        </Space>
      </div>

      {/* Container with Logo */}
      <div style={{ marginBottom: 20, animation: 'fadeInDown 1s ease-out', textAlign: 'center' }}>
        <img 
          src="/logo_official.svg" 
          alt="Logo" 
          style={{ 
            height: '140px', 
            width: 'auto',
            filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))'
          }} 
        />
      </div>

      {/* Form Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        padding: '36px',
        borderRadius: '24px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        width: '360px',
        animation: 'fadeInUp 1s ease-out'
      }}>
        <h2 style={{ color: 'white', marginBottom: '24px', fontWeight: 300, letterSpacing: '1px' }}>
          {isRegister ? t('reg_title') : t('auth_title')}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {isRegister && (
            <Input
              placeholder={t('name_placeholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />}
              style={{
                height: '45px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '15px'
              }}
              className="login-input"
            />
          )}

          <Input
            placeholder={t('email_placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />}
            style={{
              height: '45px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '15px'
            }}
            className="login-input"
          />

          <Input.Password
            placeholder={t('password_placeholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />}
            style={{
              height: '45px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '15px'
            }}
            className="login-input"
            onPressEnter={handleAuth}
          />

          {isRegister && (
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                {t('role_label')}
              </span>
              <Radio.Group 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', display: 'flex', gap: '10px' }}
              >
                <Radio value="viewer" style={{ color: 'white' }}>{t('role_viewer')}</Radio>
                <Radio value="admin" style={{ color: 'white' }}>{t('role_admin')}</Radio>
              </Radio.Group>
            </div>
          )}
          
          <Button 
            type="primary" 
            onClick={handleAuth} 
            loading={loading}
            style={{
              width: '100%',
              height: '45px',
              borderRadius: '12px',
              background: '#10b981', // Emerald 500
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
              marginTop: '10px'
            }}
          >
            {isRegister ? t('register').toUpperCase() : t('login').toUpperCase()}
          </Button>
          
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />
          
          <span 
            onClick={() => setIsRegister(!isRegister)} 
            style={{ color: '#10b981', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#34d399'}
            onMouseOut={(e) => e.currentTarget.style.color = '#10b981'}
          >
            {isRegister ? t('have_account') : t('no_account')}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-input {
          border-radius: 8px !important;
        }
        .login-input .ant-input {
          background: transparent !important;
          color: white !important;
        }
        .login-input .ant-input-password-icon {
          color: rgba(255,255,255,0.7) !important;
        }
        .login-input::placeholder {
          color: rgba(255,255,255,0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
