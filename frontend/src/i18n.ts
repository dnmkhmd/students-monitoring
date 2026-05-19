// i18n.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ru: {
    translation: {
      "app_title": "TULEKTER",
      "students": "Студенты",
      "vacancies": "Вакансии",
      "feedback": "Обратная связь",
      "profile": "Личный кабинет",
      "notifications": "Уведомления",
      "logout": "Выйти",
      "login": "Войти",
      "register": "Регистрация",
      "auth_title": "Авторизация",
      "reg_title": "Регистрация аккаунта",
      "email_placeholder": "Email",
      "password_placeholder": "Пароль",
      "name_placeholder": "ФИО",
      "role_label": "Роль",
      "role_viewer": "Наблюдатель",
      "role_admin": "Администратор",
      "no_account": "Нет аккаунта? Зарегистрироваться",
      "have_account": "Уже есть аккаунт? Войти",
      
      // Student details
      "student_list": "Список студентов",
      "total_students": "Всего студентов",
      "search_placeholder": "Поиск по ФИО, ИИН, категории или городу...",
      "add_student": "Добавить студента",
      "actions": "Действия",
      "edit": "Редактировать",
      "delete": "Удалить",
      "view": "Просмотр",
      
      // Student fields
      "fullname": "ФИО",
      "iin": "ИИН",
      "category": "Категория",
      "bin": "БИН",
      "released": "Выпуск",
      "document": "Документ",
      "continued_edu": "Продолжил обучение",
      "enterprise_spec": "Предприятие (спец.)",
      "enterprise_non_spec": "Предприятие (не спец.)",
      "op": "ОП",
      "position": "Должность",
      "grant_contract": "Грант / Договор",
      "city_region": "Город / Регион",
      
      // Feedback Form
      "feedback_title": "Напишите нам",
      "feedback_desc": "Есть вопросы или предложения? Отправьте нам сообщение, и мы ответим в ближайшее время.",
      "send_message": "Отправить сообщение",
      "message_placeholder": "Ваше сообщение...",
      "feedback_success": "Спасибо! Ваше сообщение успешно отправлено.",
      
      // Profile Page
      "profile_title": "Личный кабинет пользователя",
      "profile_desc": "Управляйте своим профилем и личной информацией",
      "save_changes": "Сохранить изменения",
      "profile_updated": "Профиль успешно обновлен!",
      
      // Vacancies Page
      "vacancy_title": "Доступные Вакансии",
      "vacancy_desc": "Актуальные вакансии для студентов и выпускников",
      "add_vacancy": "Добавить вакансию",
      "salary": "Зарплата",
      "company": "Компания",
      "location": "Местоположение",
      "apply_btn": "Откликнуться",
      "contact_email": "Контактный email",
      "vacancy_success": "Вакансия успешно добавлена!",
      
      // Notifications
      "notif_title": "Уведомления",
      "notif_empty": "Нет новых уведомлений",
      "notif_welcome": "Добро пожаловать в систему TULEKTER! Теперь вы можете управлять студентами и просматривать вакансии.",
      "notif_new_vacancy": "Добавлена новая вакансия: {{title}} в компанию {{company}}!",
      "notif_new_feedback": "Получен новый отзыв от {{name}}!",
      "notif_new_request": "Получена новая заявка от {{name}} на рассмотрение!",
      
      // Confirmations
      "confirm_title": "Вы уверены?",
      "logout_confirm_content": "Вы действительно хотите выйти из системы?",
      "feedback_confirm_content": "Вы действительно хотите отправить это сообщение обратной связи?",
      "vacancy_confirm_content": "Вы действительно хотите добавить и опубликовать эту вакансию?",
      "student_confirm_content": "Вы действительно хотите сохранить эти данные студента?",
      "yes": "Да",
      "no": "Нет",
      
      // Export labels
      "export_excel_success": "Экспорт в Excel выполнен успешно",
      "export_excel_error": "Ошибка при экспорте в Excel",
      "export_csv_success": "Экспорт в CSV (с поддержкой кириллицы) выполнен успешно",
      "export_csv_error": "Ошибка при экспорте в CSV",
      "students_list_search": "Список студентов (поиск: \"{{search}}\")",
      "export_pdf_success": "Экспорт в PDF выполнен успешно",
      "export_pdf_error": "Ошибка при экспорте в PDF",
      "export_stats_success": "Статистический отчет создан",
      "export_stats_error": "Ошибка при создании статистического отчета",
      "export_excel": "Экспорт в Excel",
      "export_pdf": "Экспорт в PDF",
      "export_csv": "Экспорт в CSV (для старого Excel)",
      "export_stats": "Статистический отчет (PDF)",
      "only_filtered": "Только отфильтрованные",
      "all_data": "Все данные",
      "records_count": "Записей",
      "export_all": "Экспортировать все",
      "additional": "Дополнительно",
      
      // Student details and form options
      "student_details_title": "Детальная информация о студенте",
      "not_specified": "Не указано",
      "bachelor": "Бакалавр",
      "master": "Магистр",
      "phd": "Докторант",
      "specialist": "Специалист",
      "diploma": "Диплом",
      "certificate": "Сертификат",
      "attestat": "Аттестат",
      "grant": "Грант",
      "contract": "Контракт",
      
      // Student Table details
      "shown": "Показано",
      "delete_student_title": "Удалить студента",
      "delete_student_confirm": "Вы уверены, что хотите удалить этого студента?",
      "cancel": "Отмена",
      "student_deleted": "Студент удален",
      "error_deleting_student": "Ошибка при удалении студента",
      "data_updated": "Данные успешно обновлены",
      "student_added": "Студент успешно добавлен",
      "error_saving_data": "Ошибка при сохранении данных",
      "search_results_for": "Результаты поиска по запросу",
      "clear_search": "Очистить поиск",
      "of": "из",
      "records": "записей",
      "no_search_results": "Нет результатов по вашему запросу",
      "no_data": "Нет данных",
      "error_loading_data": "Ошибка при загрузке данных",

      // Student review flow
      "request_submitted": "Ваши данные отправлены на рассмотрение администратору!",
      "add_my_data": "Добавить свои данные",
      "pending_requests": "Заявки на рассмотрение",
      "approved_students": "Анкеты студентов",
      "approve_btn": "Одобрить",
      "reject_btn": "Отклонить",
      "approve_confirm_title": "Одобрить заявку?",
      "approve_confirm_content": "Вы действительно хотите одобрить эту заявку и добавить студента в систему?",
      "reject_confirm_title": "Отклонить заявку?",
      "reject_confirm_content": "Вы действительно хотите отклонить и удалить эту заявку?",
      "approved_success": "Заявка успешно одобрена!",
      "rejected_success": "Заявка отклонена!"
    }
  },
  kk: {
    translation: {
      "app_title": "TULEKTER",
      "students": "Студенттер",
      "vacancies": "Бос жұмыс орындары",
      "feedback": "Кері байланыс",
      "profile": "Жеке кабинет",
      "notifications": "Хабарламалар",
      "logout": "Шығу",
      "login": "Кіру",
      "register": "Тіркелу",
      "auth_title": "Авторизация",
      "reg_title": "Тіркелгіні құру",
      "email_placeholder": "Email",
      "password_placeholder": "Құпия сөз",
      "name_placeholder": "Толық аны-жөні",
      "role_label": "Рөлі",
      "role_viewer": "Бақылаушы",
      "role_admin": "Әкімші",
      "no_account": "Тіркелгі жоқ па? Тіркелу",
      "have_account": "Тіркелгі бар ма? Кіру",
      
      // Student details
      "student_list": "Студенттер тізімі",
      "total_students": "Барлық студенттер",
      "search_placeholder": "Аты-жөні, ЖСН, санат немесе қала бойынша іздеу...",
      "add_student": "Студент қосу",
      "actions": "Әрекеттер",
      "edit": "Өңдеу",
      "delete": "Өшіру",
      "view": "Қарау",
      
      // Student fields
      "fullname": "Аты-жөні",
      "iin": "ЖСН",
      "category": "Санаты",
      "bin": "БСН",
      "released": "Шығарылған",
      "document": "Құжат",
      "continued_edu": "Оқуын жалғастырды",
      "enterprise_spec": "Кәсіпорын (маман.)",
      "enterprise_non_spec": "Кәсіпорын (маман. емес)",
      "op": "ББ",
      "position": "Лауазымы",
      "grant_contract": "Грант / Келісімшарт",
      "city_region": "Қала / Аймақ",
      
      // Feedback Form
      "feedback_title": "Бізге жазыңыз",
      "feedback_desc": "Сұрақтарыңыз немесе ұсыныстарыңыз бар ма? Бізге хабарлама жіберіңіз, біз жақын арада жауап береміз.",
      "send_message": "Хабарлама жіберу",
      "message_placeholder": "Сіздің хабарламаңыз...",
      "feedback_success": "Рақмет! Сіздің хабарламаңыз сәтті жіберілді.",
      
      // Profile Page
      "profile_title": "Пайдаланушының жеке кабинеті",
      "profile_desc": "Профильді және жеке ақпаратты басқарыңыз",
      "save_changes": "Өзгерістерді сақтау",
      "profile_updated": "Профиль сәтті жаңартылды!",
      
      // Vacancies Page
      "vacancy_title": "Бос жұмыс орындары",
      "vacancy_desc": "Студенттер мен түлектер үшін өзекті бос жұмыс орындары",
      "add_vacancy": "Бос орын қосу",
      "salary": "Жалақы",
      "company": "Компания",
      "location": "Орналасқан жері",
      "apply_btn": "Жауап беру",
      "contact_email": "Байланыс email-і",
      "vacancy_success": "Бос жұмыс орны сәтті қосылды!",
      
      // Notifications
      "notif_title": "Хабарламалар",
      "notif_empty": "Жаңа хабарламалар жоқ",
      "notif_welcome": "TULEKTER жүйесіне қош келдіңіз! Енді сіз студенттерді басқара аласыз және бос жұмыс орындарын көре аласыз.",
      "notif_new_vacancy": "Жаңа бос жұмыс орны қосылды: {{company}} компаниясындағы {{title}}!",
      "notif_new_feedback": "{{name}} пайдаланушысынан жаңа кері байланыс алынды!",
      "notif_new_request": "{{name}} пайдаланушысынан қарауға жаңа өтінім алынды!",
      
      // Confirmations
      "confirm_title": "Сенімдісіз бе?",
      "logout_confirm_content": "Жүйеден шыққыңыз келетініне сенімдісіз бе?",
      "feedback_confirm_content": "Бұл хабарламаны жібергіңіз келетініне сенімдісіз бе?",
      "vacancy_confirm_content": "Бұл бос жұмыс орнын қосқыңыз келетініне сенімдісіз бе?",
      "student_confirm_content": "Студент мәліметтерін сақтағыңыз келетініне сенімдісіз бе?",
      "yes": "Иә",
      "no": "Жоқ",
      
      // Export labels
      "export_excel_success": "Excel-ге экспорттау сәтті аяқталды",
      "export_excel_error": "Excel-ге экспорттау кезінде қате кетті",
      "export_csv_success": "CSV-ге экспорттау сәтті аяқталды",
      "export_csv_error": "CSV-ге экспорттау кезінде қате кетті",
      "students_list_search": "Студенттер тізімі (іздеу: \"{{search}}\")",
      "export_pdf_success": "PDF-ке экспорттау сәтті аяқталды",
      "export_pdf_error": "PDF-ке экспорттау кезінде қате кетті",
      "export_stats_success": "Статистикалық есеп құрылды",
      "export_stats_error": "Статистикалық есепті құру кезінде қате кетті",
      "export_excel": "Excel-ге экспорттау",
      "export_pdf": "PDF-ке экспорттау",
      "export_csv": "CSV-ге экспорттау (ескі Excel үшін)",
      "export_stats": "Статистикалық есеп (PDF)",
      "only_filtered": "Тек сүзілгендер",
      "all_data": "Барлық мәліметтер",
      "records_count": "Жазбалар саны",
      "export_all": "Барлығын экспорттау",
      "additional": "Қосымша",
      
      // Student details and form options
      "student_details_title": "Студент туралы толық ақпарат",
      "not_specified": "Көрсетілмеген",
      "bachelor": "Бакалавр",
      "master": "Магистр",
      "phd": "Докторант",
      "specialist": "Маман",
      "diploma": "Диплом",
      "certificate": "Сертификат",
      "attestat": "Аттестат",
      "grant": "Грант",
      "contract": "Келісімшарт",
      
      // Student Table details
      "shown": "Көрсетілді",
      "delete_student_title": "Студентті өшіру",
      "delete_student_confirm": "Бұл студентті өшіргіңіз келетініне сенімдісіз бе?",
      "cancel": "Бас тарту",
      "student_deleted": "Студент өшірілді",
      "error_deleting_student": "Студентті өшіру кезінде қате кетті",
      "data_updated": "Мәліметтер сәтті жаңартылды",
      "student_added": "Студент сәтті қосылды",
      "error_saving_data": "Мәліметтерді сақтау кезінде қате кетті",
      "search_results_for": "іздеу сұранысы бойынша нәтижелер",
      "clear_search": "Іздеуді тазалау",
      "of": "ішінен",
      "records": "жазбалар",
      "no_search_results": "Сіздің іздеу сұранысыңыз бойынша нәтиже табылмады",
      "no_data": "Мәліметтер жоқ",
      "error_loading_data": "Мәліметтерді жүктеу кезінде қате кетті",

      // Student review flow
      "request_submitted": "Мәліметтеріңіз әкімшінің қарауына жіберілді!",
      "add_my_data": "Өз мәліметтерімді қосу",
      "pending_requests": "Қараудағы өтінімдер",
      "approved_students": "Студенттердің сауалнамалары",
      "approve_btn": "Мақұлдау",
      "reject_btn": "Қабылдамау",
      "approve_confirm_title": "Өтінімді мақұлдау керек пе?",
      "approve_confirm_content": "Бұл өтінімді мақұлдап, студентті жүйеге қосқыңыз келетініне сенімдісіз бе?",
      "reject_confirm_title": "Өтінімді қабылдамау керек пе?",
      "reject_confirm_content": "Бұл өтінімді қабылдамай, өшіргіңіз келетініне сенімдісіз бе?",
      "approved_success": "Өтінім сәтті мақұлданды!",
      "rejected_success": "Өтінім қабылданбады!"
    }
  },
  en: {
    translation: {
      "app_title": "TULEKTER",
      "students": "Students",
      "vacancies": "Job Vacancies",
      "feedback": "Feedback",
      "profile": "Profile",
      "notifications": "Notifications",
      "logout": "Logout",
      "login": "Login",
      "register": "Register",
      "auth_title": "Sign In",
      "reg_title": "Create Account",
      "email_placeholder": "Email",
      "password_placeholder": "Password",
      "name_placeholder": "Full Name",
      "role_label": "Role",
      "role_viewer": "Viewer",
      "role_admin": "Admin",
      "no_account": "Don't have an account? Sign Up",
      "have_account": "Already have an account? Sign In",
      
      // Student details
      "student_list": "Students List",
      "total_students": "Total Students",
      "search_placeholder": "Search by name, IIN, category or city...",
      "add_student": "Add Student",
      "actions": "Actions",
      "edit": "Edit",
      "delete": "Delete",
      "view": "View",
      
      // Student fields
      "fullname": "Full Name",
      "iin": "IIN",
      "category": "Category",
      "bin": "BIN",
      "released": "Graduation Year",
      "document": "Document",
      "continued_edu": "Continued Education",
      "enterprise_spec": "Enterprise (specialty)",
      "enterprise_non_spec": "Enterprise (non-specialty)",
      "op": "EP",
      "position": "Position",
      "grant_contract": "Grant / Contract",
      "city_region": "City / Region",
      
      // Feedback Form
      "feedback_title": "Write to us",
      "feedback_desc": "Have questions or suggestions? Send us a message and we'll reply shortly.",
      "send_message": "Send Message",
      "message_placeholder": "Your message...",
      "feedback_success": "Thank you! Your message has been sent successfully.",
      
      // Profile Page
      "profile_title": "User Profile",
      "profile_desc": "Manage your profile and personal information",
      "save_changes": "Save Changes",
      "profile_updated": "Profile updated successfully!",
      
      // Vacancies Page
      "vacancy_title": "Available Vacancies",
      "vacancy_desc": "Current job openings for students and graduates",
      "add_vacancy": "Add Vacancy",
      "salary": "Salary",
      "company": "Company",
      "location": "Location",
      "apply_btn": "Apply Now",
      "contact_email": "Contact Email",
      "vacancy_success": "Vacancy added successfully!",
      
      // Notifications
      "notif_title": "Notifications",
      "notif_empty": "No new notifications",
      "notif_welcome": "Welcome to TULEKTER! You can now manage students and browse job vacancies.",
      "notif_new_vacancy": "New vacancy added: {{title}} at {{company}}!",
      "notif_new_feedback": "New feedback received from {{name}}!",
      "notif_new_request": "New request received from {{name}} for review!",
      
      // Confirmations
      "confirm_title": "Are you sure?",
      "logout_confirm_content": "Are you sure you want to log out from the system?",
      "feedback_confirm_content": "Are you sure you want to send this feedback message?",
      "vacancy_confirm_content": "Are you sure you want to add and publish this vacancy?",
      "student_confirm_content": "Are you sure you want to save this student data?",
      "yes": "Yes",
      "no": "No",
      
      // Export labels
      "export_excel_success": "Export to Excel completed successfully",
      "export_excel_error": "Error during Excel export",
      "export_csv_success": "Export to CSV completed successfully",
      "export_csv_error": "Error during CSV export",
      "students_list_search": "Students List (search: \"{{search}}\")",
      "export_pdf_success": "Export to PDF completed successfully",
      "export_pdf_error": "Error during PDF export",
      "export_stats_success": "Statistical report created successfully",
      "export_stats_error": "Error during statistical report creation",
      "export_excel": "Export to Excel",
      "export_pdf": "Export to PDF",
      "export_csv": "Export to CSV (for older Excel)",
      "export_stats": "Statistical Report (PDF)",
      "only_filtered": "Only filtered",
      "all_data": "All data",
      "records_count": "Records count",
      "export_all": "Export All",
      "additional": "Additional",
      
      // Student details and form options
      "student_details_title": "Student Detailed Information",
      "not_specified": "Not specified",
      "bachelor": "Bachelor",
      "master": "Master",
      "phd": "PhD",
      "specialist": "Specialist",
      "diploma": "Diploma",
      "certificate": "Certificate",
      "attestat": "Attestation",
      "grant": "Grant",
      "contract": "Contract",
      
      // Student Table details
      "shown": "Shown",
      "delete_student_title": "Delete Student",
      "delete_student_confirm": "Are you sure you want to delete this student?",
      "cancel": "Cancel",
      "student_deleted": "Student deleted successfully",
      "error_deleting_student": "Error deleting student",
      "data_updated": "Data updated successfully",
      "student_added": "Student added successfully",
      "error_saving_data": "Error saving data",
      "search_results_for": "Search results for",
      "clear_search": "Clear search",
      "of": "of",
      "records": "records",
      "no_search_results": "No search results found",
      "no_data": "No data",
      "error_loading_data": "Error loading data",

      // Student review flow
      "request_submitted": "Your data has been submitted to the admin for review!",
      "add_my_data": "Add my data",
      "pending_requests": "Pending Requests",
      "approved_students": "Students Profiles",
      "approve_btn": "Approve",
      "reject_btn": "Reject",
      "approve_confirm_title": "Approve request?",
      "approve_confirm_content": "Are you sure you want to approve this request and add the student to the system?",
      "reject_confirm_title": "Reject request?",
      "reject_confirm_content": "Are you sure you want to reject and delete this request?",
      "approved_success": "Request successfully approved!",
      "rejected_success": "Request rejected!"
    }
  }
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
