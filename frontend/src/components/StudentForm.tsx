// StudentForm.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
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
      title={initialValues ? t('edit') : t('add_student')}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('no')}
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {t('save_changes')}
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
            label={t('fullname')}
            rules={[{ required: true, message: t('fullname') }]}
          >
            <Input placeholder="Иванов Иван Иванович" />
          </Form.Item>

          <Form.Item
            name="iin"
            label={t('iin')}
          >
            <Input placeholder="123456789012" />
          </Form.Item>

          <Form.Item
            name="category"
            label={t('category')}
          >
            <Select placeholder={t('category')}>
              <Option value="">{t('not_specified')}</Option>
              <Option value="Бакалавр">{t('bachelor')}</Option>
              <Option value="Магистр">{t('master')}</Option>
              <Option value="Докторант">{t('phd')}</Option>
              <Option value="Специалист">{t('specialist')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="bin"
            label={t('bin')}
          >
            <Input placeholder="123456789" />
          </Form.Item>

          <Form.Item
            name="released"
            label={t('released')}
          >
            <Select placeholder={t('released') || "Год выпуска"}>
              <Option value="">{t('not_specified')}</Option>
              <Option value="2021-2022">2021-2022</Option>
              <Option value="2022-2023">2022-2023</Option>
              <Option value="2023-2024">2023-2024</Option>
              <Option value="2024-2025">2024-2025</Option>
              <Option value="2025-2026">2025-2026</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="op"
            label={t('op')}
          >
            <Input placeholder="Программная инженерия" />
          </Form.Item>

          <Form.Item
            name="position"
            label={t('position')}
          >
            <Input placeholder="Разработчик" />
          </Form.Item>

          <Form.Item
            name="city_region"
            label={t('city_region')}
          >
            <Input placeholder="Алматы" />
          </Form.Item>

          <Form.Item
            name="document"
            label={t('document')}
          >
            <Select placeholder={t('document')}>
              <Option value="">{t('not_specified')}</Option>
              <Option value="Диплом">{t('diploma')}</Option>
              <Option value="Сертификат">{t('certificate')}</Option>
              <Option value="Аттестат">{t('attestat')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="grant_contract"
            label={t('grant_contract')}
          >
            <Select placeholder={t('grant_contract')}>
              <Option value="">{t('not_specified')}</Option>
              <Option value="Грант">{t('grant')}</Option>
              <Option value="Контракт">{t('contract')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="continued_edu"
            label={t('continued_edu')}
          >
            <Select placeholder={t('continued_edu')}>
              <Option value="">{t('not_specified')}</Option>
              <Option value="Да">{t('yes')}</Option>
              <Option value="Нет">{t('no')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="enterprise_spec"
            label={t('enterprise_spec')}
          >
            <Input placeholder="IT компания" />
          </Form.Item>

          <Form.Item
            name="enterprise_non_spec"
            label={t('enterprise_non_spec')}
          >
            <Input placeholder="Другая компания" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default StudentForm;