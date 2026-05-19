// App.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, ConfigProvider, Popover, Badge, Button, Space, Modal, App as AntdApp } from 'antd';
import { UserOutlined, FileTextOutlined, MessageOutlined, BellOutlined, GlobalOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import StudentTable from './components/StudentTable';
import LoginPage from './components/LoginPage';
import VacanciesPage from './components/VacanciesPage';
import FeedbackPage from './components/FeedbackPage';
import ProfilePage from './components/ProfilePage';
import './App.css';

const { Header, Content, Sider } = Layout;

interface AppNotification {
  id: number;
  message: string;
  date: string;
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeMenuKey, setActiveMenuKey] = useState<string>('1');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Check login and load notifications
  useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    const loadedNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    setNotifications(loadedNotifications);
    setUnreadCount(loadedNotifications.length);
  }, [isAuthenticated]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: t('confirm_title'),
      content: t('logout_confirm_content'),
      okText: t('yes'),
      cancelText: t('no'),
      onOk: () => {
        setIsAuthenticated(false);
        localStorage.clear();
        setNotifications([]);
        setUnreadCount(0);
      }
    });
  };

  const clearNotifications = () => {
    localStorage.setItem('user_notifications', JSON.stringify([]));
    setNotifications([]);
    setUnreadCount(0);
  };

  // Render the selected view
  const renderContent = () => {
    switch (activeMenuKey) {
      case '1':
        return <StudentTable />;
      case '2':
        return <VacanciesPage />;
      case '3':
        return <FeedbackPage />;
      case '4':
        return <ProfilePage />;
      default:
        return <StudentTable />;
    }
  };

  if (!isAuthenticated) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#10b981' } }}>
        <AntdApp>
          <LoginPage onLogin={handleLogin} />
        </AntdApp>
      </ConfigProvider>
    );
  }

  // Notifications Popover Content
  const notificationContent = (
    <div style={{ width: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
        <strong style={{ color: '#064e3b' }}>{t('notif_title')}</strong>
        {notifications.length > 0 && (
          <Button type="link" size="small" onClick={clearNotifications} style={{ color: '#10b981', padding: 0 }}>
            {i18n.language === 'en' ? 'Clear' : 'Очистить'}
          </Button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#999' }}>
          {t('notif_empty')}
        </div>
      ) : (
        <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map((item) => (
            <div key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
              <div style={{ color: '#333', lineHeight: '1.4' }}>{item.message}</div>
              <div style={{ color: '#999', fontSize: '11px', marginTop: '4px' }}>{item.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#10b981', // Premium Emerald Color System
          borderRadius: 12,
        },
      }}
    >
      <AntdApp>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ display: 'flex', alignItems: 'center', background: '#064e3b', justifyContent: 'space-between', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo_official.svg" alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
              <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>
                {t('app_title')}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Language Selector */}
              <Space style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: '16px' }}>
                <GlobalOutlined style={{ color: 'white' }} />
                <span 
                  onClick={() => handleLanguageChange('kk')} 
                  style={{ color: i18n.language === 'kk' ? '#10b981' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: i18n.language === 'kk' ? 'bold' : 'normal' }}
                >
                  KAZ
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>|</span>
                <span 
                  onClick={() => handleLanguageChange('ru')} 
                  style={{ color: i18n.language === 'ru' ? '#10b981' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: i18n.language === 'ru' ? 'bold' : 'normal' }}
                >
                  RUS
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>|</span>
                <span 
                  onClick={() => handleLanguageChange('en')} 
                  style={{ color: i18n.language === 'en' ? '#10b981' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}
                >
                  ENG
                </span>
              </Space>

              {/* Notifications Icon with Badge */}
              <Popover content={notificationContent} trigger="click" placement="bottomRight">
                <Badge count={unreadCount} overflowCount={9} style={{ background: '#ef4444' }}>
                  <Button 
                    type="text" 
                    icon={<BellOutlined style={{ fontSize: '20px', color: 'white' }} />} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  />
                </Badge>
              </Popover>
              
              {/* Logout Link */}
              <div 
                onClick={handleLogout} 
                style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                className="logout-btn"
              >
                <LogoutOutlined />
                <span>{t('logout')}</span>
              </div>
            </div>
          </Header>
          <Layout>
            <Sider width={240} style={{ background: colorBgContainer, boxShadow: '2px 0 8px rgba(0,0,0,0.02)' }}>
              <Menu
                mode="inline"
                selectedKeys={[activeMenuKey]}
                onClick={(e) => setActiveMenuKey(e.key)}
                style={{ height: '100%', borderRight: 0, paddingTop: '16px' }}
                items={[
                  {
                    key: '1',
                    icon: <UserOutlined style={{ fontSize: '16px' }} />,
                    label: t('students'),
                  },
                  {
                    key: '2',
                    icon: <FileTextOutlined style={{ fontSize: '16px' }} />,
                    label: t('vacancies'),
                  },
                  {
                    key: '3',
                    icon: <MessageOutlined style={{ fontSize: '16px' }} />,
                    label: t('feedback'),
                  },
                  {
                    key: '4',
                    icon: <UserOutlined style={{ fontSize: '16px' }} />, // Profile/Cabinet icon
                    label: t('profile'),
                  },
                ]}
              />
            </Sider>
            <Layout style={{ padding: '24px' }}>
              <Content
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                {renderContent()}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;