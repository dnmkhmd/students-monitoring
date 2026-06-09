import React from 'react';
import { Layout, Menu, Space, Button, ConfigProvider, App as AntdApp } from 'antd';
import { GlobalOutlined, LogoutOutlined, UnorderedListOutlined, FormOutlined, PhoneOutlined, StarOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const StudentLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleLogout = () => {
    localStorage.removeItem('isStudentLoggedIn');
    window.location.href = '/';
  };

  const getSelectedKey = () => {
    if (location.pathname.includes('/student/vacancies')) return 'vacancies';
    if (location.pathname.includes('/student/form')) return 'form';
    if (location.pathname.includes('/student/contact')) return 'contact';
    if (location.pathname.includes('/student/reviews')) return 'reviews';
    return 'form';
  };

  const menuItems = [
    {
      key: 'vacancies',
      icon: <UnorderedListOutlined />,
      label: t('vacancies'),
      onClick: () => navigate('/student/vacancies'),
    },
    {
      key: 'form',
      icon: <FormOutlined />,
      label: t('fill_in_my_data'),
      onClick: () => navigate('/student/form'),
    },
    {
      key: 'contact',
      icon: <PhoneOutlined />,
      label: t('contact_form'),
      onClick: () => navigate('/student/contact'),
    },
    {
      key: 'reviews',
      icon: <StarOutlined />,
      label: t('reviews'),
      onClick: () => navigate('/student/reviews'),
    },
  ];

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
          <Sider 
            width={250} 
            style={{ 
              background: '#064e3b', 
              boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div 
                style={{ 
                  padding: '32px 16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '16px'
                }} 
                onClick={() => navigate('/student/form')}
              >
                <img src="/logo_official.svg" alt="Logo" style={{ height: '60px', marginBottom: '16px' }} />
                <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center' }}>
                  {t('app_title')}
                </div>
              </div>
              
              <Menu 
                theme="dark" 
                mode="inline" 
                selectedKeys={[getSelectedKey()]} 
                items={menuItems} 
                style={{ 
                  background: 'transparent', 
                  borderRight: 'none',
                  flex: 1
                }} 
              />
              
              <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Language Selector */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <Space style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 16px', borderRadius: '20px' }}>
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
                </div>

                {/* Logout Button */}
                <Button 
                  type="text" 
                  icon={<LogoutOutlined />} 
                  onClick={handleLogout}
                  style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="logout-btn"
                >
                  {t('exit')}
                </Button>
              </div>
            </div>
          </Sider>
          
          <Layout style={{ background: '#f3f4f6' }}>
            <Content style={{ padding: '32px 40px', margin: '0 auto', maxWidth: '1200px', width: '100%' }}>
              <div style={{
                background: '#fff',
                padding: '32px',
                minHeight: '280px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </AntdApp>
    </ConfigProvider>
  );
};

export default StudentLayout;
