// ExportButtons.tsx
import React from 'react';
import { Button, Dropdown, MenuProps, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const handleExportExcel = () => {
    try {
      const dataToExport = filteredStudents.length > 0 ? filteredStudents : students;
      const filename = searchText 
        ? `students_search_${searchText}_${new Date().toISOString().slice(0,10)}.xlsx`
        : `students_${new Date().toISOString().slice(0,10)}.xlsx`;
      
      ExcelExportService.exportStudentsToExcel(dataToExport, filename);
      message.success(t('export_excel_success'));
    } catch (error) {
      message.error(t('export_excel_error'));
    }
  };

  const handleExportCSV = () => {
    try {
      const dataToExport = filteredStudents.length > 0 ? filteredStudents : students;
      const filename = searchText 
        ? `students_search_${searchText}_${new Date().toISOString().slice(0,10)}.csv`
        : `students_${new Date().toISOString().slice(0,10)}.csv`;
      
      ExcelExportService.exportToCSV(dataToExport, filename);
      message.success(t('export_csv_success'));
    } catch (error) {
      message.error(t('export_csv_error'));
    }
  };

  const handleExportPDF = () => {
    try {
      const dataToExport = filteredStudents.length > 0 ? filteredStudents : students;
      const filename = searchText 
        ? `students_search_${searchText}_${new Date().toISOString().slice(0,10)}.pdf`
        : `students_${new Date().toISOString().slice(0,10)}.pdf`;
      
      const title = searchText 
        ? t('students_list_search', { search: searchText })
        : t('student_list');
      
      PdfExportService.exportStudentsToPDF(dataToExport, filename, title);
      message.success(t('export_pdf_success'));
    } catch (error) {
      message.error(t('export_pdf_error'));
    }
  };

  const handleExportStatistics = () => {
    try {
      const dataToExport = filteredStudents.length > 0 ? filteredStudents : students;
      PdfExportService.exportStatisticsToPDF(
        dataToExport, 
        `statistics_${new Date().toISOString().slice(0,10)}.pdf`
      );
      message.success(t('export_stats_success'));
    } catch (error) {
      message.error(t('export_stats_error'));
    }
  };

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'excel',
      label: t('export_excel'),
      icon: <FileExcelOutlined />,
      onClick: handleExportExcel,
    },
    {
      key: 'pdf',
      label: t('export_pdf'),
      icon: <FilePdfOutlined />,
      onClick: handleExportPDF,
    },
    {
      key: 'csv',
      label: t('export_csv'),
      icon: <FileExcelOutlined />,
      onClick: handleExportCSV,
    },
    {
      key: 'statistics',
      label: t('export_stats'),
      icon: <FilePdfOutlined />,
      onClick: handleExportStatistics,
    },
    {
      key: 'current',
      label: searchText ? t('only_filtered') : t('all_data'),
      disabled: true,
    },
    {
      key: 'count',
      label: `${t('records_count')}: ${filteredStudents.length}`,
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
        {t('export_all')}
      </Button>
      
      <Dropdown 
        menu={{ items: exportMenuItems }} 
        placement="bottomRight"
      >
        <Button icon={<DownloadOutlined />}>
          {t('additional')}
        </Button>
      </Dropdown>
    </div>
  );
};

export default ExportButtons;