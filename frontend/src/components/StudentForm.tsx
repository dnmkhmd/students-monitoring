import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { Student, StudentFormData, StudentUpdateData } from '../types/student';

const { Option } = Select;

interface StudentFormProps {
  visible: boolean;
  onSubmit: (values: StudentFormData | StudentUpdateData) => void;
  onCancel: () => void;
  initialValues?: Student;
}

const StudentForm: React.FC<StudentFormProps> = ({
  visible,
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      // Преобразуем null в пустые строки для формы
      const formValues: Record<string, string> = {};
      Object.entries(initialValues).forEach(([key, value]) => {
        if (key !== 'id') {
          formValues[key] = value || '';
        }
      });
      form.setFieldsValue(formValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Преобразуем пустые строки обратно в null для отправки
        const processedValues: Record<string, any> = {};
        Object.entries(values).forEach(([key, value]) => {
          processedValues[key] = value === '' ? null : value;
        });
        onSubmit(processedValues);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={initialValues ? 'Редактировать студента' : 'Добавить студента'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Сохранить
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="student_form"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="full_name"
            label="ФИО"
            rules={[{ required: true, message: 'Введите ФИО' }]}
          >
            <Input placeholder="Иванов Иван Иванович" />
          </Form.Item>

          <Form.Item
            name="iin"
            label="ИИН"
          >
            <Input placeholder="123456789012" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Категория"
          >
            <Select placeholder="Выберите категорию">
              <Option value="">Не выбрано</Option>
              <Option value="Бакалавр">Бакалавр</Option>
              <Option value="Магистр">Магистр</Option>
              <Option value="Докторант">Докторант</Option>
              <Option value="Специалист">Специалист</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="bin"
            label="БИН"
          >
            <Input placeholder="123456789" />
          </Form.Item>

          <Form.Item
            name="released"
            label="Год выпуска"
          >
            <Input placeholder="2023" />
          </Form.Item>

          <Form.Item
            name="op"
            label="Образовательная программа"
          >
            <Input placeholder="Программная инженерия" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Должность"
          >
            <Input placeholder="Разработчик" />
          </Form.Item>

          <Form.Item
            name="city_region"
            label="Город/Регион"
          >
            <Input placeholder="Алматы" />
          </Form.Item>

          <Form.Item
            name="document"
            label="Документ"
          >
            <Select placeholder="Тип документа">
              <Option value="">Не выбрано</Option>
              <Option value="Диплом">Диплом</Option>
              <Option value="Сертификат">Сертификат</Option>
              <Option value="Аттестат">Аттестат</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="grant_contract"
            label="Грант/Контракт"
          >
            <Select placeholder="Тип обучения">
              <Option value="">Не выбрано</Option>
              <Option value="Грант">Грант</Option>
              <Option value="Контракт">Контракт</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="continued_edu"
            label="Продолжение обучения"
          >
            <Select placeholder="Продолжает обучение?">
              <Option value="">Не выбрано</Option>
              <Option value="Да">Да</Option>
              <Option value="Нет">Нет</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="enterprise_spec"
            label="Предприятие по спец"
          >
            <Input placeholder="IT компания" />
          </Form.Item>

          <Form.Item
            name="enterprise_non_spec"
            label="Предприятие не по спец"
          >
            <Input placeholder="Другая компания" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default StudentForm;