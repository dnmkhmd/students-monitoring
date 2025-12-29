import * as XLSX from 'xlsx';
import { Student } from '../../types/student';
import { saveAs } from 'file-saver';

export class ExcelExportService {
  /**
   * Экспорт списка студентов в Excel
   */
  static exportStudentsToExcel(
    students: Student[], 
    filename: string = 'students.xlsx'
  ): void {
    try {
      // Подготовка данных для Excel
      const excelData = students.map(student => ({
        'ID': student.id,
        'ФИО': student.full_name || '',
        'ИИН': student.iin || '',
        'Категория': student.category || '',
        'БИН': student.bin || '',
        'Год выпуска': student.released || '',
        'Документ': student.document || '',
        'Продолжение обучения': student.continued_edu || '',
        'Предприятие по спец': student.enterprise_spec || '',
        'Предприятие не по спец': student.enterprise_non_spec || '',
        'Образовательная программа': student.op || '',
        'Должность': student.position || '',
        'Грант/Контракт': student.grant_contract || '',
        'Город/Регион': student.city_region || '',
      }));

      // Создание рабочей книги
      const workbook = XLSX.utils.book_new();
      
      // Создание рабочего листа
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Настройка ширины колонок
      const colWidths = [
        { wch: 5 },   // ID
        { wch: 30 },  // ФИО
        { wch: 12 },  // ИИН
        { wch: 15 },  // Категория
        { wch: 12 },  // БИН
        { wch: 10 },  // Год выпуска
        { wch: 15 },  // Документ
        { wch: 20 },  // Продолжение обучения
        { wch: 25 },  // Предприятие по спец
        { wch: 25 },  // Предприятие не по спец
        { wch: 30 },  // Образовательная программа
        { wch: 20 },  // Должность
        { wch: 15 },  // Грант/Контракт
        { wch: 20 },  // Город/Регион
      ];
      worksheet['!cols'] = colWidths;
      
      // Добавление листа в книгу
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Студенты');
      
      // Генерация Excel файла
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array' 
      });
      
      // Создание Blob и скачивание
      const data = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(data, filename);
      
    } catch (error) {
      console.error('Ошибка при экспорте в Excel:', error);
      throw new Error('Не удалось экспортировать данные в Excel');
    }
  }

  /**
   * Экспорт отчета с фильтрами
   */
  static exportFilteredReport(
    students: Student[],
    filters: Record<string, any>,
    filename: string = 'filtered_students.xlsx'
  ): void {
    // Добавляем информацию о фильтрах
    const filterInfo = {
      'Отчет с фильтрами': '',
      'Дата генерации': new Date().toLocaleString('ru-RU'),
      'Всего записей': students.length,
      'Примененные фильтры': JSON.stringify(filters, null, 2)
    };

    const workbook = XLSX.utils.book_new();
    
    // Лист с информацией о фильтрах
    const infoSheet = XLSX.utils.json_to_sheet([filterInfo]);
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Информация');
    
    // Лист с данными
    const dataSheet = XLSX.utils.json_to_sheet(
      students.map(student => ({
        'ID': student.id,
        'ФИО': student.full_name || '',
        'ИИН': student.iin || '',
        'Категория': student.category || '',
        'Город/Регион': student.city_region || '',
      }))
    );
    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Данные');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(data, filename);
  }
}