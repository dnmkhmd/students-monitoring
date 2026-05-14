import * as XLSX from 'xlsx';
import { Student } from '../../types/student';
import { saveAs } from 'file-saver';

export class ExcelExportService {
  /**
   * Экспорт списка студентов в Excel (.xlsx)
   */
  static exportStudentsToExcel(
    students: Student[], 
    filename: string = 'students.xlsx'
  ): void {
    try {
      // Преобразование данных с понятными заголовками
      const excelData = students.map(student => ({
        'ID': student.id,
        'ФИО': student.full_name || '',
        'ИИН': student.iin || '',
        'Категория': student.category || '',
        'БИН': student.bin || '',
        'Год выпуска': student.released || '',
        'Документ': student.document || '',
        'Продолжение обучения': student.continued_edu || '',
        'Предприятие (спец)': student.enterprise_spec || '',
        'Предприятие (не спец)': student.enterprise_non_spec || '',
        'Образовательная программа': student.op || '',
        'Должность': student.position || '',
        'Грант/Контракт': student.grant_contract || '',
        'Город/Регион': student.city_region || '',
      }));

      // Создание новой рабочей книги
      const workbook = XLSX.utils.book_new();
      
      // Создание листа из JSON
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Автоматическая настройка ширины колонок (примерная)
      const colWidths = Object.keys(excelData[0] || {}).map(() => ({ wch: 20 }));
      worksheet['!cols'] = colWidths;
      
      // Добавление листа в книгу
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students Data');
      
      // Генерация бинарного файла (xlsx поддерживает Unicode по умолчанию)
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'binary' 
      });
      
      // Преобразование в ArrayBuffer для корректного Blob
      const s2ab = (s: string) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      };

      const data = new Blob([s2ab(excelBuffer)], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      saveAs(data, filename);
      
    } catch (error) {
      console.error('Excel Export Error:', error);
      throw new Error('Не удалось экспортировать в Excel');
    }
  }

  /**
   * Экспорт CSV с поддержкой BOM (чтобы Excel сразу понимал кириллицу)
   */
  static exportToCSV(students: Student[], filename: string = 'students.csv'): void {
    const headers = ['ID', 'ФИО', 'ИИН', 'Категория', 'Регион'];
    const rows = students.map(s => [
      s.id, 
      s.full_name, 
      s.iin, 
      s.category, 
      s.city_region
    ].join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Добавляем BOM (Byte Order Mark) для UTF-8 (\uFEFF)
    // Это критически важно для того, чтобы Excel открывал CSV с кириллицей корректно
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }
}