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
        <Descriptions.Item label={t('fullname')}>{student.full_name || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('iin')}>{student.iin || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('bin')}>{student.bin || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('category')}>
          <Tag color="blue">{student.category || t('not_specified')}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t('document')}>{student.document || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('released')}>{student.released || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('op')}>
          {student.op || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={t('position')}>{student.position || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('city_region')}>{student.city_region || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('grant_contract')}>
          <Tag color={student.grant_contract === 'Грант' || student.grant_contract === 'Grant' || student.grant_contract === 'Грант' ? 'green' : 'orange'}>
            {student.grant_contract || '-'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t('continued_edu')}>
          <Tag color={student.continued_edu === 'Да' || student.continued_edu === 'Yes' || student.continued_edu === 'Иә' ? 'green' : 'red'}>
            {student.continued_edu || '-'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t('enterprise_spec')} span={2}>
          {student.enterprise_spec || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={t('enterprise_non_spec')} span={2}>
          {student.enterprise_non_spec || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default StudentDetails;