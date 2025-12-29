import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Tag, Space, Input } from 'antd';
import type { TableColumnsType } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Student, StudentFormData } from '../types/student';
import { studentApi } from '../services/api';
import StudentForm from './StudentForm';
import StudentDetails from './StudentDetails';
import ExportButtons from './ExportButtons';

const { Search } = Input;

const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchText, setSearchText] = useState('');

  const columns: TableColumnsType<Student> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'ФИО',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string | null) => text || '-',
      sorter: (a, b) => (a.full_name || '').localeCompare(b.full_name || ''),
    },
    {
      title: 'ИИН',
      dataIndex: 'iin',
      key: 'iin',
      render: (text: string | null) => text || '-',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (text: string | null) => (
        <Tag color={text ? 'blue' : 'default'}>{text || 'Не указано'}</Tag>
      ),
      filters: [
        { text: 'Бакалавр', value: 'Бакалавр' },
        { text: 'Магистр', value: 'Магистр' },
        { text: 'Докторант', value: 'Докторант' },
        { text: 'Специалист', value: 'Специалист' },
      ],
      onFilter: (value: React.Key | boolean, record) => 
        record.category === String(value),
    },
    {
      title: 'Город/Регион',
      dataIndex: 'city_region',
      key: 'city_region',
      render: (text: string | null) => text || '-',
      sorter: (a, b) => (a.city_region || '').localeCompare(b.city_region || ''),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            size="small"
            title="Просмотр"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => editStudent(record)}
            size="small"
            title="Редактировать"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteStudent(record.id)}
            size="small"
            title="Удалить"
          />
        </Space>
      ),
    },
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      message.error('Ошибка при загрузке данных');
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
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = students.filter(student =>
        (student.full_name?.toLowerCase().includes(searchLower)) ||
        (student.iin?.toLowerCase().includes(searchLower)) ||
        (student.category?.toLowerCase().includes(searchLower)) ||
        (student.city_region?.toLowerCase().includes(searchLower))
      );
      setFilteredStudents(filtered);
    }
  }, [searchText, students]);

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
      title: 'Удалить студента',
      content: 'Вы уверены, что хотите удалить этого студента?',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await studentApi.delete(id);
          message.success('Студент удален');
          fetchStudents();
        } catch (error) {
          message.error('Ошибка при удалении');
        }
      },
    });
  };

  const handleFormSubmit = async (values: Record<string, any>) => {
    try {
      if (editingStudent) {
        // Для обновления: отправляем только измененные поля (не пустые)
        const updateData: Record<string, string> = {};
        Object.entries(values).forEach(([key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            updateData[key] = String(value);
          }
        });
        await studentApi.update(editingStudent.id, updateData);
        message.success('Данные обновлены');
      } else {
        // Для создания: преобразуем в StudentFormData
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
        };
        await studentApi.create(formData);
        message.success('Студент добавлен');
      }
      setIsFormVisible(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      message.error('Ошибка при сохранении');
    }
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

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Список студентов</h2>
          <div style={{ color: '#666', fontSize: 14 }}>
            Всего записей: {students.length} | Показано: {filteredStudents.length}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Search
                placeholder="Поиск по ФИО, ИИН, категории, городу..."
                allowClear
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
            />
            
            <ExportButtons 
                students={students}
                filteredStudents={filteredStudents}
                searchText={searchText}
            />
            
            <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddNew}
                style={{ height: 40 }}
            >
                Добавить студента
            </Button>
        </div>
      </div>

      {searchText && (
        <div style={{ marginBottom: 16, padding: '8px 16px', background: '#e6f7ff', borderRadius: 8 }}>
          Результаты поиска по запросу: "{searchText}"
          <Button type="link" onClick={clearSearch} size="small">
            Очистить поиск
          </Button>
        </div>
      )}

      <Table<Student>
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} записей`,
        }}
        scroll={{ x: 1000 }}
        bordered
        size="middle"
        locale={{
          emptyText: searchText ? 'Нет результатов по вашему запросу' : 'Нет данных'
        }}
      />

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