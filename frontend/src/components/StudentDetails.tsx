// StudentDetails.tsx
import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { Student } from '../types/student';

interface StudentDetailsProps {
  visible: boolean;
  student: Student | null;
  onClose: () => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ visible, student, onClose }) => {
  const { t } = useTranslation();

  if (!student) return null;

  return (
    <Modal
      title={t('student_details_title')}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="ID">{student.id}</Descriptions.Item>
        <Descriptions.Item label="ФИО">{student.full_name || '-'}</Descriptions.Item>
        <Descriptions.Item label="ИИН">{student.iin || '-'}</Descriptions.Item>
        <Descriptions.Item label="БИН">{student.bin || '-'}</Descriptions.Item>
        <Descriptions.Item label="Категория">
          <Tag color="blue">{student.category || t('not_specified')}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Документ">{student.document || '-'}</Descriptions.Item>
        <Descriptions.Item label="Год выпуска">{student.released || '-'}</Descriptions.Item>
        <Descriptions.Item label="Образовательная программа">
          {student.op || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Должность">{student.position || '-'}</Descriptions.Item>
        <Descriptions.Item label="Город/Регион">{student.city_region || '-'}</Descriptions.Item>
        <Descriptions.Item label="Грант/Контракт">
          <Tag color={student.grant_contract === 'Грант' ? 'green' : 'orange'}>
            {student.grant_contract || '-'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Продолжение обучения">
          <Tag color={student.continued_edu === 'Да' ? 'green' : 'red'}>
            {student.continued_edu || '-'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Предприятие по спец" span={2}>
          {student.enterprise_spec || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Предприятие не по спец" span={2}>
          {student.enterprise_non_spec || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default StudentDetails;