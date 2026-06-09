import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Space, message, Popconfirm, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { TabPane } = Tabs;

interface StudentData {
  id: number;
  full_name: string;
  iin: string;
  enterprise_spec: string;
  category: string;
  city_region: string;
  enterprise_non_spec: string;
  status: string;
}

interface VacancyApp {
  id: number;
  student_name: string;
  student_email: string;
  vacancy_id: number;
  message: string;
  status: string;
  created_at: string;
}

interface FeedbackMsg {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const AdminRequestsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [students, setStudents] = useState<StudentData[]>([]);
  const [applications, setApplications] = useState<VacancyApp[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackMsg[]>([]);
  
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);

  const getHeaders = () => {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
  };

  const fetchStudents = async () => {
    try {
      setLoading1(true);
      const res = await axios.get('http://localhost:8000/students/?status=pending', getHeaders());
      setStudents(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading1(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading2(true);
      const res = await axios.get('http://localhost:8000/vacancies/applications', getHeaders());
      setApplications(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading2(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading3(true);
      const res = await axios.get('http://localhost:8000/feedbacks/', getHeaders());
      const sorted = res.data.sort((a: any, b: any) => (a.is_read === b.is_read ? 0 : a.is_read ? 1 : -1));
      setFeedbacks(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading3(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchApplications();
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveStudent = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/students/${id}/approve`, {}, getHeaders());
      message.success(t('approved_success'));
      fetchStudents();
    } catch (e) {
      message.error(t('error_saving_data'));
    }
  };

  const rejectStudent = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/students/${id}/reject`, {}, getHeaders());
      message.success(t('rejected_success'));
      fetchStudents();
    } catch (e) {
      message.error(t('error_saving_data'));
    }
  };

  const approveApp = async (id: number) => {
    try {
      await axios.put(`http://localhost:8000/vacancies/applications/${id}/approve`, {}, getHeaders());
      message.success(t('approved_success'));
      fetchApplications();
    } catch (e) {
      message.error(t('error_saving_data'));
    }
  };

  const rejectApp = async (id: number) => {
    try {
      await axios.put(`http://localhost:8000/vacancies/applications/${id}/reject`, {}, getHeaders());
      message.success(t('rejected_success'));
      fetchApplications();
    } catch (e) {
      message.error(t('error_saving_data'));
    }
  };

  const markRead = async (id: number) => {
    try {
      await axios.put(`http://localhost:8000/feedbacks/${id}/read`, {}, getHeaders());
      message.success(t('data_updated'));
      fetchFeedbacks();
    } catch (e) {
      message.error(t('error_saving_data'));
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#064e3b' }}>{t('requests')}</h2>
      
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab={t('data_submissions')} key="1">
          <Table 
            dataSource={students} 
            rowKey="id" 
            loading={loading1}
            columns={[
              { title: t('fullname'), dataIndex: 'full_name' },
              { title: t('iin'), dataIndex: 'iin' },
              { title: t('specialty'), dataIndex: 'enterprise_spec' },
              { title: t('category'), dataIndex: 'category' },
              { title: t('region'), dataIndex: 'city_region' },
              {
                title: t('actions'),
                render: (_, record) => (
                  <Space>
                    <Popconfirm title={t('confirm_reject')} onConfirm={() => approveStudent(record.id)} okText={t('yes')} cancelText={t('no')}>
                      <Button type="primary" style={{ background: '#10b981', borderColor: '#10b981' }} icon={<CheckOutlined />}>{t('approve')}</Button>
                    </Popconfirm>
                    <Popconfirm title={t('confirm_reject')} onConfirm={() => rejectStudent(record.id)} okText={t('yes')} cancelText={t('no')}>
                      <Button danger icon={<CloseOutlined />}>{t('reject')}</Button>
                    </Popconfirm>
                  </Space>
                )
              }
            ]} 
          />
        </TabPane>
        
        <TabPane tab={t('vacancy_applications')} key="2">
          <Table 
            dataSource={applications} 
            rowKey="id" 
            loading={loading2}
            columns={[
              { title: t('fullname'), dataIndex: 'student_name' },
              { title: 'Email', dataIndex: 'student_email' },
              { title: 'Vacancy ID', dataIndex: 'vacancy_id' },
              { title: 'Message', dataIndex: 'message' },
              { title: 'Status', dataIndex: 'status', render: (status) => <Tag color={status === 'pending' ? 'gold' : status === 'approved' ? 'green' : 'red'}>{status.toUpperCase()}</Tag> },
              {
                title: t('actions'),
                render: (_, record) => (
                  record.status === 'pending' &&
                  <Space>
                    <Popconfirm title={t('confirm_reject')} onConfirm={() => approveApp(record.id)} okText={t('yes')} cancelText={t('no')}>
                      <Button type="primary" size="small" style={{ background: '#10b981', borderColor: '#10b981' }} icon={<CheckOutlined />} />
                    </Popconfirm>
                    <Popconfirm title={t('confirm_reject')} onConfirm={() => rejectApp(record.id)} okText={t('yes')} cancelText={t('no')}>
                      <Button danger size="small" icon={<CloseOutlined />} />
                    </Popconfirm>
                  </Space>
                )
              }
            ]} 
          />
        </TabPane>
        
        <TabPane tab={t('feedback_messages')} key="3">
          <Table 
            dataSource={feedbacks} 
            rowKey="id" 
            loading={loading3}
            columns={[
              { title: t('fullname'), dataIndex: 'name' },
              { title: 'Email', dataIndex: 'email' },
              { title: 'Message', dataIndex: 'message' },
              { title: 'Status', render: (_, record) => <Tag color={record.is_read ? 'green' : 'red'}>{record.is_read ? 'Read' : 'Unread'}</Tag> },
              {
                title: t('actions'),
                render: (_, record) => (
                  !record.is_read && 
                  <Button type="link" onClick={() => markRead(record.id)} icon={<EyeOutlined />}>{t('mark_as_read')}</Button>
                )
              }
            ]} 
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminRequestsPage;
