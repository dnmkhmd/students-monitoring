// ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Tag, message, Avatar, Typography, Divider } from 'antd';
import { User, Mail, Shield, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(response.data);
      form.setFieldsValue({
        full_name: response.data.full_name,
        email: response.data.email
      });
    } catch (error) {
      message.error('Ошибка при загрузке профиля');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (values: any) => {
    try {
      setLoading(true);
      const response = await axios.put('http://localhost:8000/users/me', {
        ...values,
        role: profileData.role // Preserve original role
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success(t('profile_updated'));
      localStorage.setItem('userFullName', response.data.full_name || '');
      localStorage.setItem('userEmail', response.data.email || '');
      setProfileData(response.data);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Ошибка при обновлении профиля';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Button onClick={fetchProfile} type="primary" style={{ background: '#10b981', borderColor: '#10b981' }}>
          Загрузить профиль
        </Button>
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    admin: 'red',
    viewer: 'blue',
    student: 'green'
  };

  return (
    <div style={{ padding: '8px', maxWidth: '600px', margin: '0 auto' }}>
      <Card 
        style={{ 
          borderRadius: '24px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)', 
          border: 'none',
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)', 
          margin: '-24px -24px 24px -24px',
          padding: '40px 24px',
          textAlign: 'center',
          color: 'white'
        }}>
          <Avatar 
            size={90} 
            style={{ 
              backgroundColor: '#10b981', 
              fontSize: '36px', 
              fontWeight: 'bold',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              marginBottom: '16px'
            }}
          >
            {profileData.full_name ? profileData.full_name[0].toUpperCase() : 'U'}
          </Avatar>
          <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 600 }}>
            {profileData.full_name || 'Пользователь'}
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 16px 0' }}>
            {profileData.email}
          </Paragraph>
          <Tag color={roleColors[profileData.role] || 'blue'} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '14px', border: 'none' }}>
            {profileData.role.toUpperCase()}
          </Tag>
        </div>

        <div>
          <Title level={4} style={{ color: '#064e3b', marginBottom: '8px' }}>{t('profile_title')}</Title>
          <Paragraph style={{ color: '#666', marginBottom: '24px' }}>{t('profile_desc')}</Paragraph>
          
          <Divider style={{ margin: '16px 0' }} />

          <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
            <Form.Item 
              name="full_name" 
              label={t('fullname')}
              rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}
            >
              <Input prefix={<User size={18} style={{ color: '#ccc', marginRight: '6px' }} />} style={{ height: '42px', borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item 
              name="email" 
              label="Email"
              rules={[
                { required: true, message: 'Пожалуйста, введите email' },
                { type: 'email', message: 'Введите корректный email' }
              ]}
            >
              <Input prefix={<Mail size={18} style={{ color: '#ccc', marginRight: '6px' }} />} style={{ height: '42px', borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item style={{ display: 'none' }}>
              <Input value={profileData.role} />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<Save size={16} />}
                style={{ 
                  width: '100%', 
                  height: '45px', 
                  borderRadius: '8px', 
                  background: '#10b981', 
                  borderColor: '#10b981',
                  fontWeight: 600,
                  fontSize: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {t('save_changes')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
