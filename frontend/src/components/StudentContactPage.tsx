import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Card } from 'antd';
import { MailOutlined, UserOutlined, PhoneOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const StudentContactPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Concatenate phone and subject into the message body
      const phoneText = values.phone ? `\nPhone: ${values.phone}` : '';
      const subjectText = `Subject: ${values.subject}`;
      const fullMessage = `${subjectText}${phoneText}\n\nMessage:\n${values.message}`;

      await axios.post('http://localhost:8000/feedbacks/', {
        name: values.name,
        email: values.email,
        message: fullMessage
      });
      
      message.success(i18n.language === 'en' ? 'Message sent successfully!' : (i18n.language === 'ru' ? 'Сообщение успешно отправлено!' : 'Хабарлама сәтті жіберілді!'));
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error(i18n.language === 'en' ? 'Failed to send message.' : (i18n.language === 'ru' ? 'Ошибка отправки сообщения.' : 'Хабарламаны жіберу қатесі.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
      <Title level={2} style={{ color: '#064e3b', marginBottom: '8px' }}>
        {t('contact_form_title')}
      </Title>
      <Paragraph style={{ color: '#6b7280', marginBottom: '32px' }}>
        {i18n.language === 'en' ? 'Get in touch with the administration.' : (i18n.language === 'ru' ? 'Свяжитесь с администрацией.' : 'Әкімшілікпен байланысыңыз.')}
      </Paragraph>

      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '16px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={<span style={{ fontWeight: 500 }}>{t('name_placeholder')}</span>}
            rules={[{ required: true, message: t('name_placeholder') }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#10b981' }} />} size="large" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span style={{ fontWeight: 500 }}>{t('email_placeholder')}</span>}
            rules={[
              { required: true, message: t('email_placeholder') },
              { type: 'email', message: 'Invalid email' }
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: '#10b981' }} />} size="large" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span style={{ fontWeight: 500 }}>{t('phone')} (Optional)</span>}
          >
            <Input prefix={<PhoneOutlined style={{ color: '#10b981' }} />} size="large" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item
            name="subject"
            label={<span style={{ fontWeight: 500 }}>{t('subject')}</span>}
            rules={[{ required: true, message: t('subject') }]}
          >
            <Input prefix={<InfoCircleOutlined style={{ color: '#10b981' }} />} size="large" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item
            name="message"
            label={<span style={{ fontWeight: 500 }}>{i18n.language === 'en' ? 'Message' : (i18n.language === 'ru' ? 'Сообщение' : 'Хабарлама')}</span>}
            rules={[{ required: true, message: 'Message is required' }]}
          >
            <TextArea rows={6} size="large" style={{ borderRadius: '8px' }} />
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
                width: '100%',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
              }}
            >
              {t('submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default StudentContactPage;
