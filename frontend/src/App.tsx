import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, ConfigProvider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import StudentTable from './components/StudentTable';
import LoginPage from './components/LoginPage';
import './App.css';

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Проверка сессии при загрузке
  useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isAuthenticated) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#10b981' } }}>
        <LoginPage onLogin={handleLogin} />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#10b981', // Изменяем на изумрудный для консистентности
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', background: '#064e3b', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo_official.svg" alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>
              TULEKTER
            </div>
          </div>
          <div 
            onClick={handleLogout} 
            style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px' }}
          >
            Выйти
          </div>
        </Header>
        <Layout>
          <Sider width={220} style={{ background: colorBgContainer }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0, paddingTop: '16px' }}
              items={[
                {
                  key: '1',
                  icon: <UserOutlined />,
                  label: 'Студенттер',
                },
              ]}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              style={{
                padding: 24,
                margin: '16px 0',
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <StudentTable />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;