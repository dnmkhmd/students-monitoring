import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student } from '../../types/student';

export class PdfExportService {
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
      
      // Заголовок
      doc.setFontSize(20);
      doc.text(title, 14, 20);
      
      // Информация о отчете
      doc.setFontSize(10);
      doc.text(`Дата генерации: ${new Date().toLocaleString('ru-RU')}`, 14, 30);
      doc.text(`Всего записей: ${students.length}`, 14, 35);
      
      // Подготовка данных для таблицы
      const tableData = students.map(student => [
        student.id.toString(),
        student.full_name || '-',
        student.iin || '-',
        student.category || '-',
        student.city_region || '-',
        student.released || '-',
        student.grant_contract || '-',
      ]);

      // Создание таблицы
      autoTable(doc, {
        startY: 45,
        head: [
          ['ID', 'ФИО', 'ИИН', 'Категория', 'Город/Регион', 'Год выпуска', 'Грант/Контракт']
        ],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 45 },
      });

      // Сохранение PDF
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
    
    // Заголовок
    doc.setFontSize(18);
    doc.text('Карточка студента', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`ID: ${student.id}`, 20, 40);
    doc.text(`Дата генерации: ${new Date().toLocaleString('ru-RU')}`, 20, 50);
    
    // Основная информация
    doc.setFontSize(14);
    doc.text('Основная информация', 20, 70);
    doc.setFontSize(11);
    
    let yPos = 80;
    const info = [
      ['ФИО', student.full_name || '-'],
      ['ИИН', student.iin || '-'],
      ['Категория', student.category || '-'],
      ['БИН', student.bin || '-'],
      ['Город/Регион', student.city_region || '-'],
    ];
    
    info.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 20, yPos);
      yPos += 10;
    });
    
    // Образовательная информация
    doc.setFontSize(14);
    doc.text('Образовательная информация', 20, yPos + 10);
    doc.setFontSize(11);
    yPos += 20;
    
    const eduInfo = [
      ['Образовательная программа', student.op || '-'],
      ['Год выпуска', student.released || '-'],
      ['Документ', student.document || '-'],
      ['Продолжение обучения', student.continued_edu || '-'],
      ['Грант/Контракт', student.grant_contract || '-'],
    ];
    
    eduInfo.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 20, yPos);
      yPos += 10;
    });
    
    // Трудовая информация
    doc.setFontSize(14);
    doc.text('Трудовая информация', 20, yPos + 10);
    doc.setFontSize(11);
    yPos += 20;
    
    const workInfo = [
      ['Должность', student.position || '-'],
      ['Предприятие по специальности', student.enterprise_spec || '-'],
      ['Предприятие не по специальности', student.enterprise_non_spec || '-'],
    ];
    
    workInfo.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 20, yPos);
      yPos += 10;
    });
    
    doc.save(filename);
  }

  /**
   * Экспорт статистического отчета
   */
  static exportStatisticsToPDF(
    students: Student[],
    filename: string = 'statistics.pdf'
  ): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Заголовок
    doc.setFontSize(20);
    doc.text('Статистический отчет', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Дата генерации: ${new Date().toLocaleString('ru-RU')}`, 105, 30, { align: 'center' });
    doc.text(`Всего студентов: ${students.length}`, 105, 40, { align: 'center' });
    
    // Статистика по категориям
    const categories: Record<string, number> = {};
    students.forEach(student => {
      const category = student.category || 'Не указано';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    let yPos = 60;
    doc.setFontSize(14);
    doc.text('Распределение по категориям:', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    Object.entries(categories).forEach(([category, count]) => {
      const percentage = ((count / students.length) * 100).toFixed(1);
      doc.text(`${category}: ${count} (${percentage}%)`, 30, yPos);
      yPos += 10;
    });
    
    // Статистика по городам
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Распределение по городам/регионам:', 20, yPos);
    
    const cities: Record<string, number> = {};
    students.forEach(student => {
      const city = student.city_region || 'Не указано';
      cities[city] = (cities[city] || 0) + 1;
    });
    
    yPos += 10;
    doc.setFontSize(11);
    Object.entries(cities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // Топ 10 городов
      .forEach(([city, count]) => {
        doc.text(`${city}: ${count}`, 30, yPos);
        yPos += 10;
      });
    
    doc.save(filename);
  }
}