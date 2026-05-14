import React, { useState } from 'react';
import { Input, Button, message, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';

interface LoginPageProps {
  onLogin: (success: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Имитация небольшой задержки для премиальности
    setTimeout(() => {
      if (code === '1957') {
        message.success('Добро пожаловать!');
        onLogin(true);
      } else {
        message.error('Неверный код доступа');
        setCode('');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)', // Изумрудный градиент
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      {/* Контейнер с логотипом */}
      <div style={{ marginBottom: 40, animation: 'fadeInDown 1s ease-out' }}>
        <img 
          src="/logo_official.svg" 
          alt="Logo" 
          style={{ 
            height: '180px', 
            width: 'auto',
            filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))'
          }} 
        />
      </div>

      {/* Форма ввода */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        width: '320px',
        animation: 'fadeInUp 1s ease-out'
      }}>
        <h2 style={{ color: 'white', marginBottom: '24px', fontWeight: 300, letterSpacing: '1px' }}>
          Введите код доступа
        </h2>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Input.Password
            placeholder="****"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            onPressEnter={handleSubmit}
            prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />}
            style={{
              height: '50px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '24px',
              textAlign: 'center',
              letterSpacing: '8px'
            }}
            className="login-input"
          />
          
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            loading={loading}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '12px',
              background: '#10b981', // Emerald 500
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
            }}
          >
            ВОЙТИ
          </Button>
        </Space>
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
