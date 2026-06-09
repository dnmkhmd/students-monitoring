import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Card, Rate, Avatar, Empty, Spin } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface Review {
  id: number;
  first_name: string;
  last_name: string;
  group_name: string;
  specialty: string;
  message: string;
  rating: number;
  created_at: string;
}

const StudentReviewsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchReviews = async () => {
    try {
      setFetching(true);
      const response = await axios.get('http://localhost:8000/reviews/');
      setReviews(response.data);
    } catch (error) {
      console.error(error);
      message.error(i18n.language === 'en' ? 'Failed to load reviews' : (i18n.language === 'ru' ? 'Ошибка загрузки отзывов' : 'Пікірлерді жүктеу қатесі'));
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/reviews/', {
        first_name: values.first_name,
        last_name: values.last_name,
        group_name: values.group,
        specialty: values.specialty,
        message: values.message,
        rating: values.rating
      });

      message.success(i18n.language === 'en' ? 'Review posted successfully!' : (i18n.language === 'ru' ? 'Отзыв успешно отправлен!' : 'Пікір сәтті жіберілді!'));
      form.resetFields();
      fetchReviews();
    } catch (error) {
      console.error(error);
      message.error(i18n.language === 'en' ? 'Failed to post review.' : (i18n.language === 'ru' ? 'Ошибка отправки отзыва.' : 'Пікір жіберу қатесі.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
      <Title level={2} style={{ color: '#064e3b', marginBottom: '8px' }}>
        {t('reviews_title')}
      </Title>

      {/* SECTION 1: Leave a review form */}
      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '16px', marginBottom: '32px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="first_name"
              label={<span style={{ fontWeight: 500 }}>{t('first_name')} <span style={{ color: '#ef4444' }}>*</span></span>}
              rules={[{ required: true, message: t('first_name') }]}
            >
              <Input prefix={<UserOutlined style={{ color: '#10b981' }} />} size="large" style={{ borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item
              name="last_name"
              label={<span style={{ fontWeight: 500 }}>{t('last_name')}</span>}
            >
              <Input prefix={<UserOutlined style={{ color: '#10b981' }} />} size="large" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="group"
              label={<span style={{ fontWeight: 500 }}>{t('group')}</span>}
            >
              <Input prefix={<TeamOutlined style={{ color: '#10b981' }} />} size="large" style={{ borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item
              name="specialty"
              label={<span style={{ fontWeight: 500 }}>{t('specialty') || 'Specialty'}</span>}
            >
              <Input prefix={<BookOutlined style={{ color: '#10b981' }} />} size="large" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="message"
            label={<span style={{ fontWeight: 500 }}>{i18n.language === 'en' ? 'Your review' : (i18n.language === 'ru' ? 'Ваш отзыв' : 'Пікіріңіз')} <span style={{ color: '#ef4444' }}>*</span></span>}
          // rules={[
          //   { required: true, message: 'Review is required' },
          //   { min: 10, message: 'Review must be at least 10 characters' }
          // ]}
          >
            <Input.TextArea rows={6} size="large" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item
            name="rating"
            label={<span style={{ fontWeight: 500 }}>{t('rating')}</span>}
          >
            <Rate style={{ color: '#fbbf24' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                background: '#10b981',
                borderRadius: '8px',
                fontWeight: 'bold',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
              }}
            >
              {t('post_review')}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* SECTION 2: All Reviews */}
      <Title level={4} style={{ color: '#064e3b', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
        {t('reviews')}
      </Title>

      {fetching ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>
      ) : reviews.length === 0 ? (
        <Empty description={t('no_reviews_yet')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((r) => (
            <Card key={r.id} bordered={false} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Avatar size={48} style={{ backgroundColor: '#10b981', fontSize: '20px' }}>
                  {r.first_name.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#1f2937' }}>
                        {r.first_name} {r.last_name || ''}
                      </strong>
                      <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
                        {[r.group_name, r.specialty].filter(Boolean).join(' • ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {r.rating && <Rate disabled defaultValue={r.rating} style={{ color: '#fbbf24', fontSize: '14px' }} />}
                      <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>{r.created_at}</div>
                    </div>
                  </div>
                  <Paragraph style={{ marginTop: '12px', color: '#374151', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {r.message}
                  </Paragraph>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default StudentReviewsPage;
