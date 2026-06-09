import React, { useState } from 'react';
import { Form, Input, Button, Select, Typography, message, Card, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const StudentFormPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        full_name: values.fullname,
        iin: values.iin,
        enterprise_spec: values.specialty,
        category: values.category,
        position: values.position,
        city_region: values.region,
        grant_contract: values.grant_or_paid,
        enterprise_non_spec: values.workplace,
        document: values.email_or_phone,
        status: 'pending'
      };
      
      await axios.post('http://localhost:8000/students/', payload);
      message.success(t('data_submitted_success'));
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error(t('error_saving_data'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      maxHeight: 'calc(100vh - 120px)', 
      overflowY: 'auto',
      paddingRight: '16px' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title level={3} style={{ color: '#064e3b', marginBottom: '4px' }}>
          {t('student_portal_title')}
        </Title>
        <Paragraph style={{ color: '#6b7280', fontSize: '14px', marginBottom: 0 }}>
          {t('student_portal_desc')}
        </Paragraph>
      </div>

      <Card style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
          size="middle"
        >
          <Row gutter={[16, 8]}>
            {/* Left Column */}
            <Col xs={24} md={12}>
              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('fullname')}</span>}
                name="fullname"
                rules={[{ required: true, message: i18n.language === 'en' ? 'Please enter your full name' : 'Пожалуйста, введите ФИО' }]}
              >
                <Input placeholder={t('fullname')} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('iin')}</span>}
                name="iin"
                rules={[
                  { required: true, message: i18n.language === 'en' ? 'Please enter IIN' : 'Пожалуйста, введите ИИН' },
                  { len: 12, message: i18n.language === 'en' ? 'IIN must be 12 digits' : 'ИИН должен состоять из 12 цифр' },
                  { pattern: /^\d{12}$/, message: i18n.language === 'en' ? 'Only digits are allowed' : 'Только цифры' }
                ]}
              >
                <Input placeholder="000000000000" maxLength={12} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('specialty')}</span>}
                name="specialty"
                rules={[{ required: true, message: i18n.language === 'en' ? 'Please enter specialty' : 'Пожалуйста, укажите специальность' }]}
              >
                <Input placeholder={t('specialty')} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('category')}</span>}
                name="category"
                rules={[{ required: true, message: i18n.language === 'en' ? 'Please select a category' : 'Пожалуйста, выберите категорию' }]}
              >
                <Select placeholder={t('category')}>
                  <Option value="Бакалавр">{t('bachelor')}</Option>
                  <Option value="Магистр">{t('master')}</Option>
                  <Option value="Докторант">{t('phd')}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('region')}</span>}
                name="region"
              >
                <Input placeholder={t('region')} />
              </Form.Item>
            </Col>

            {/* Right Column */}
            <Col xs={24} md={12}>
              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('workplace')}</span>}
                name="workplace"
              >
                <Input placeholder={t('workplace')} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('position')}</span>}
                name="position"
              >
                <Input placeholder={t('position')} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('grant_or_paid')}</span>}
                name="grant_or_paid"
              >
                <Select placeholder={t('grant_or_paid')}>
                  <Option value="Грант">{t('grant')}</Option>
                  <Option value="Платное">{t('contract')}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 500, fontSize: '13px' }}>{t('email_or_phone')}</span>}
                name="email_or_phone"
              >
                <Input placeholder={t('email_or_phone')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                width: '100%', 
                height: '42px', 
                fontSize: '15px', 
                fontWeight: 'bold',
                background: '#10b981',
                borderColor: '#10b981',
                borderRadius: '8px',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
              }}
            >
              {t('submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default StudentFormPage;
