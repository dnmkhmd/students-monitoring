import React from 'react';
import { Button, Dropdown, MenuProps, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { Student } from '../types/student';
import { ExcelExportService } from '../services/export/excelExport';
import { PdfExportService } from '../services/export/pdfExport';

interface ExportButtonsProps {
  students: Student[];
  filteredStudents: Student[];
  searchText: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  students, 
  filteredStudents,
  searchText 
}) => {
  const handleExportExcel = () => {
    try {
      const dataToExport = filteredStudents.length > 0 ? filteredStudents : students;
      const filename = searchText 
        ? `students_search_${searchText}_${new Date().toISOString().slice(0,10)}.xlsx`
        : `students_${new Date().toISOString().slice(0,10)}.xlsx`;
      
      ExcelExportService.exportStudentsToExcel(dataToExport, filename);
      message.success('Экспорт в Excel выполнен успешно');
    } catch (error) {
      message.error('Ошибка при экспорте в Excel');
    }
  };

  const handleExportPDF = () => {
    try {
      const dataToExport = filteredStudents.length > 0 ? filteredStudents : students;
      const filename = searchText 
        ? `students_search_${searchText}_${new Date().toISOString().slice(0,10)}.pdf`
        : `students_${new Date().toISOString().slice(0,10)}.pdf`;
      
      const title = searchText 
        ? `Список студентов (поиск: "${searchText}")`
        : 'Список студентов';
      
      PdfExportService.exportStudentsToPDF(dataToExport, filename, title);
      message.success('Экспорт в PDF выполнен успешно');
    } catch (error) {
      message.error('Ошибка при экспорте в PDF');
    }
  };

  const handleExportStatistics = () => {
    try {
      const dataToExport = filteredStudents.length > 0 ? filteredStudents : students;
      PdfExportService.exportStatisticsToPDF(
        dataToExport, 
        `statistics_${new Date().toISOString().slice(0,10)}.pdf`
      );
      message.success('Статистический отчет создан');
    } catch (error) {
      message.error('Ошибка при создании статистического отчета');
    }
  };

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'excel',
      label: 'Экспорт в Excel',
      icon: <FileExcelOutlined />,
      onClick: handleExportExcel,
    },
    {
      key: 'pdf',
      label: 'Экспорт в PDF',
      icon: <FilePdfOutlined />,
      onClick: handleExportPDF,
    },
    {
      key: 'statistics',
      label: 'Статистический отчет (PDF)',
      icon: <FilePdfOutlined />,
      onClick: handleExportStatistics,
    },
    {
      key: 'current',
      label: searchText ? 'Только отфильтрованные' : 'Все данные',
      disabled: true,
    },
    {
      key: 'count',
      label: `Записей: ${filteredStudents.length}`,
      disabled: true,
    },
  ];

  const handleExportAll = () => {
    handleExportExcel();
    setTimeout(() => handleExportPDF(), 1000);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button 
        icon={<DownloadOutlined />}
        onClick={handleExportAll}
      >
        Экспортировать все
      </Button>
      
      <Dropdown 
        menu={{ items: exportMenuItems }} 
        placement="bottomRight"
      >
        <Button icon={<DownloadOutlined />}>
          Дополнительно
        </Button>
      </Dropdown>
    </div>
  );
};

export default ExportButtons;