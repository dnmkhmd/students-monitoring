// FeedbackPage.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, List, Spin, Typography, Modal } from 'antd';
import { Send, MessageSquare, Mail, User, ListFilter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title, Paragraph } = Typography;

interface FeedbackMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const FeedbackPage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'viewer';
  const token = localStorage.getItem('token');

  const fetchFeedbacks = async () => {
    if (userRole !== 'admin') return;
    try {
      setFeedbacksLoading(true);
      const response = await axios.get('http://localhost:8000/feedbacks/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setFeedbacksLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = (values: any) => {
    Modal.confirm({
      title: t('confirm_title'),
      content: t('feedback_confirm_content'),
      okText: t('yes'),
      cancelText: t('no'),
      onOk: async () => {
        try {
          setLoading(true);
          const payload = {
            ...values,
            user_id: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null
          };
          
          await axios.post('http://localhost:8000/feedbacks/', payload);
          message.success(t('feedback_success'));
          form.resetFields();
          
          if (userRole === 'admin') {
            fetchFeedbacks();
          }
          
          // Simulate Notification for Admin
          const currentNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
          currentNotifs.unshift({
            id: Date.now(),
            message: t('notif_new_feedback', { name: values.name }),
            date: new Date().toLocaleTimeString()
          });
          localStorage.setItem('user_notifications', JSON.stringify(currentNotifs));
          
        } catch (error) {
          message.error('Произошла ошибка при отправке сообщения.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div style={{ padding: '8px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: userRole === 'admin' ? '1fr 1fr' : '1fr', gap: '40px' }}>
        
        {/* Left Side: Feedback Form */}
        <Card 
          style={{ 
            borderRadius: '20px', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)', 
            border: 'none',
            padding: '20px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              display: 'inline-flex', 
              padding: '16px', 
              background: '#ecfdf5', 
              borderRadius: '50%', 
              color: '#10b981',
              marginBottom: '16px' 
            }}>
              <MessageSquare size={32} />
            </div>
            <Title level={2} style={{ color: '#064e3b', marginTop: 0 }}>{t('feedback_title')}</Title>
            <Paragraph style={{ color: '#666' }}>{t('feedback_desc')}</Paragraph>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item 
              name="name" 
              label={t('fullname')}
              rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}
            >
              <Input prefix={<User size={18} style={{ color: '#ccc', marginRight: '6px' }} />} placeholder={t('name_placeholder')} style={{ height: '45px', borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item 
              name="email" 
              label="Email"
              rules={[
                { required: true, message: 'Пожалуйста, введите ваш email' },
                { type: 'email', message: 'Введите корректный email' }
              ]}
            >
              <Input prefix={<Mail size={18} style={{ color: '#ccc', marginRight: '6px' }} />} placeholder="your-email@example.com" style={{ height: '45px', borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item 
              name="message" 
              label="Сообщение"
              rules={[{ required: true, message: 'Пожалуйста, введите сообщение' }]}
            >
              <Input.TextArea rows={5} placeholder={t('message_placeholder')} style={{ borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<Send size={16} />}
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
                {t('send_message')}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Right Side: Admin List of Feedbacks */}
        {userRole === 'admin' && (
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#064e3b' }}>
                <ListFilter size={20} />
                <span>Все сообщения (Администратор)</span>
              </div>
            }
            style={{ 
              borderRadius: '20px', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)', 
              border: 'none',
              maxHeight: '600px',
              overflowY: 'auto'
            }}
          >
            {feedbacksLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Spin />
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={feedbacks}
                renderItem={(item) => (
                  <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <List.Item.Meta
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#333' }}>{item.name}</span>
                          <span style={{ fontSize: '12px', color: '#999' }}>{item.created_at}</span>
                        </div>
                      }
                      description={
                        <div style={{ marginTop: '4px' }}>
                          <div style={{ color: '#10b981', fontSize: '13px', marginBottom: '6px' }}>{item.email}</div>
                          <div style={{ color: '#555', background: '#f9f9f9', padding: '10px', borderRadius: '8px', fontSize: '14px' }}>
                            {item.message}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        )}

      </div>
    </div>
  );
};

export default FeedbackPage;
