// StudentTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Tag, Space, Input, Tabs } from 'antd';
import type { TableColumnsType } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Student, StudentFormData } from '../types/student';
import { studentApi } from '../services/api';
import StudentForm from './StudentForm';
import StudentDetails from './StudentDetails';
import ExportButtons from './ExportButtons';

const { Search } = Input;

const StudentTable: React.FC = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  // Pending request states
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [filteredPending, setFilteredPending] = useState<Student[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('approved');

  const userRole = localStorage.getItem('userRole') || 'viewer';

  const baseColumns: TableColumnsType<Student> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('fullname'),
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string | null) => text || '-',
      sorter: (a, b) => (a.full_name || '').localeCompare(b.full_name || ''),
    },
    {
      title: t('iin'),
      dataIndex: 'iin',
      key: 'iin',
      render: (text: string | null) => text || '-',
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      render: (text: string | null) => (
        <Tag color={text ? 'blue' : 'default'}>
          {text === 'Бакалавр' ? t('bachelor') : 
           text === 'Магистр' ? t('master') :
           text === 'Докторант' ? t('phd') :
           text === 'Специалист' ? t('specialist') :
           text || t('not_specified')}
        </Tag>
      ),
      filters: [
        { text: t('bachelor'), value: 'Бакалавр' },
        { text: t('master'), value: 'Магистр' },
        { text: t('phd'), value: 'Докторант' },
        { text: t('specialist'), value: 'Специалист' },
      ],
      onFilter: (value: React.Key | boolean, record) => 
        record.category === String(value),
    },
    {
      title: t('released'),
      dataIndex: 'released',
      key: 'released',
      render: (text: string | null) => text || '-',
      sorter: (a, b) => (a.released || '').localeCompare(b.released || ''),
    },
    {
      title: t('op'),
      dataIndex: 'op',
      key: 'op',
      render: (text: string | null) => text || '-',
      sorter: (a, b) => (a.op || '').localeCompare(b.op || ''),
    },
    {
      title: t('city_region'),
      dataIndex: 'city_region',
      key: 'city_region',
      render: (text: string | null) => text || '-',
      sorter: (a, b) => (a.city_region || '').localeCompare(b.city_region || ''),
    },
    {
      title: t('actions'),
      key: 'actions',
      width: 150,
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            size="small"
            title={t('view')}
          />
          {userRole === 'admin' && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => editStudent(record)}
                size="small"
                title={t('edit')}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteStudent(record.id)}
                size="small"
                title={t('delete')}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  // Viewer column filter: viewer must ONLY see: full_name, op, released
  const tableColumns = userRole === 'viewer'
    ? baseColumns.filter(c => c.key === 'full_name' || c.key === 'op' || c.key === 'released')
    : baseColumns;

  // Pending requests table columns for Admin:
  const pendingColumns: TableColumnsType<Student> = [
    ...baseColumns.filter(c => c.key !== 'actions'),
    {
      title: t('actions'),
      key: 'actions',
      width: 150,
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            size="small"
            title={t('view')}
          />
          <Button
            type="primary"
            style={{ background: '#10b981', borderColor: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            icon={<CheckOutlined />}
            onClick={() => handleApproveRequest(record.id)}
            size="small"
            title={t('approve_btn')}
          />
          <Button
            type="primary"
            danger
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            icon={<CloseOutlined />}
            onClick={() => handleRejectRequest(record.id)}
            size="small"
            title={t('reject_btn')}
          />
        </Space>
      ),
    }
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      if (userRole === 'admin') {
        const approved = await studentApi.getAll('approved');
        const pending = await studentApi.getAll('pending');
        setStudents(approved);
        setFilteredStudents(approved);
        setPendingStudents(pending);
        setFilteredPending(pending);
      } else {
        const approved = await studentApi.getAll('approved');
        setStudents(approved);
        setFilteredStudents(approved);
      }
    } catch (error) {
      message.error(t('error_loading_data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredStudents(students);
      setFilteredPending(pendingStudents);
    } else {
      const searchLower = searchText.toLowerCase();
      const filterFn = (student: Student) =>
        (student.full_name?.toLowerCase().includes(searchLower)) ||
        (student.iin?.toLowerCase().includes(searchLower)) ||
        (student.category?.toLowerCase().includes(searchLower)) ||
        (student.city_region?.toLowerCase().includes(searchLower)) ||
        (student.op?.toLowerCase().includes(searchLower)) ||
        (student.released?.toLowerCase().includes(searchLower));
      
      setFilteredStudents(students.filter(filterFn));
      setFilteredPending(pendingStudents.filter(filterFn));
    }
  }, [searchText, students, pendingStudents]);

  const showDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsVisible(true);
  };

  const editStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormVisible(true);
  };

  const deleteStudent = async (id: number) => {
    Modal.confirm({
      title: t('delete_student_title'),
      content: t('delete_student_confirm'),
      okText: t('delete'),
      okType: 'danger',
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await studentApi.delete(id);
          message.success(t('student_deleted'));
          fetchStudents();
        } catch (error) {
          message.error(t('error_deleting_student'));
        }
      },
    });
  };

  const handleApproveRequest = (id: number) => {
    Modal.confirm({
      title: t('approve_confirm_title'),
      content: t('approve_confirm_content'),
      okText: t('yes'),
      cancelText: t('no'),
      onOk: async () => {
        try {
          await studentApi.approve(id);
          message.success(t('approved_success'));
          fetchStudents();
        } catch (error) {
          message.error(t('error_saving_data'));
        }
      }
    });
  };

  const handleRejectRequest = (id: number) => {
    Modal.confirm({
      title: t('reject_confirm_title'),
      content: t('reject_confirm_content'),
      okText: t('yes'),
      okType: 'danger',
      cancelText: t('no'),
      onOk: async () => {
        try {
          await studentApi.reject(id);
          message.success(t('rejected_success'));
          fetchStudents();
        } catch (error) {
          message.error(t('error_deleting_student'));
        }
      }
    });
  };

  const handleFormSubmit = (values: Record<string, any>) => {
    Modal.confirm({
      title: t('confirm_title'),
      content: t('student_confirm_content'),
      okText: t('yes'),
      cancelText: t('no'),
      onOk: async () => {
        try {
          if (editingStudent) {
            // Admin editing
            const updateData: Record<string, string> = {};
            Object.entries(values).forEach(([key, value]) => {
              if (value !== '' && value !== null && value !== undefined) {
                updateData[key] = String(value);
              }
            });
            await studentApi.update(editingStudent.id, updateData);
            message.success(t('data_updated'));
          } else {
            // Creation
            const formData: StudentFormData = {
              iin: values.iin || '',
              category: values.category || '',
              bin: values.bin || '',
              released: values.released || '',
              document: values.document || '',
              continued_edu: values.continued_edu || '',
              enterprise_spec: values.enterprise_spec || '',
              enterprise_non_spec: values.enterprise_non_spec || '',
              op: values.op || '',
              full_name: values.full_name || '',
              position: values.position || '',
              grant_contract: values.grant_contract || '',
              city_region: values.city_region || '',
              status: userRole === 'admin' ? 'approved' : 'pending' // if viewer/student, submit as pending!
            };
            
            await studentApi.create(formData);
            
            if (userRole === 'viewer') {
              message.success(t('request_submitted'));
              
              // Trigger notification simulation for Admin
              const currentNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
              currentNotifs.unshift({
                id: Date.now(),
                message: t('notif_new_request', { name: values.full_name }),
                date: new Date().toLocaleTimeString()
              });
              localStorage.setItem('user_notifications', JSON.stringify(currentNotifs));
            } else {
              message.success(t('student_added'));
            }
          }
          setIsFormVisible(false);
          setEditingStudent(null);
          fetchStudents();
        } catch (error) {
          message.error(t('error_saving_data'));
        }
      }
    });
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingStudent(null);
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setIsFormVisible(true);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const tabItems = [
    {
      key: 'approved',
      label: t('approved_students'),
      children: (
        <Table<Student>
          columns={tableColumns}
          dataSource={filteredStudents}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} ${t('of')} ${total} ${t('records')}`,
          }}
          scroll={{ x: 1000 }}
          bordered
          size="middle"
          locale={{
            emptyText: searchText ? t('no_search_results') : t('no_data')
          }}
        />
      ),
    },
    ...(userRole === 'admin' ? [{
      key: 'pending',
      label: (
        <span>
          {t('pending_requests')}{' '}
          {pendingStudents.length > 0 && (
            <Tag color="red" style={{ borderRadius: '10px', marginLeft: '4px' }}>
              {pendingStudents.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <Table<Student>
          columns={pendingColumns}
          dataSource={filteredPending}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} ${t('of')} ${total} ${t('records')}`,
          }}
          scroll={{ x: 1000 }}
          bordered
          size="middle"
          locale={{
            emptyText: searchText ? t('no_search_results') : t('no_data')
          }}
        />
      ),
    }] : [])
  ];

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#064e3b' }}>{t('student_list')}</h2>
          <div style={{ color: '#666', fontSize: 14, marginTop: '4px' }}>
            {t('total_students')}: {students.length} | {t('shown')}: {filteredStudents.length}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Search
            placeholder={t('search_placeholder')}
            allowClear
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: 280 }}
            prefix={<SearchOutlined />}
          />
          
          {userRole === 'admin' && (
            <ExportButtons 
              students={students}
              filteredStudents={filteredStudents}
              searchText={searchText}
            />
          )}
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddNew}
            style={{ height: 40, background: '#10b981', borderColor: '#10b981' }}
          >
            {userRole === 'admin' ? t('add_student') : t('add_my_data')}
          </Button>
        </div>
      </div>

      {searchText && (
        <div style={{ marginBottom: 16, padding: '8px 16px', background: '#ecfdf5', borderRadius: 8, color: '#065f46', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {t('search_results_for')}: <strong>"{searchText}"</strong>
          </span>
          <Button type="link" onClick={clearSearch} size="small" style={{ color: '#10b981' }}>
            {t('clear_search')}
          </Button>
        </div>
      )}

      {userRole === 'admin' ? (
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={tabItems}
          style={{ background: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
        />
      ) : (
        <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <Table<Student>
            columns={tableColumns}
            dataSource={filteredStudents}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} ${t('of')} ${total} ${t('records')}`,
            }}
            scroll={{ x: 1000 }}
            bordered
            size="middle"
            locale={{
              emptyText: searchText ? t('no_search_results') : t('no_data')
            }}
          />
        </div>
      )}

      <StudentForm
        visible={isFormVisible}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        initialValues={editingStudent || undefined}
      />

      <StudentDetails
        visible={isDetailsVisible}
        student={selectedStudent}
        onClose={() => setIsDetailsVisible(false)}
      />
    </div>
  );
};

export default StudentTable;