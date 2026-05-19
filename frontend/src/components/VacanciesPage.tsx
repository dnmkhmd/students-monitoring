// VacanciesPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Tag, message, Empty, Spin } from 'antd';
import { Briefcase, MapPin, DollarSign, Mail, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface Vacancy {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
  contact_email?: string;
}

const VacanciesPage: React.FC = () => {
  const { t } = useTranslation();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const userRole = localStorage.getItem('userRole') || 'viewer';
  const token = localStorage.getItem('token');

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/vacancies/');
      setVacancies(response.data);
    } catch (error) {
      message.error('Ошибка при загрузке вакансий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleAddVacancy = (values: any) => {
    Modal.confirm({
      title: t('confirm_title'),
      content: t('vacancy_confirm_content'),
      okText: t('yes'),
      cancelText: t('no'),
      onOk: async () => {
        try {
          await axios.post('http://localhost:8000/vacancies/', values, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          message.success(t('vacancy_success'));
          setIsModalOpen(false);
          form.resetFields();
          fetchVacancies();
          
          // Trigger new notification simulation
          const currentNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
          currentNotifs.unshift({
            id: Date.now(),
            message: t('notif_new_vacancy', { title: values.title, company: values.company }),
            date: new Date().toLocaleTimeString()
          });
          localStorage.setItem('user_notifications', JSON.stringify(currentNotifs));
        } catch (error) {
          message.error('Не удалось добавить вакансию. Проверьте права доступа.');
        }
      }
    });
  };

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#064e3b' }}>{t('vacancy_title')}</h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>{t('vacancy_desc')}</p>
        </div>
        {userRole === 'admin' && (
          <Button 
            type="primary" 
            icon={<Plus size={16} />} 
            onClick={() => setIsModalOpen(true)}
            style={{ background: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {t('add_vacancy')}
          </Button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : vacancies.length === 0 ? (
        <Empty description={t('notif_empty')} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {vacancies.map((vacancy) => (
            <Card 
              key={vacancy.id}
              hoverable
              style={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0' 
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111' }}>{vacancy.title}</h3>
                <Tag color="emerald" style={{ borderRadius: '6px' }}>{t('company')}</Tag>
              </div>
              <h4 style={{ margin: '0 0 16px 0', color: '#10b981', fontWeight: 500 }}>{vacancy.company}</h4>
              
              <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', height: '80px', overflow: 'auto', marginBottom: '20px' }}>
                {vacancy.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} className="text-emerald-600" style={{ color: '#10b981' }} />
                  <span>{vacancy.location}</span>
                </div>
                {vacancy.salary && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontWeight: 600, color: '#333' }}>{vacancy.salary}</span>
                  </div>
                )}
                {vacancy.contact_email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Mail size={16} style={{ color: '#10b981' }} />
                    <a href={`mailto:${vacancy.contact_email}`} style={{ color: '#10b981', textDecoration: 'none' }}>
                      {vacancy.contact_email}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Vacancy Modal */}
      <Modal
        title={t('add_vacancy')}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        style={{ borderRadius: '16px', overflow: 'hidden' }}
      >
        <Form form={form} layout="vertical" onFinish={handleAddVacancy} style={{ marginTop: '20px' }}>
          <Form.Item name="title" label="Название вакансии" rules={[{ required: true, message: 'Введите название вакансии' }]}>
            <Input placeholder="Например, Frontend Разработчик" />
          </Form.Item>
          <Form.Item name="company" label="Компания" rules={[{ required: true, message: 'Введите название компании' }]}>
            <Input placeholder="Например, Tech Solutions" />
          </Form.Item>
          <Form.Item name="description" label="Описание обязанностей" rules={[{ required: true, message: 'Введите описание' }]}>
            <Input.TextArea rows={4} placeholder="Опишите требования, условия и стек технологий..." />
          </Form.Item>
          <Form.Item name="location" label="Город / Локация" rules={[{ required: true, message: 'Укажите локацию' }]}>
            <Input placeholder="Например, Алматы или Удаленно" />
          </Form.Item>
          <Form.Item name="salary" label="Заработная плата (необязательно)">
            <Input placeholder="Например, 400 000 ₸" />
          </Form.Item>
          <Form.Item name="contact_email" label="Email для откликов" rules={[{ type: 'email', message: 'Введите корректный email' }]}>
            <Input placeholder="hr@company.com" />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0, marginTop: '24px' }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: '10px' }}>
              Отмена
            </Button>
            <Button type="primary" htmlType="submit" style={{ background: '#10b981', borderColor: '#10b981' }}>
              Добавить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VacanciesPage;
