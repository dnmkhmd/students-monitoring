import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Space, Spin, message, Button, Modal, Form, Input } from 'antd';
import { EnvironmentOutlined, DollarOutlined, MailOutlined, BankOutlined, SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

interface Vacancy {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
  contact_email: string;
}

const StudentVacanciesPage: React.FC = () => {
  const { t } = useTranslation();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [applying, setApplying] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVacancies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVacancies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/vacancies/');
      setVacancies(response.data);
    } catch (error) {
      message.error(t('error_loading_data'));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setIsModalVisible(true);
  };

  const onFinish = async (values: any) => {
    if (!selectedVacancy) return;
    setApplying(true);
    try {
      await axios.post(`http://localhost:8000/vacancies/${selectedVacancy.id}/apply`, values);
      message.success(t('data_submitted_success'));
      setIsModalVisible(false);
      form.resetFields();
    } catch (e) {
      message.error(t('error_saving_data'));
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: '8px', color: '#064e3b' }}>
        {t('vacancy_title')}
      </Title>
      <Paragraph style={{ color: '#6b7280', marginBottom: '32px' }}>
        {t('vacancy_desc')}
      </Paragraph>

      {vacancies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          {t('no_data')}
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {vacancies.map((vacancy) => (
            <Col xs={24} sm={24} md={12} lg={8} key={vacancy.id}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #f3f4f6'
                }}
                bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <Title level={4} style={{ marginBottom: '8px', color: '#111827', fontSize: '18px' }}>
                    {vacancy.title}
                  </Title>
                  <Space align="center" style={{ marginBottom: '12px' }}>
                    <BankOutlined style={{ color: '#10b981' }} />
                    <Text strong style={{ color: '#4b5563' }}>{vacancy.company}</Text>
                  </Space>
                </div>
                
                <Paragraph style={{ color: '#6b7280', flex: 1, minHeight: '60px' }} ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                  {vacancy.description}
                </Paragraph>
                
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                      <EnvironmentOutlined style={{ color: '#9ca3af' }} />
                      <Text type="secondary">{vacancy.location || t('not_specified')}</Text>
                    </Space>
                    <Space>
                      <DollarOutlined style={{ color: '#9ca3af' }} />
                      <Text type="secondary">{vacancy.salary || t('not_specified')}</Text>
                    </Space>
                    <Space>
                      <MailOutlined style={{ color: '#9ca3af' }} />
                      <a href={`mailto:${vacancy.contact_email}`} style={{ color: '#10b981' }}>
                        {vacancy.contact_email || t('not_specified')}
                      </a>
                    </Space>
                  </Space>
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    onClick={() => handleApplyClick(vacancy)} 
                    style={{ marginTop: '16px', width: '100%', background: '#10b981', borderColor: '#10b981', fontWeight: 'bold' }}
                  >
                    {t('apply_btn')}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={`${t('apply_btn')} - ${selectedVacancy?.title}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="student_name" label={t('fullname')} rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="student_email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="message" label={t('message_placeholder')}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={applying} style={{ width: '100%', background: '#10b981', borderColor: '#10b981', fontWeight: 'bold' }}>
            {t('submit')}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentVacanciesPage;
