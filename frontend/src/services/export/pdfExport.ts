import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student } from '../../types/student';
import { robotoFont } from './font';

export class PdfExportService {
  /**
   * Инициализация шрифта Roboto для поддержки кириллицы
   */
  private static initFont(doc: jsPDF) {
    doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
  }

  /**
   * Экспорт списка студентов в PDF
   */
  static exportStudentsToPDF(
    students: Student[], 
    filename: string = 'students.pdf',
    title: string = 'Список студентов'
  ): void {
    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      this.initFont(doc);
      
      doc.setFontSize(18);
      doc.text(title, 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Дата генерации: ${new Date().toLocaleString('ru-RU')}`, 14, 30);
      doc.text(`Всего записей: ${students.length}`, 14, 35);
      
      const tableData = students.map(student => [
        student.id.toString(),
        student.full_name || '-',
        student.iin || '-',
        student.category || '-',
        student.city_region || '-',
        student.released || '-',
        student.grant_contract || '-',
      ]);

      autoTable(doc, {
        startY: 45,
        head: [
          ['ID', 'ФИО', 'ИИН', 'Категория', 'Город/Регион', 'Год выпуска', 'Грант/Контракт']
        ],
        body: tableData,
        theme: 'grid',
        styles: { 
          font: 'Roboto', // Основной шрифт для всех ячеек
          fontSize: 8 
        },
        headStyles: { 
          font: 'Roboto', // Явное указание шрифта для заголовков
          fillColor: [41, 128, 185], 
          textColor: 255 
        },
        alternateRowStyles: {
          font: 'Roboto'
        },
        margin: { top: 45 },
      });

      doc.save(filename);
    } catch (error) {
      console.error('Ошибка при экспорте в PDF:', error);
      throw new Error('Не удалось экспортировать данные в PDF');
    }
  }

  /**
   * Экспорт детального отчета по студенту
   */
  static exportStudentDetailToPDF(
    student: Student,
    filename: string = `student_${student.id}.pdf`
  ): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    this.initFont(doc);
    
    doc.setFontSize(18);
    doc.text('Карточка студента', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`ID: ${student.id}`, 20, 40);
    doc.text(`Дата: ${new Date().toLocaleString('ru-RU')}`, 20, 50);
    
    autoTable(doc, {
      startY: 60,
      body: [
        ['ФИО', student.full_name || '-'],
        ['ИИН', student.iin || '-'],
        ['Категория', student.category || '-'],
        ['Программа', student.op || '-'],
        ['Год выпуска', student.released || '-'],
        ['Должность', student.position || '-'],
        ['Регион', student.city_region || '-'],
        ['Грант', student.grant_contract || '-'],
      ],
      styles: { 
        font: 'Roboto', 
        fontSize: 11 
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50, font: 'Roboto' },
      },
      theme: 'plain'
    });
    
    doc.save(filename);
  }

  /**
   * Экспорт статистического отчета (PDF)
   */
  static exportStatisticsToPDF(
    students: Student[],
    filename: string = 'statistics.pdf'
  ): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    this.initFont(doc);
    
    doc.setFontSize(20);
    doc.text('Статистический отчет', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Дата генерации: ${new Date().toLocaleString('ru-RU')}`, 105, 30, { align: 'center' });
    doc.text(`Всего студентов: ${students.length}`, 105, 40, { align: 'center' });
    
    const categories: Record<string, number> = {};
    students.forEach(student => {
      const cat = student.category || 'Не указано';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    autoTable(doc, {
      startY: 60,
      head: [['Категория', 'Количество', 'Процент']],
      body: Object.entries(categories).map(([cat, count]) => [
        cat,
        count.toString(),
        `${((count / students.length) * 100).toFixed(1)}%`
      ]),
      styles: { 
        font: 'Roboto', 
        fontSize: 10 
      },
      headStyles: { 
        font: 'Roboto' 
      }
    });
    
    doc.save(filename);
  }
}