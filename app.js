const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

// ═══════════════════════════════════════════
// TRANSLATIONS (5 LANGUAGES)
// ═══════════════════════════════════════════
const LANGS = {
  he: 'עברית',
  en: 'English',
  ru: 'Русский',
  es: 'Español',
  ar: 'العربية'
};
const RTL = ['he', 'ar'];
const T = {
  connect:{he:'🔗 חיבור',en:'🔗 Connect',ru:'🔗 Связь',es:'🔗 Conexión',ar:'🔗 اتصال'},
  dash:{he:'📊 דשבורד',en:'📊 Dashboard',ru:'📊 Панель',es:'📊 Panel',ar:'📊 لوحة'},
  dtc:{he:'❌ תקלות',en:'❌ Faults',ru:'❌ Ошибки',es:'❌ Fallos',ar:'❌ أعطال'},
  scan:{he:'🔍 סריקה',en:'🔍 ECU Scan',ru:'🔍 Скан',es:'🔍 Escaneo',ar:'🔍 مسح'},
  vehicle:{he:'🚗 רכב',en:'🚗 Vehicle',ru:'🚗 Авто',es:'🚗 Vehículo',ar:'🚗 مركبة'},
  term:{he:'💻 טרמינל',en:'💻 Terminal',ru:'💻 Терминал',es:'💻 Terminal',ar:'💻 طرفية'},
  guide:{he:'📖 מדריך',en:'📖 Guide',ru:'📖 Гид',es:'📖 Guía',ar:'📖 دليل'},
  tools:{he:'🔧 כלים',en:'🔧 Tools',ru:'🔧 Инструменты',es:'🔧 Herramientas',ar:'🔧 أدوات'},
  rec:{he:'⏺ הקלטה',en:'⏺ Record',ru:'⏺ Запись',es:'⏺ Grabar',ar:'⏺ تسجيل'},
  stopRec:{he:'⏹ עצור הקלטה',en:'⏹ Stop recording',ru:'⏹ Стоп запись',es:'⏹ Parar',ar:'⏹ توقف'},
  exportCsv:{he:'📥 ייצוא CSV',en:'📥 Export CSV',ru:'📥 Экспорт CSV',es:'📥 Exportar CSV',ar:'📥 تصدير CSV'},
  history:{he:'📋 היסטוריה',en:'📋 History',ru:'📋 История',es:'📋 Historial',ar:'📋 سجل'},
  fuelCons:{he:'צריכת דלק',en:'Fuel consumption',ru:'Расход топлива',es:'Consumo',ar:'استهلاك الوقود'},
  ohmCalc:{he:'מחשבון אוהם',en:'Ohm calculator',ru:'Калькулятор Ома',es:'Calculadora Ohm',ar:'حاسبة أوم'},
  sensorRef:{he:'ערכי חיישנים תקינים',en:'Sensor reference values',ru:'Справочные значения датчиков',es:'Valores de referencia',ar:'القيم المرجعية'},
  pinout:{he:'פינאוט OBD-II',en:'OBD-II Pinout',ru:'Распиновка OBD-II',es:'Pinout OBD-II',ar:'OBD-II Pinout'},
  on:{he:'● מחובר',en:'● Connected',ru:'● Подключен',es:'● Conectado',ar:'● متصل'},
  off:{he:'○ מנותק',en:'○ Disconnected',ru:'○ Отключён',es:'○ Desconectado',ar:'○ غير متصل'},
  ing:{he:'◌ מתחבר...',en:'◌ Connecting...',ru:'◌ Подключение...',es:'◌ Conectando...',ar:'◌ جاري...'},
  disc:{he:'ניתוק',en:'Disconnect',ru:'Отключить',es:'Desconectar',ar:'قطع'},
  chooseConn:{he:'בחר שיטת חיבור',en:'Choose connection method',ru:'Выберите способ',es:'Elige método',ar:'اختر طريقة'},
  bleT:{he:'Bluetooth BLE',en:'Bluetooth BLE',ru:'Bluetooth BLE',es:'Bluetooth BLE',ar:'بلوتوث'},
  bleD:{he:'מתאם ELM327 BLE',en:'ELM327 BLE adapter',ru:'Адаптер ELM327 BLE',es:'Adaptador ELM327 BLE',ar:'محول ELM327 BLE'},
  wifiT:{he:'WiFi',en:'WiFi',ru:'WiFi',es:'WiFi',ar:'واي فاي'},
  wifiD:{he:'מתאם ELM327 WiFi',en:'ELM327 WiFi adapter',ru:'Адаптер ELM327 WiFi',es:'Adaptador ELM327 WiFi',ar:'محول WiFi'},
  usbT:{he:'USB Serial',en:'USB Serial',ru:'USB Serial',es:'USB Serial',ar:'USB'},
  usbD:{he:'מתאם USB למחשב',en:'USB adapter for PC',ru:'USB адаптер для ПК',es:'Adaptador USB para PC',ar:'محول USB'},
  demoT:{he:'הדגמה',en:'Demo',ru:'Демо',es:'Demo',ar:'تجريبي'},
  demoD:{he:'סימולטור ללא חומרה',en:'Simulator, no hardware',ru:'Симулятор без оборудования',es:'Simulador sin hardware',ar:'محاكي بدون أجهزة'},
  btnConn:{he:'🔗 התחבר',en:'🔗 Connect',ru:'🔗 Подключить',es:'🔗 Conectar',ar:'🔗 اتصل'},
  btnWait:{he:'⏳ מתחבר...',en:'⏳ Connecting...',ru:'⏳ Подключение...',es:'⏳ Conectando...',ar:'⏳ جاري...'},
  log:{he:'📋 לוג',en:'📋 Log',ru:'📋 Журнал',es:'📋 Registro',ar:'📋 سجل'},
  start:{he:'▶ התחל',en:'▶ Start',ru:'▶ Старт',es:'▶ Iniciar',ar:'▶ ابدأ'},
  stop:{he:'⏹ עצור',en:'⏹ Stop',ru:'⏹ Стоп',es:'⏹ Parar',ar:'⏹ توقف'},
  qRead:{he:'📡 קריאה מהירה',en:'📡 Quick read',ru:'📡 Быстро',es:'📡 Lectura rápida',ar:'📡 قراءة سريعة'},
  readDtc:{he:'🔍 קרא תקלות',en:'🔍 Read faults',ru:'🔍 Читать ошибки',es:'🔍 Leer fallos',ar:'🔍 قراءة أعطال'},
  clearDtc:{he:'🧹 מחק תקלות',en:'🧹 Clear faults',ru:'🧹 Очистить',es:'🧹 Borrar',ar:'🧹 مسح'},
  milOn:{he:'נורית תקלה דולקת!',en:'Check engine ON!',ru:'Индикатор горит!',es:'Luz de fallo ON!',ar:'ضوء العطل مضاء!'},
  milOff:{he:'אין נורית תקלה',en:'No check engine',ru:'Нет индикатора',es:'Sin luz de fallo',ar:'لا يوجد ضوء'},
  confirmed:{he:'תקלות מאושרות',en:'Confirmed faults',ru:'Подтверждённые',es:'Confirmados',ar:'مؤكدة'},
  pending:{he:'תקלות ממתינות',en:'Pending faults',ru:'Ожидающие',es:'Pendientes',ar:'معلقة'},
  noDtc:{he:'אין תקלות!',en:'No faults!',ru:'Нет ошибок!',es:'Sin fallos!',ar:'لا أعطال!'},
  faults:{he:'תקלות',en:'Faults',ru:'Ошибки',es:'Fallos',ar:'أعطال'},
  readiness:{he:'✅ מוניטורים (טסט)',en:'✅ Readiness monitors',ru:'✅ Мониторы готовности',es:'✅ Monitores',ar:'✅ جاهزية'},
  readyDesc:{he:'מוכנות לטסט פליטה',en:'Emissions test readiness',ru:'Готовность к тесту',es:'Preparación',ar:'جاهزية الانبعاثات'},
  done:{he:'הושלם ✅',en:'Complete ✅',ru:'Готово ✅',es:'Completo ✅',ar:'مكتمل ✅'},
  notDone:{he:'לא הושלם ❌',en:'Incomplete ❌',ru:'Не готово ❌',es:'Incompleto ❌',ar:'غير مكتمل ❌'},
  freeze:{he:'📸 Freeze Frame',en:'📸 Freeze Frame',ru:'📸 Freeze Frame',es:'📸 Freeze Frame',ar:'📸 Freeze Frame'},
  freezeD:{he:'נתוני חיישנים ברגע התקלה',en:'Sensor data when fault occurred',ru:'Данные при возникновении ошибки',es:'Datos al momento del fallo',ar:'بيانات عند حدوث العطل'},
  scanAll:{he:'🔍 סרוק כל המחשבים',en:'🔍 Scan all ECUs',ru:'🔍 Сканировать все',es:'🔍 Escanear todo',ar:'🔍 مسح الكل'},
  fullRpt:{he:'📋 דוח מלא',en:'📋 Full report',ru:'📋 Полный отчёт',es:'📋 Informe completo',ar:'📋 تقرير كامل'},
  active:{he:'● פעיל',en:'● Active',ru:'● Активен',es:'● Activo',ar:'● نشط'},
  inactive:{he:'○ לא נמצא',en:'○ Not found',ru:'○ Не найден',es:'○ No encontrado',ar:'○ غير موجود'},
  kmComp:{he:'📊 השוואת ק"מ',en:'📊 Odometer comparison',ru:'📊 Сравнение пробега',es:'📊 Comparación km',ar:'📊 مقارنة المسافة'},
  kmOk:{he:'✅ תקין',en:'✅ Normal',ru:'✅ Норма',es:'✅ Normal',ar:'✅ طبيعي'},
  kmBad:{he:'⚠️ חשוד!',en:'⚠️ Suspicious!',ru:'⚠️ Подозрительно!',es:'⚠️ Sospechoso!',ar:'⚠️ مشبوه!'},
  kmBadD:{he:'ייתכן הורדת ק"מ או החלפת מחשב',en:'Possible odometer rollback or ECU swap',ru:'Возможен скрут пробега',es:'Posible manipulación',ar:'احتمال تلاعب'},
  readVeh:{he:'🚗 קרא מידע',en:'🚗 Read info',ru:'🚗 Читать',es:'🚗 Leer info',ar:'🚗 قراءة'},
  vehInfo:{he:'מידע רכב',en:'Vehicle info',ru:'Данные авто',es:'Info vehículo',ar:'معلومات المركبة'},
  supPids:{he:'PIDs נתמכים',en:'Supported PIDs',ru:'Поддерживаемые PID',es:'PIDs soportados',ar:'PIDs مدعومة'},
  cmdPlace:{he:'הזן פקודה...',en:'Enter command...',ru:'Введите команду...',es:'Ingrese comando...',ar:'أدخل الأمر...'},
  qCmds:{he:'⚡ פקודות מהירות',en:'⚡ Quick commands',ru:'⚡ Быстрые команды',es:'⚡ Comandos rápidos',ar:'⚡ أوامات سريعة'},
  about:{he:'אודות',en:'About',ru:'О программе',es:'Acerca de',ar:'حول'},
  aboutTxt:{he:'נוצר על ידי ברק אפללו במסגרת AppNest — קן האפליקציות',en:'Created by Barak Aflalo · AppNest',ru:'Создано Barak Aflalo · AppNest',es:'Creado por Barak Aflalo · AppNest',ar:'بارك أفلالو · AppNest'},
  copy:{he:'© 2026 כל הזכויות שמורות לברק אפללו',en:'© 2026 All rights reserved Barak Aflalo',ru:'© 2026 Все права защищены Barak Aflalo',es:'© 2026 Todos los derechos reservados',ar:'© 2026 جميع الحقوق محفوظة'},
  warn:{he:'⚠️ אפליקציה זו לשימוש פרטי בלבד',en:'⚠️ App for personal use only - no warranty',ru:'⚠️ Приложение для личного использования - без гарантии',es:'⚠️ Aplicación para uso personal - sin garantía',ar:'⚠️ التطبيق للاستخدام الشخصي فقط - بدون ضمان'},
  // New translations for advanced features
  kmHistory:{he:'📈 היסטורית ק"מ',en:'📈 KM History',ru:'📈 История пробега',es:'📈 Historial KM',ar:'📈 تاريخ الكيلومتر'},
  kmCompare:{he:'⚖️ השוואת ק"מ',en:'⚖️ Compare KM',ru:'⚖️ Сравнить пробег',es:'⚖️ Comparar KM',ar:'⚖️ مقارنة الكيلومتر'},
  rollbackDetected:{he:'🚨 זוהוי הורדת ק"מ',en:'🚨 Rollback Detected',ru:'🚨 Обнаружен скрут',es:'🚨 Manipulación detectada',ar:'🚨 اكتشاف التلاعب'},
  saveVehicle:{he:'💾 שמור רכב',en:'💾 Save Vehicle',ru:'💾 Сохранить авто',es:'💾 Guardar vehículo',ar:'💾 حفظ المركبة'},
  savedVehicles:{he:'🚗 רכבים שמורים',en:'🚗 Saved Vehicles',ru:'🚗 Сохраненные авто',es:'🚗 Vehículos guardados',ar:'🚗 المركبات المحفوظة'},
  exportPdf:{he:'📄 ייצוא PDF',en:'📄 Export PDF',ru:'📄 Экспорт PDF',es:'📄 Exportar PDF',ar:'📄 تصدير PDF'},
  shareWhatsApp:{he:'📱 שתף WhatsApp',en:'📱 Share WhatsApp',ru:'📱 Поделиться WhatsApp',es:'📱 Compartir WhatsApp',ar:'📱 مشاركة واتساب'},
  shareTelegram:{he:'✈️ שתף Telegram',en:'✈️ Share Telegram',ru:'✈️ Поделиться Telegram',es:'✈️ Compartir Telegram',ar:'✈️ مشاركة تيليجرام'},
  shareEmail:{he:'📧 שתף אימייל',en:'📧 Share Email',ru:'📧 Поделиться email',es:'📧 Compartir email',ar:'📧 مشاركة بريد إلكتروني'},
  smartAlerts:{he:'🔔 התראות חכמות',en:'🔔 Smart Alerts',ru:'🔔 Умные уведомления',es:'🔔 Alertas inteligentes',ar:'🔔 تنبيهات ذكية'},
  temperatureMonitor:{he:'🌡️ ניטור טמפרטורות',en:'🌡️ Temperature Monitor',ru:'🌡️ Монитор температуры',es:'🌡️ Monitor de temperatura',ar:'🌡️ مراقبة درجة الحرارة'},
  pressureMonitor:{he:'🔩 ניטור לחצים',en:'🔩 Pressure Monitor',ru:'🔩 Монитор давления',es:'🔩 Monitor de presión',ar:'🔩 مراقبة الضغط'},
  safetyCheck:{he:'🛡️ בדיקת בטיחות',en:'🛡️ Safety Check',ru:'🛡️ Проверка безопасности',es:'🛡️ Verificación de seguridad',ar:'🛡️ فحص السلامة'},
  simpleMode:{he:'🎯 מצב פשוט',en:'🎯 Simple Mode',ru:'🎯 Простой режим',es:'🎯 Modo simple',ar:'🎯 الوضع البسيط'},
  customTheme:{he:'🎨 ערכת מותאמת אישית',en:'🎨 Custom Theme',ru:'🎨 Кастомная тема',es:'🎨 Tema personalizado',ar:'🎨 سمة مخصصة'},
  favorites:{he:'⭐ מועדפים',en:'⭐ Favorites',ru:'⭐ Избранное',es:'⭐ Favoritos',ar:'⭐ المفضلة'},
  autoScan:{he:'🔄 סריקה אוטומטית',en:'🔄 Auto Scan',ru:'🔄 Автоскан',es:'🔄 Escaneo automático',ar:'🔄 مسح تلقائي'},
  scheduleScan:{he:'⏰ תזמן סריקה',en:'⏰ Schedule Scan',ru:'⏰ Планировать скан',es:'⏰ Programar escaneo',ar:'⏰ جدولة المسح'},
  advancedDTC:{he:'🔧 DTC מתקדם',en:'🔧 Advanced DTC',ru:'🔧 Расширенный DTC',es:'🔧 DTC avanzado',ar:'🔧 DTC متقدم'},
  liveCharts:{he:'📊 גרפים חיים',en:'📊 Live Charts',ru:'📊 Живые графики',es:'📊 Gráficos en vivo',ar:'📊 رسوم بيانية حية'},
  recallCheck:{he:'📋 בדיקת רקולים',en:'📋 Recall Check',ru:'📋 Проверка отзывов',es:'📋 Verificación de recalls',ar:'📋 فحص الاستدعاءات'},
  vehicleSpecs:{he:'📋 מפרט רכב',en:'📋 Vehicle Specs',ru:'📋 Характеристики авто',es:'📋 Especificaciones vehículo',ar:'📋 مواصفات المركبة'},
  reportTemplates:{he:'📝 תבניות דוח',en:'📝 Report Templates',ru:'📝 Шаблоны отчетов',es:'📝 Plantillas de informe',ar:'📝 قوالب التقارير'},
  notifications:{he:'🔔 התראות',en:'🔔 Notifications',ru:'🔔 Уведомления',es:'🔔 Notificaciones',ar:'🔔 إشعارات'},
  copyReport:{he:'📋 העתק דוח',en:'📋 Copy Report',ru:'📋 Копировать отчет',es:'📋 Copiar informe',ar:'📋 نسخ التقرير'},
  vinDecode:{he:'🔍 פענוח VIN',en:'🔍 Decode VIN',ru:'🔨 Расшифровка VIN',es:'🔨 Decodificar VIN',ar:'🔨 فك شفرة VIN'},
  odometerTrends:{he:'📈 מגמות ק"מ',en:'📈 Odometer Trends',ru:'📈 Тренды пробега',es:'📈 Tendencias odómetro',ar:'📈 اتجاهات العداد'},
  suspiciousActivity:{he:'⚠️ פעילות חשודות',en:'⚠️ Suspicious Activity',ru:'⚠️ Подозрительная активность',es:'⚠️ Actividad sospechosa',ar:'⚠️ نشاط مشبوه'},
  enginePerformance:{he:'⚙️ ביצוע מנוע',en:'⚙️ Engine Performance',ru:'⚙️ Производительность двигателя',es:'⚙️ Rendimiento motor',ar:'⚙️ أداء المحرك'},
  fuelEfficiency:{he:'⛽ יעילות דלק',en:'⛽ Fuel Efficiency',ru:'⛽ Расход топлива',es:'⛽ Eficiencia combustible',ar:'⛽ كفاءة الوقود'},
  batteryHealth:{he:'🔋 בריאות סוללה',en:'🔋 Battery Health',ru:'🔋 Здоровье батареи',es:'🔋 Salud batería',ar:'🔋 صحة البطارية'},
  maintenanceSchedule:{he:'🔧 לוח תחזוקה',en:'🔧 Maintenance Schedule',ru:'🔧 График обслуживания',es:'🔧 Calendario mantenimiento',ar:'🔧 جدول الصيانة'},
  help:{he:'❓ עזרה',en:'❓ Help',ru:'❓ Справка',es:'❓ Ayuda',ar:'❓ مساعدة'},
  settings:{he:'⚙️ הגדרות',en:'⚙️ Settings',ru:'⚙️ Настройки',es:'⚙️ Configuración',ar:'⚙️ الإعدادات'},
  darkMode:{he:'🌙 מצב כהה',en:'🌙 Dark Mode',ru:'🌙 Темный режим',es:'🌙 Modo oscuro',ar:'🌙 الوضع الداكن'},
  lightMode:{he:'☀️ מצב בהיר',en:'☀️ Light Mode',ru:'☀️ Светлый режим',es:'☀️ Modo claro',ar:'☀️ الوضع الفاتح'},
  language:{he:'🌐 שפה',en:'🌐 Language',ru:'🌐 Язык',es:'🌐 Idioma',ar:'🌐 اللغة'},
  french:{he:'🇫🇷 צרפתית',en:'🇫🇷 French',ru:'🇫🇷 Французский',es:'🇫🇷 Francés',ar:'🇫🇷 الفرنسية'},
  german:{he:'🇩🇪 גרמנית',en:'🇩🇪 German',ru:'🇩🇪 Немецкий',es:'🇩🇪 Alemán',ar:'🇩🇪 الألمانية'},
  italian:{he:'🇮🇹 איטלקית',en:'🇮🇹 Italian',ru:'🇮🇹 Итальянский',es:'🇮🇹 Italiano',ar:'🇮🇹 الإيطالية'},
  portuguese:{he:'🇵🇹 פורטוגזית',en:'🇵🇹 Portuguese',ru:'🇵🇹 Португальский',es:'🇵🇹 Portugués',ar:'🇵🇹 البرتغالية'},
  chinese:{he:'🇨🇳 סינית',en:'🇨🇳 Chinese',ru:'🇨🇳 Китайский',es:'🇨🇳 Chino',ar:'🇨� الصينية'},
  japanese:{he:'🇯🇵 יפנית',en:'🇯🇵 Japanese',ru:'🇯🇵 Японский',es:'🇯🇵 Japonés',ar:'🇯🇵 اليابانية'},
  korean:{he:'🇰🇷 קוריאנית',en:'🇰🇷 Korean',ru:'🇰🇷 Корейский',es:'🇰🇷 Coreano',ar:'🇰🇷 الكورية'},
  dutch:{he:'🇳🇱 הולנדית',en:'🇳🇱 Dutch',ru:'🇳🇱 Голландский',es:'🇳🇱 Holandés',ar:'🇳🇱 الهولندية'},
  polish:{he:'🇵🇱 פולנית',en:'🇵🇱 Polish',ru:'🇵🇱 Польский',es:'🇵🇱 Polaco',ar:'🇵🇱 البولندية'},
  turkish:{he:'🇹🇷 טורקית',en:'🇹🇷 Turkish',ru:'🇹🇷 Турецкий',es:'🇹🇷 Turco',ar:'🇹🷷 التركية'},
  hindi:{he:'🇮🇳 הינדית',en:'🇮🇳 Hindi',ru:'🇮🇳 Хинди',es:'🇮🇳 Hindi',ar:'🇮🇳 الهندية'},
  arabic:{he:'🇸🇦 ערבית',en:'🇸🇦 Arabic',ru:'🇸🇦 Арабский',es:'🇸🇦 Árabe',ar:'🇸🦦 العربية'},
  spanish:{he:'🇪🇸 ספרדית',en:'🇪🇸 Spanish',ru:'🇪🇸 Испанский',es:'🇪🇸 Español',ar:'🇪🇸 الإسبانية'},
  russian:{he:'🇷🇺 רוסית',en:'🇷🇺 Russian',ru:'🇷� Русский',es:'🇷🇺 Ruso',ar:'🇷� الروسية'},
  hebrew:{he:'🇮🇱 עברית',en:'🇮🇱 Hebrew',ru:'🇮🇱 Иврит',es:'🇮🇱 Hebreo',ar:'🇮🇱 العبرية'},
  english:{he:'🇬🇧 אנגלית',en:'🇬🇧 English',ru:'🇬🇧 Английский',es:'🇬🇧 Inglés',ar:'🇬🇧 الإنجليزية'}
};
  connect: {
    he: '🔗 חיבור',
    en: '🔗 Connect',
    ru: '🔗 Связь',
    es: '🔗 Conexión',
    ar: '🔗 اتصال'
  },
  dash: {
    he: '📊 דשבורד',
    en: '📊 Dashboard',
    ru: '📊 Панель',
    es: '📊 Panel',
    ar: '📊 لوحة'
  },
  dtc: {
    he: '❌ תקלות',
    en: '❌ Faults',
    ru: '❌ Ошибки',
    es: '❌ Fallos',
    ar: '❌ أعطال'
  },
  scan: {
    he: '🔍 סריקה',
    en: '🔍 ECU Scan',
    ru: '🔍 Скан',
    es: '🔍 Escaneo',
    ar: '🔍 مسح'
  },
  vehicle: {
    he: '🚗 רכב',
    en: '🚗 Vehicle',
    ru: '🚗 Авто',
    es: '🚗 Vehículo',
    ar: '🚗 مركبة'
  },
  term: {
    he: '💻 טרמינל',
    en: '💻 Terminal',
    ru: '💻 Терминал',
    es: '💻 Terminal',
    ar: '💻 طرفية'
  },
  guide: {
    he: '📖 מדריך',
    en: '📖 Guide',
    ru: '📖 Гид',
    es: '📖 Guía',
    ar: '📖 دليل'
  },
  tools: {
    he: '🔧 כלים',
    en: '🔧 Tools',
    ru: '🔧 Инструменты',
    es: '🔧 Herramientas',
    ar: '🔧 أدوات'
  },
  rec: {
    he: '⏺ הקלטה',
    en: '⏺ Record',
    ru: '⏺ Запись',
    es: '⏺ Grabar',
    ar: '⏺ تسجيل'
  },
  stopRec: {
    he: '⏹ עצור הקלטה',
    en: '⏹ Stop recording',
    ru: '⏹ Стоп запись',
    es: '⏹ Parar',
    ar: '⏹ توقف'
  },
  exportCsv: {
    he: '📥 ייצוא CSV',
    en: '📥 Export CSV',
    ru: '📥 Экспорт CSV',
    es: '📥 Exportar CSV',
    ar: '📥 تصدير CSV'
  },
  history: {
    he: '📋 היסטוריה',
    en: '📋 History',
    ru: '📋 История',
    es: '📋 Historial',
    ar: '📋 سجل'
  },
  fuelCons: {
    he: 'צריכת דלק',
    en: 'Fuel consumption',
    ru: 'Расход топлива',
    es: 'Consumo',
    ar: 'استهلاك الوقود'
  },
  ohmCalc: {
    he: 'מחשבון אוהם',
    en: 'Ohm calculator',
    ru: 'Калькулятор Ома',
    es: 'Calculadora Ohm',
    ar: 'حاسبة أوم'
  },
  sensorRef: {
    he: 'ערכי חיישנים תקינים',
    en: 'Sensor reference values',
    ru: 'Справочные значения датчиков',
    es: 'Valores de referencia',
    ar: 'القيم المرجعية'
  },
  pinout: {
    he: 'פינאוט OBD-II',
    en: 'OBD-II Pinout',
    ru: 'Распиновка OBD-II',
    es: 'Pinout OBD-II',
    ar: 'OBD-II Pinout'
  },
  on: {
    he: '● מחובר',
    en: '● Connected',
    ru: '● Подключен',
    es: '● Conectado',
    ar: '● متصل'
  },
  off: {
    he: '○ מנותק',
    en: '○ Disconnected',
    ru: '○ Отключён',
    es: '○ Desconectado',
    ar: '○ غير متصل'
  },
  ing: {
    he: '◌ מתחבר...',
    en: '◌ Connecting...',
    ru: '◌ Подключение...',
    es: '◌ Conectando...',
    ar: '◌ جاري...'
  },
  disc: {
    he: 'ניתוק',
    en: 'Disconnect',
    ru: 'Отключить',
    es: 'Desconectar',
    ar: 'قطع'
  },
  chooseConn: {
    he: 'בחר שיטת חיבור',
    en: 'Choose connection method',
    ru: 'Выберите способ',
    es: 'Elige método',
    ar: 'اختر طريقة'
  },
  bleT: {
    he: 'Bluetooth BLE',
    en: 'Bluetooth BLE',
    ru: 'Bluetooth BLE',
    es: 'Bluetooth BLE',
    ar: 'بلوتوث'
  },
  bleD: {
    he: 'מתאם ELM327 BLE',
    en: 'ELM327 BLE adapter',
    ru: 'Адаптер ELM327 BLE',
    es: 'Adaptador ELM327 BLE',
    ar: 'محول ELM327 BLE'
  },
  wifiT: {
    he: 'WiFi',
    en: 'WiFi',
    ru: 'WiFi',
    es: 'WiFi',
    ar: 'واي فاي'
  },
  wifiD: {
    he: 'מתאם ELM327 WiFi',
    en: 'ELM327 WiFi adapter',
    ru: 'Адаптер ELM327 WiFi',
    es: 'Adaptador ELM327 WiFi',
    ar: 'محول WiFi'
  },
  usbT: {
    he: 'USB Serial',
    en: 'USB Serial',
    ru: 'USB Serial',
    es: 'USB Serial',
    ar: 'USB'
  },
  usbD: {
    he: 'מתאם USB למחשב',
    en: 'USB adapter for PC',
    ru: 'USB адаптер для ПК',
    es: 'Adaptador USB para PC',
    ar: 'محول USB'
  },
  demoT: {
    he: 'הדגמה',
    en: 'Demo',
    ru: 'Демо',
    es: 'Demo',
    ar: 'تجريبي'
  },
  demoD: {
    he: 'סימולטור ללא חומרה',
    en: 'Simulator, no hardware',
    ru: 'Симулятор без оборудования',
    es: 'Simulador sin hardware',
    ar: 'محاكي بدون أجهزة'
  },
  btnConn: {
    he: '🔗 התחבר',
    en: '🔗 Connect',
    ru: '🔗 Подключить',
    es: '🔗 Conectar',
    ar: '🔗 اتصل'
  },
  btnWait: {
    he: '⏳ מתחבר...',
    en: '⏳ Connecting...',
    ru: '⏳ Подключение...',
    es: '⏳ Conectando...',
    ar: '⏳ جاري...'
  },
  log: {
    he: '📋 לוג',
    en: '📋 Log',
    ru: '📋 Журнал',
    es: '📋 Registro',
    ar: '📋 سجل'
  },
  start: {
    he: '▶ התחל',
    en: '▶ Start',
    ru: '▶ Старт',
    es: '▶ Iniciar',
    ar: '▶ ابدأ'
  },
  stop: {
    he: '⏹ עצור',
    en: '⏹ Stop',
    ru: '⏹ Стоп',
    es: '⏹ Parar',
    ar: '⏹ توقف'
  },
  qRead: {
    he: '📡 קריאה מהירה',
    en: '📡 Quick read',
    ru: '📡 Быстро',
    es: '📡 Lectura rápida',
    ar: '📡 قراءة سريعة'
  },
  readDtc: {
    he: '🔍 קרא תקלות',
    en: '🔍 Read faults',
    ru: '🔍 Читать ошибки',
    es: '🔍 Leer fallos',
    ar: '🔍 قراءة أعطال'
  },
  clearDtc: {
    he: '🧹 מחק תקלות',
    en: '🧹 Clear faults',
    ru: '🧹 Очистить',
    es: '🧹 Borrar',
    ar: '🧹 مسح'
  },
  milOn: {
    he: 'נורית תקלה דולקת!',
    en: 'Check engine ON!',
    ru: 'Индикатор горит!',
    es: 'Luz de fallo ON!',
    ar: 'ضوء العطل مضاء!'
  },
  milOff: {
    he: 'אין נורית תקלה',
    en: 'No check engine',
    ru: 'Нет индикатора',
    es: 'Sin luz de fallo',
    ar: 'لا يوجد ضوء'
  },
  confirmed: {
    he: 'תקלות מאושרות',
    en: 'Confirmed faults',
    ru: 'Подтверждённые',
    es: 'Confirmados',
    ar: 'مؤكدة'
  },
  pending: {
    he: 'תקלות ממתינות',
    en: 'Pending faults',
    ru: 'Ожидающие',
    es: 'Pendientes',
    ar: 'معلقة'
  },
  noDtc: {
    he: 'אין תקלות!',
    en: 'No faults!',
    ru: 'Нет ошибок!',
    es: 'Sin fallos!',
    ar: 'لا أعطال!'
  },
  faults: {
    he: 'תקלות',
    en: 'Faults',
    ru: 'Ошибки',
    es: 'Fallos',
    ar: 'أعطال'
  },
  readiness: {
    he: '✅ מוניטורים (טסט)',
    en: '✅ Readiness monitors',
    ru: '✅ Мониторы готовности',
    es: '✅ Monitores',
    ar: '✅ جاهزية'
  },
  readyDesc: {
    he: 'מוכנות לטסט פליטה',
    en: 'Emissions test readiness',
    ru: 'Готовность к тесту',
    es: 'Preparación',
    ar: 'جاهزية الانبعاثات'
  },
  done: {
    he: 'הושלם ✅',
    en: 'Complete ✅',
    ru: 'Готово ✅',
    es: 'Completo ✅',
    ar: 'مكتمل ✅'
  },
  notDone: {
    he: 'לא הושלם ❌',
    en: 'Incomplete ❌',
    ru: 'Не готово ❌',
    es: 'Incompleto ❌',
    ar: 'غير مكتمل ❌'
  },
  freeze: {
    he: '📸 Freeze Frame',
    en: '📸 Freeze Frame',
    ru: '📸 Freeze Frame',
    es: '📸 Freeze Frame',
    ar: '📸 Freeze Frame'
  },
  freezeD: {
    he: 'נתוני חיישנים ברגע התקלה',
    en: 'Sensor data when fault occurred',
    ru: 'Данные при возникновении ошибки',
    es: 'Datos al momento del fallo',
    ar: 'بيانات عند حدوث العطل'
  },
  scanAll: {
    he: '🔍 סרוק כל המחשבים',
    en: '🔍 Scan all ECUs',
    ru: '🔍 Сканировать все',
    es: '🔍 Escanear todo',
    ar: '🔍 مسح الكل'
  },
  fullRpt: {
    he: '📋 דוח מלא',
    en: '📋 Full report',
    ru: '📋 Полный отчёт',
    es: '📋 Informe completo',
    ar: '📋 تقرير كامل'
  },
  active: {
    he: '● פעיל',
    en: '● Active',
    ru: '● Активен',
    es: '● Activo',
    ar: '● نشط'
  },
  inactive: {
    he: '○ לא נמצא',
    en: '○ Not found',
    ru: '○ Не найден',
    es: '○ No encontrado',
    ar: '○ غير موجود'
  },
  kmComp: {
    he: '📊 השוואת ק"מ',
    en: '📊 Odometer comparison',
    ru: '📊 Сравнение пробега',
    es: '📊 Comparación km',
    ar: '📊 مقارنة المسافة'
  },
  kmOk: {
    he: '✅ תקין',
    en: '✅ Normal',
    ru: '✅ Норма',
    es: '✅ Normal',
    ar: '✅ طبيعي'
  },
  kmBad: {
    he: '⚠️ חשוד!',
    en: '⚠️ Suspicious!',
    ru: '⚠️ Подозрительно!',
    es: '⚠️ Sospechoso!',
    ar: '⚠️ مشبوه!'
  },
  kmBadD: {
    he: 'ייתכן הורדת ק"מ או החלפת מחשב',
    en: 'Possible odometer rollback or ECU swap',
    ru: 'Возможен скрут пробега',
    es: 'Posible manipulación',
    ar: 'احتمال تلاعب'
  },
  readVeh: {
    he: '🚗 קרא מידע',
    en: '🚗 Read info',
    ru: '🚗 Читать',
    es: '🚗 Leer info',
    ar: '🚗 قراءة'
  },
  vehInfo: {
    he: 'מידע רכב',
    en: 'Vehicle info',
    ru: 'Данные авто',
    es: 'Info vehículo',
    ar: 'معلومات المركبة'
  },
  supPids: {
    he: 'PIDs נתמכים',
    en: 'Supported PIDs',
    ru: 'Поддерживаемые PID',
    es: 'PIDs soportados',
    ar: 'PIDs مدعومة'
  },
  cmdPlace: {
    he: 'הזן פקודה...',
    en: 'Enter command...',
    ru: 'Введите команду...',
    es: 'Ingrese comando...',
    ar: 'أدخل الأمر...'
  },
  qCmds: {
    he: '⚡ פקודות מהירות',
    en: '⚡ Quick commands',
    ru: '⚡ Быстрые команды',
    es: '⚡ Comandos rápidos',
    ar: '⚡ أوامر سريعة'
  },
  about: {
    he: 'אודות',
    en: 'About',
    ru: 'О программе',
    es: 'Acerca de',
    ar: 'حول'
  },
  aboutTxt: {
    he: 'נוצר על ידי ברק אפללו במסגרת AppNest — קן האפליקציות',
    en: 'Created by Barak Aflalo · AppNest',
    ru: 'Создано Barak Aflalo · AppNest',
    es: 'Creado por Barak Aflalo · AppNest',
    ar: 'بارك أفلالو · AppNest'
  },
  copy: {
    he: '© 2026 כל הזכויות שמורות לברק אפללו',
    en: '© 2026 All rights reserved Barak Aflalo',
    ru: '© 2026 Все права защищены Barak Aflalo',
    es: '© 2026 Todos los derechos reservados',
    ar: '© 2026 جميع الحقوق محفوظة'
  },
  moreApps: {
    he: '🪺 AppNest — עוד אפליקציות',
    en: '🪺 AppNest — More apps',
    ru: '🪺 AppNest — Ещё приложения',
    es: '🪺 AppNest — Más apps',
    ar: '🪺 AppNest — المزيد'
  },
  warn: {
    he: '⚠️ המידע כללי בלבד. השימוש על אחריות המשתמש.',
    en: '⚠️ General info only. Use at your own risk.',
    ru: '⚠️ Только общая информация. Используйте на свой риск.',
    es: '⚠️ Info general. Bajo su responsabilidad.',
    ar: '⚠️ معلومات عامة فقط. الاستخدام على مسؤوليتك.'
  },
  monNames: {
    he: ['פספוסים', 'דלק', 'רכיבים', 'קטליזטור', 'O2', 'חימום O2', 'EVAP', 'EGR', 'מיזוג'],
    en: ['Misfire', 'Fuel', 'Components', 'Catalyst', 'O2', 'O2 Heater', 'EVAP', 'EGR', 'A/C'],
    ru: ['Пропуски', 'Топливо', 'Компоненты', 'Катализатор', 'O2', 'Нагрев O2', 'EVAP', 'EGR', 'Кондиционер'],
    es: ['Fallo enc.', 'Combustible', 'Componentes', 'Catalizador', 'O2', 'Calent. O2', 'EVAP', 'EGR', 'A/C'],
    ar: ['خلل', 'وقود', 'مكونات', 'محفز', 'O2', 'سخان O2', 'EVAP', 'EGR', 'تكييف']
  }
};

// ═══════════════════════════════════════════
// PID DATABASE
// ═══════════════════════════════════════════
const PIDS = {
  '04': {
    n: 'Engine Load',
    h: 'עומס מנוע',
    u: '%',
    b: 1,
    f: a => (a * 100 / 255).toFixed(1),
    mx: 100
  },
  '05': {
    n: 'Coolant Temp',
    h: 'טמפ\' מנוע',
    u: '°C',
    b: 1,
    f: a => a - 40,
    mx: 130,
    w: 105
  },
  '0B': {
    n: 'MAP',
    h: 'לחץ מניפולד',
    u: 'kPa',
    b: 1,
    f: a => a,
    mx: 255
  },
  '0C': {
    n: 'RPM',
    h: 'סל"ד',
    u: 'RPM',
    b: 2,
    f: (a, b) => Math.round((a * 256 + b) / 4),
    mx: 8000,
    w: 6500
  },
  '0D': {
    n: 'Speed',
    h: 'מהירות',
    u: 'km/h',
    b: 1,
    f: a => a,
    mx: 260
  },
  '0E': {
    n: 'Timing',
    h: 'הצתה',
    u: '°',
    b: 1,
    f: a => (a / 2 - 64).toFixed(1),
    mx: 64
  },
  '0F': {
    n: 'Intake Air',
    h: 'טמפ\' אוויר',
    u: '°C',
    b: 1,
    f: a => a - 40,
    mx: 80
  },
  '10': {
    n: 'MAF',
    h: 'MAF',
    u: 'g/s',
    b: 2,
    f: (a, b) => ((a * 256 + b) / 100).toFixed(1),
    mx: 655
  },
  '11': {
    n: 'Throttle',
    h: 'מצערת',
    u: '%',
    b: 1,
    f: a => (a * 100 / 255).toFixed(1),
    mx: 100
  },
  '06': {
    n: 'STFT B1',
    h: 'STFT B1',
    u: '%',
    b: 1,
    f: a => ((a - 128) * 100 / 128).toFixed(1),
    mx: 50
  },
  '07': {
    n: 'LTFT B1',
    h: 'LTFT B1',
    u: '%',
    b: 1,
    f: a => ((a - 128) * 100 / 128).toFixed(1),
    mx: 50
  },
  '2F': {
    n: 'Fuel Level',
    h: 'מפלס דלק',
    u: '%',
    b: 1,
    f: a => (a * 100 / 255).toFixed(1),
    mx: 100
  },
  '42': {
    n: 'ECU Voltage',
    h: 'מתח ECU',
    u: 'V',
    b: 2,
    f: (a, b) => ((a * 256 + b) / 1000).toFixed(2),
    mx: 16,
    w: 11.5
  },
  '46': {
    n: 'Ambient',
    h: 'טמפ\' סביבה',
    u: '°C',
    b: 1,
    f: a => a - 40,
    mx: 60
  },
  '5C': {
    n: 'Oil Temp',
    h: 'טמפ\' שמן',
    u: '°C',
    b: 1,
    f: a => a - 40,
    mx: 200,
    w: 120
  },
  '1F': {
    n: 'Runtime',
    h: 'זמן ריצה',
    u: 's',
    b: 2,
    f: (a, b) => a * 256 + b,
    mx: 65535
  }
};
const PRESETS = {
  basic: {
    n: '📊 Basic',
    p: ['0C', '0D', '05', '11'],
    ms: 500
  },
  fuel: {
    n: '⛽ Fuel',
    p: ['0C', '0D', '06', '07', '2F'],
    ms: 600
  },
  temps: {
    n: '🌡️ Temps',
    p: ['05', '0F', '46', '5C'],
    ms: 800
  },
  detail: {
    n: '📈 Detail',
    p: ['0C', '0D', '05', '04', '11', '42', '0F'],
    ms: 700
  }
};

// ═══════════════════════════════════════════
// DTC DATABASE + PARSER
// ═══════════════════════════════════════════
const DTCDB = {
  'P0010': 'Cam VVT A circuit',
  'P0011': 'Cam VVT A over-advanced',
  'P0012': 'Cam VVT A retarded',
  'P0013': 'Cam VVT B circuit',
  'P0016': 'Crank/Cam correlation',
  'P0017': 'Crank/Cam B correlation',
  'P0100': 'MAF circuit',
  'P0101': 'MAF range',
  'P0102': 'MAF low',
  'P0103': 'MAF high',
  'P0106': 'MAP range',
  'P0107': 'MAP low',
  'P0108': 'MAP high',
  'P0110': 'IAT circuit',
  'P0112': 'IAT low',
  'P0113': 'IAT high',
  'P0115': 'Coolant temp circuit',
  'P0116': 'Coolant range',
  'P0117': 'Coolant low',
  'P0118': 'Coolant high',
  'P0120': 'TPS circuit',
  'P0121': 'TPS range',
  'P0122': 'TPS low',
  'P0123': 'TPS high',
  'P0125': 'Insufficient coolant temp',
  'P0128': 'Thermostat below temp',
  'P0130': 'O2 B1S1',
  'P0131': 'O2 B1S1 low',
  'P0132': 'O2 B1S1 high',
  'P0133': 'O2 B1S1 slow',
  'P0134': 'O2 B1S1 no activity',
  'P0135': 'O2 heater B1S1',
  'P0136': 'O2 B1S2',
  'P0137': 'O2 B1S2 low',
  'P0138': 'O2 B1S2 high',
  'P0139': 'O2 B1S2 slow',
  'P0140': 'O2 B1S2 no activity',
  'P0141': 'O2 heater B1S2',
  'P0150': 'O2 B2S1',
  'P0155': 'O2 heater B2S1',
  'P0160': 'O2 B2S2',
  'P0171': 'System lean B1',
  'P0172': 'System rich B1',
  'P0174': 'System lean B2',
  'P0175': 'System rich B2',
  'P0176': 'Fuel composition',
  'P0190': 'Fuel rail pressure',
  'P0191': 'Fuel rail range',
  'P0192': 'Fuel rail low',
  'P0193': 'Fuel rail high',
  'P0200': 'Injector circuit',
  'P0201': 'Injector 1',
  'P0202': 'Injector 2',
  'P0203': 'Injector 3',
  'P0204': 'Injector 4',
  'P0205': 'Injector 5',
  'P0206': 'Injector 6',
  'P0217': 'Engine overtemp',
  'P0218': 'Trans overtemp',
  'P0219': 'Engine overspeed',
  'P0220': 'TPS B circuit',
  'P0230': 'Fuel pump relay',
  'P0261': 'Injector 1 low',
  'P0262': 'Injector 1 high',
  'P0300': 'Random misfire',
  'P0301': 'Cyl 1 misfire',
  'P0302': 'Cyl 2 misfire',
  'P0303': 'Cyl 3 misfire',
  'P0304': 'Cyl 4 misfire',
  'P0305': 'Cyl 5 misfire',
  'P0306': 'Cyl 6 misfire',
  'P0307': 'Cyl 7 misfire',
  'P0308': 'Cyl 8 misfire',
  'P0325': 'Knock sensor 1',
  'P0326': 'Knock sensor 1 range',
  'P0327': 'Knock sensor 1 low',
  'P0328': 'Knock sensor 1 high',
  'P0330': 'Knock sensor 2',
  'P0335': 'Crank position sensor',
  'P0336': 'Crank sensor range',
  'P0340': 'Cam position sensor A',
  'P0341': 'Cam sensor A range',
  'P0345': 'Cam position sensor B',
  'P0351': 'Ignition coil A',
  'P0352': 'Ignition coil B',
  'P0353': 'Ignition coil C',
  'P0354': 'Ignition coil D',
  'P0400': 'EGR flow',
  'P0401': 'EGR insufficient',
  'P0402': 'EGR excessive',
  'P0403': 'EGR circuit',
  'P0411': 'Secondary air wrong flow',
  'P0420': 'Catalyst efficiency B1',
  'P0421': 'Catalyst warmup B1',
  'P0430': 'Catalyst efficiency B2',
  'P0440': 'EVAP system',
  'P0441': 'EVAP purge flow',
  'P0442': 'EVAP small leak',
  'P0443': 'EVAP purge valve',
  'P0446': 'EVAP vent control',
  'P0449': 'EVAP vent valve',
  'P0455': 'EVAP large leak',
  'P0456': 'EVAP very small leak',
  'P0461': 'Fuel level range',
  'P0480': 'Fan 1 circuit',
  'P0481': 'Fan 2 circuit',
  'P0500': 'Vehicle speed sensor',
  'P0501': 'Speed sensor range',
  'P0505': 'Idle control',
  'P0506': 'Idle speed low',
  'P0507': 'Idle speed high',
  'P0510': 'Throttle position switch',
  'P0520': 'Oil pressure sensor',
  'P0521': 'Oil pressure range',
  'P0522': 'Oil pressure low',
  'P0523': 'Oil pressure high',
  'P0562': 'System voltage low',
  'P0563': 'System voltage high',
  'P0600': 'Serial comm link',
  'P0601': 'ECM memory checksum',
  'P0602': 'ECM programming error',
  'P0606': 'ECM processor',
  'P0627': 'Fuel pump control',
  'P0700': 'TCM malfunction',
  'P0705': 'Trans range sensor',
  'P0710': 'Trans fluid temp',
  'P0715': 'Turbine speed sensor',
  'P0720': 'Output speed sensor',
  'P0725': 'Engine speed input',
  'P0730': 'Incorrect gear ratio',
  'P0731': 'Gear 1 incorrect',
  'P0732': 'Gear 2 incorrect',
  'P0733': 'Gear 3 incorrect',
  'P0734': 'Gear 4 incorrect',
  'P0740': 'TCC circuit',
  'P0741': 'TCC stuck off',
  'P0743': 'TCC electrical',
  'P0750': 'Shift solenoid A',
  'P0755': 'Shift solenoid B',
  'P0760': 'Shift solenoid C',
  'P1326': 'KSDS (Kia/Hyundai)',
  'P2002': 'DPF efficiency',
  'P2100': 'Throttle actuator',
  'P2101': 'Throttle actuator range',
  'P2106': 'Throttle forced limited',
  'P2110': 'Throttle forced idle',
  'P2135': 'TPS correlation',
  'P2187': 'Lean at idle B1',
  'P2195': 'O2 stuck lean B1S1',
  'P2196': 'O2 stuck rich B1S1',
  'P2270': 'O2 stuck lean B2S1',
  'P2279': 'Intake air leak',
  'P2610': 'ECM timer off',
  'C0035': 'LF wheel speed sensor',
  'C0040': 'RF wheel speed sensor',
  'C0045': 'LR wheel speed sensor',
  'C0050': 'RR wheel speed sensor',
  'C0265': 'EBCM relay',
  'C0550': 'ECU performance',
  'C1201': 'Engine control malfunction',
  'C1241': 'Low battery positive',
  'B0100': 'ECM communication',
  'B1000': 'ECU malfunction',
  'B1325': 'Key not programmed',
  'B1352': 'Ignition key-on short',
  'B1601': 'PATS invalid format',
  'U0001': 'High speed CAN',
  'U0073': 'Control module comm',
  'U0100': 'Lost comm ECM',
  'U0101': 'Lost comm TCM',
  'U0121': 'Lost comm ABS',
  'U0126': 'Lost comm steering',
  'U0140': 'Lost comm BCM',
  'U0155': 'Lost comm instrument',
  'U0164': 'Lost comm HVAC',
  'U0184': 'Lost comm radio',
  'U0401': 'Invalid data from ECM',
  'U0426': 'Invalid data from immobilizer'
};
const DTYPES = {
  P: 'Powertrain',
  C: 'Chassis',
  B: 'Body',
  U: 'Network'
};
function parseDTC(h) {
  if (!h || h.length < 4) return null;
  const b0 = parseInt(h.substring(0, 2), 16),
    b1 = parseInt(h.substring(2, 4), 16);
  if (isNaN(b0) || isNaN(b1)) return null;
  const tp = ['P', 'P', 'P', 'P', 'C', 'C', 'C', 'C', 'B', 'B', 'B', 'B', 'U', 'U', 'U', 'U'];
  const pr = tp[b0 >> 4] || 'P';
  const code = pr + ((b0 & 0x3F) >> 4).toString() + (b0 & 0x0F).toString(16).toUpperCase() + b1.toString(16).toUpperCase().padStart(2, '0');
  return {
    code,
    desc: DTCDB[code] || 'Unknown',
    type: DTYPES[pr] || ''
  };
}

// ═══════════════════════════════════════════
// ECU ADDRESSES - Extended list for better coverage
// ═══════════════════════════════════════════
const ECUS = [{
  a: '7E0',
  r: '7E8',
  n: 'ECM — Engine',
  h: 'מחשב מנוע',
  ic: '⚙️'
}, {
  a: '7E1',
  r: '7E9',
  n: 'TCM — Transmission',
  h: 'תיבת הילוכים',
  ic: '🔄'
}, {
  a: '7E2',
  r: '7EA',
  n: 'HV — Hybrid/EV',
  h: 'היברידי',
  ic: '🔋'
}, {
  a: '720',
  r: '728',
  n: 'BCM — Body',
  h: 'מרכב',
  ic: '🚪'
}, {
  a: '730',
  r: '738',
  n: 'SRS — Airbags',
  h: 'כריות אוויר',
  ic: '🛡️'
}, {
  a: '740',
  r: '748',
  n: 'IC — Instrument',
  h: 'מחוונים',
  ic: '📊'
}, {
  a: '750',
  r: '758',
  n: 'ABS — Brakes',
  h: 'בלמים',
  ic: '🛞'
}, {
  a: '760',
  r: '768',
  n: 'EPS — Steering',
  h: 'הגה כוח',
  ic: '🎡'
}, {
  a: '770',
  r: '778',
  n: 'HVAC — Climate',
  h: 'מיזוג',
  ic: '❄️'
}, {
  a: '780',
  r: '788',
  n: 'TPMS — Tires',
  h: 'לחץ צמיגים',
  ic: '🔵'
}, {
  a: '790',
  r: '798',
  n: 'GW — Gateway',
  h: 'שער תקשורת',
  ic: '🌐'
}, {
  a: '7A0',
  r: '7A8',
  n: 'PDC — Parking',
  h: 'חנייה',
  ic: '🅿️'
}, {
  a: '7B0',
  r: '7B8',
  n: 'KEY — Smart Key',
  h: 'מפתח חכם',
  ic: '🔑'
}, {
  a: '7C4',
  r: '7CC',
  n: 'HU — Head Unit',
  h: 'מולטימדיה',
  ic: '🎵'
}, {
  a: '7D0',
  r: '7D8',
  n: 'EPB — Park Brake',
  h: 'בלם חנייה',
  ic: '🅿️'
}, {
  a: '7E5',
  r: '7ED',
  n: 'ADAS',
  h: 'נהיגה חכמה',
  ic: '🚗'
}, {
  a: '700',
  r: '708',
  n: 'ECM2 — Engine 2',
  h: 'מחשב מנוע 2',
  ic: '⚙️'
}, {
  a: '710',
  r: '718',
  n: 'TCM2 — Transmission 2',
  h: 'תיבת הילוכים 2',
  ic: '🔄'
}, {
  a: '7C0',
  r: '7C8',
  n: 'IMMO — Immobilizer',
  h: 'נעילת מנוע',
  ic: '🔒'
}, {
  a: '7D5',
  r: '7DD',
  n: '4WD — Four Wheel Drive',
  h: 'הנעה כפולה',
  ic: '🚙'
}, {
  a: '7E3',
  r: '7EB',
  n: 'Hybrid Control',
  h: 'בקר היברידי',
  ic: '🔋'
}, {
  a: '7E4',
  r: '7EC',
  n: 'Battery Management',
  h: 'ניהול סוללה',
  ic: '🔋'
}, {
  a: '7E6',
  r: '7EE',
  n: 'Brake System',
  h: 'מערכת בלמים',
  ic: '🛞'
}, {
  a: '7E7',
  r: '7EF',
  n: 'Steering Angle',
  h: 'זוית הגה',
  ic: '🎡'
}, {
  a: '7E8',
  r: '7F0',
  n: 'Chassis Control',
  h: 'בקר שלדה',
  ic: '🚗'
}, {
  a: '7F0',
  r: '7F8',
  n: 'Center Gateway',
  h: 'שער מרכזי',
  ic: '🌐'
}, {
  a: '711',
  r: '719',
  n: 'Transmission Alt',
  h: 'תיבת הילוכים אלט',
  ic: '🔄'
}, {
  a: '721',
  r: '729',
  n: 'Body Alt',
  h: 'גוף אלט',
  ic: '🚪'
}, {
  a: '731',
  r: '739',
  n: 'SRS Alt',
  h: 'כריות אוויר אלט',
  ic: '🛡️'
}, {
  a: '741',
  r: '749',
  n: 'Instrument Alt',
  h: 'מחוונים אלט',
  ic: '📊'
}, {
  a: '751',
  r: '759',
  n: 'ABS Alt',
  h: 'בלמים אלט',
  ic: '🛞'
}, {
  a: '761',
  r: '769',
  n: 'EPS Alt',
  h: 'הגה כוח אלט',
  ic: '🎡'
}, {
  a: '771',
  r: '779',
  n: 'HVAC Alt',
  h: 'מיזוג אלט',
  ic: '❄️'
}, {
  a: '781',
  r: '789',
  n: 'TPMS Alt',
  h: 'לחץ צמיגים אלט',
  ic: '🔵'
}, {
  a: '791',
  r: '799',
  n: 'Gateway Alt',
  h: 'שער תקשורת אלט',
  ic: '🌐'
}, {
  a: '7A1',
  r: '7A9',
  n: 'Parking Alt',
  h: 'חנייה אלט',
  ic: '🅿️'
}, {
  a: '7B1',
  r: '7B9',
  n: 'Key Alt',
  h: 'מפתח חכם אלט',
  ic: '🔑'
}, {
  a: '7C5',
  r: '7CD',
  n: 'Head Unit Alt',
  h: 'מולטימדיה אלט',
  ic: '🎵'
}, {
  a: '7D1',
  r: '7D9',
  n: 'Park Brake Alt',
  h: 'בלם חנייה אלט',
  ic: '🅿️'
}, {
  a: '7E9',
  r: '7F1',
  n: 'ADAS Alt',
  h: 'נהיגה חכמה אלט',
  ic: '🚗'
}, {
  a: '701',
  r: '709',
  n: 'Engine 2 Alt',
  h: 'מחשב מנוע 2 אלט',
  ic: '⚙️'
}, {
  a: '712',
  r: '71A',
  n: 'Transmission 2 Alt',
  h: 'תיבת הילוכים 2 אלט',
  ic: '🔄'
}, {
  a: '7C1',
  r: '7C9',
  n: 'Immobilizer Alt',
  h: 'נעילת מנוע אלט',
  ic: '🔒'
}, {
  a: '7D6',
  r: '7DE',
  n: '4WD Alt',
  h: 'הנעה כפולה אלט',
  ic: '🚙'
}, {
  a: '7E3',
  r: '7EB',
  n: 'Hybrid Control Alt',
  h: 'בקר היברידי אלט',
  ic: '🔋'
}, {
  a: '7E4',
  r: '7EC',
  n: 'Battery Management Alt',
  h: 'ניהול סוללה אלט',
  ic: '🔋'
}, {
  a: '7E6',
  r: '7EE',
  n: 'Brake System Alt',
  h: 'מערכת בלמים אלט',
  ic: '🛞'
}, {
  a: '7E7',
  r: '7EF',
  n: 'Steering Angle Alt',
  h: 'זוית הגה אלט',
  ic: '🎡'
}, {
  a: '7E8',
  r: '7F0',
  n: 'Chassis Control Alt',
  h: 'בקר שלדה אלט',
  ic: '🚗'
}, {
  a: '7F1',
  r: '7F9',
  n: 'Center Gateway Alt',
  h: 'שער מרכזי אלט',
  ic: '🌐'
}];
  ic: '🛰️'
}, {
  a: '7E6',
  r: '7EE',
  n: 'BMS — Battery',
  h: 'ניהול מצבר',
  ic: '🔋'
}];
const DEMO_ACTIVE = new Set(['7E0', '7E1', '740', '750', '730', '720', '760', '790', '7E2', '7E3', '7E4', '7E5', '7E6', '7E7', '7E8', '7F0', '700', '710', '7C0', '7D5', '711', '721', '731', '741', '751', '761', '771', '781', '791', '7A1', '7B1', '7C1', '7D6', '712', '7C1', '7D6', '7F1']);
const UDS_DIDS = [{
  d: 'F190',
  n: 'VIN',
  h: 'שילדה',
  crit: true
}, {
  d: 'F191',
  n: 'HW Version',
  h: 'חומרה'
}, {
  d: 'F195',
  n: 'SW Version',
  h: 'תוכנה'
}, {
  d: 'F197',
  n: 'System Name',
  h: 'שם מערכת'
}, {
  d: 'F18C',
  n: 'ECU Serial',
  h: 'סריאלי'
}, {
  d: '0200',
  n: 'Odometer',
  h: 'ק"מ',
  crit: true
}, {
  d: 'F010',
  n: 'Odometer Alt',
  h: 'ק"מ אלט',
  crit: true
}, {
  d: 'F011',
  n: 'Odometer 2',
  h: 'ק"מ 2',
  crit: true
}, {
  d: 'F012',
  n: 'Odometer 3',
  h: 'ק"מ 3',
  crit: true
}, {
  d: 'F020',
  n: 'Distance Total',
  h: 'מרחק כולל',
  crit: true
}, {
  d: 'F021',
  n: 'Distance Trip',
  h: 'מרחק נסיעה',
  crit: true
}, {
  d: 'F022',
  n: 'Distance Service',
  h: 'מרחק שירות',
  crit: true
}, {
  d: 'F190',
  n: 'VIN',
  h: 'שילדה',
  crit: true
}, {
  d: 'F194',
  n: 'Supplier Code',
  h: 'קוד ספק'
}, {
  d: 'F198',
  n: 'ECU Name',
  h: 'שם מחשב'
}, {
  d: 'F1A0',
  n: 'System Supplier',
  h: 'ספק מערכת'
}, {
  d: 'F1A1',
  n: 'ECU Software Date',
  h: 'תאריך תוכנה'
}, {
  d: 'F1A5',
  n: 'System Software Version',
  h: 'גרסת תוכנה'
}, {
  d: 'F1A6',
  n: 'Hardware Version',
  h: 'גרסת חומרה'
}, {
  d: 'F1A7',
  n: 'Software Version',
  h: 'גרסת תוכנה'
}, {
  d: 'F1A8',
  n: 'Boot Software Version',
  h: 'גרסת Boot'
}, {
  d: 'F1A9',
  n: 'Application Software Version',
  h: 'גרסת אפליקציה'
}, {
  d: 'F1AA',
  n: 'Data Version',
  h: 'גרסת נתונים'
}, {
  d: 'F1AB',
  n: 'Calibration Software Version',
  h: 'גרסת כיול'
}, {
  d: 'F1AC',
  n: 'Calibration Data Version',
  h: 'גרסת נתוני כיול'
}, {
  d: 'F1AD',
  n: 'Calibration Date',
  h: 'תאריך כיול'
}, {
  d: 'F1AE',
  n: 'Calibration Equipment',
  h: 'ציוד כיול'
}, {
  d: 'F1AF',
  n: 'Programmer',
  h: 'מתכנת'
}, {
  d: 'F1B0',
  n: 'Programming Date',
  h: 'תאריך תכנות'
}, {
  d: 'F1B1',
  n: 'Target Hardware',
  h: 'חומרה יעד'
}, {
  d: 'F1B2',
  n: 'Target Software',
  h: 'תוכנה יעד'
}, {
  d: 'F1B3',
  n: 'Serial Number',
  h: 'מספר סידורי'
}, {
  d: 'F1B4',
  n: 'Part Number',
  h: 'מספר חלק'
}, {
  d: 'F1B5',
  n: 'Assembly Number',
  h: 'מספר הרכבה'
}, {
  d: 'F1B6',
  n: 'Vehicle Manufacturer',
  h: 'יצרן רכב'
}, {
  d: 'F1B7',
  n: 'Vehicle Model',
  h: 'דגם רכב'
}, {
  d: 'F1B8',
  n: 'Vehicle Year',
  h: 'שנת רכב'
}, {
  d: 'F1B9',
  n: 'Vehicle Transmission',
  h: 'תיבת הילוכים'
}, {
  d: 'F1BA',
  n: 'Vehicle Engine',
  h: 'מנוע'
}, {
  d: 'F1BB',
  n: 'Vehicle Fuel Type',
  h: 'סוג דלק'
}, {
  d: 'F1BC',
  n: 'Vehicle Power',
  h: 'הספק'
}, {
  d: 'F1BD',
  n: 'Vehicle Weight',
  h: 'משקל'
}, {
  d: 'F1BE',
  n: 'Vehicle Color',
  h: 'צבע'
}, {
  d: 'F1BF',
  n: 'Vehicle Interior',
  h: 'פנים'
}, {
  d: 'F1C0',
  n: 'Vehicle Options',
  h: 'אפשרויות'
}, {
  d: 'F1C1',
  n: 'Vehicle Production Date',
  h: 'תאריך ייצור'
}, {
  d: 'F1C2',
  n: 'Vehicle Delivery Date',
  h: 'תאריך מסירה'
}, {
  d: 'F1C3',
  n: 'Vehicle Sale Date',
  h: 'תאריך מכירה'
}, {
  d: 'F1C4',
  n: 'Vehicle Warranty Start',
  h: 'תחילת אחריות'
}, {
  d: 'F1C5',
  n: 'Vehicle Warranty End',
  h: 'סוף אחריות'
}, {
  d: 'F1C6',
  n: 'Vehicle Service Date',
  h: 'תאריך שירות'
}, {
  d: 'F1C7',
  n: 'Vehicle Service Interval',
  h: 'מרווח שירות'
}, {
  d: 'F1C8',
  n: 'Vehicle Service Distance',
  h: 'מרחק שירות'
}, {
  d: 'F1C9',
  n: 'Vehicle Service Type',
  h: 'סוג שירות'
}, {
  d: 'F1CA',
  n: 'Vehicle Service Provider',
  h: 'ספק שירות'
}, {
  d: 'F1CB',
  n: 'Vehicle Service Notes',
  h: 'הערות שירות'
}, {
  d: 'F1CC',
  n: 'Vehicle Insurance',
  h: 'ביטוח'
}, {
  d: 'F1CD',
  n: 'Vehicle Registration',
  h: 'רישום'
}, {
  d: 'F1CE',
  n: 'Vehicle License Plate',
  h: 'מספר רישוי'
}, {
  d: 'F1CF',
  n: 'Vehicle VIN Check',
  h: 'בדיקת שילדה'
}, {
  d: 'F1D0',
  n: 'Vehicle Mileage',
  h: 'ק"מ רכב',
  crit: true
}, {
  d: 'F1D1',
  n: 'Vehicle Hours',
  h: 'שעות רכב'
}, {
  d: 'F1D2',
  n: 'Vehicle Trips',
  h: 'נסיעות'
}, {
  d: 'F1D3',
  n: 'Vehicle Fuel Consumption',
  h: 'צריכת דלק'
}, {
  d: 'F1D4',
  n: 'Vehicle Fuel Range',
  h: 'טווח דלק'
}, {
  d: 'F1D5',
  n: 'Vehicle Fuel Level',
  h: 'מפלס דלק'
}, {
  d: 'F1D6',
  n: 'Vehicle Oil Level',
  h: 'מפלס שמן'
}, {
  d: 'F1D7',
  n: 'Vehicle Oil Life',
  h: 'אורך חיי שמן'
}, {
  d: 'F1D8',
  n: 'Vehicle Oil Pressure',
  h: 'לחץ שמן'
}, {
  d: 'F1D9',
  n: 'Vehicle Oil Temperature',
  h: 'טמפ\' שמן'
}, {
  d: 'F1DA',
  n: 'Vehicle Coolant Level',
  h: 'מפלס קירור'
}, {
  d: 'F1DB',
  n: 'Vehicle Coolant Temperature',
  h: 'טמפ\' קירור'
}, {
  d: 'F1DC',
  n: 'Vehicle Coolant Pressure',
  h: 'לחץ קירור'
}, {
  d: 'F1DD',
  n: 'Vehicle Battery Level',
  h: 'מפלס סוללה'
}, {
  d: 'F1DE',
  n: 'Vehicle Battery Voltage',
  h: 'מתח סוללה'
}, {
  d: 'F1DF',
  n: 'Vehicle Battery Temperature',
  h: 'טמפ\' סוללה'
}, {
  d: 'F1E0',
  n: 'Vehicle Battery Current',
  h: 'זרם סוללה'
}, {
  d: 'F1E1',
  n: 'Vehicle Battery Health',
  h: 'בריאות סוללה'
}, {
  d: 'F1E2',
  n: 'Vehicle Battery Cycles',
  h: 'מחזורי סוללה'
}, {
  d: 'F1E3',
  n: 'Vehicle Battery Capacity',
  h: 'קיבולת סוללה'
}, {
  d: 'F1E4',
  n: 'Vehicle Battery Charge',
  h: 'טעינת סוללה'
}, {
  d: 'F1E5',
  n: 'Vehicle Battery Discharge',
  h: 'פריקת סוללה'
}, {
  d: 'F1E6',
  n: 'Vehicle Battery Time',
  h: 'זמן סוללה'
}, {
  d: 'F1E7',
  n: 'Vehicle Battery Power',
  h: 'הספק סוללה'
}, {
  d: 'F1E8',
  n: 'Vehicle Battery Energy',
  h: 'אנרגיה סוללה'
}, {
  d: 'F1E9',
  n: 'Vehicle Battery Efficiency',
  h: 'יעילות סוללה'
}, {
  d: 'F1EA',
  n: 'Vehicle Battery Regeneration',
  h: 'הטענה חוזרת'
}, {
  d: 'F1EB',
  n: 'Vehicle Battery Heating',
  h: 'חימום סוללה'
}, {
  d: 'F1EC',
  n: 'Vehicle Battery Cooling',
  h: 'קירור סוללה'
}, {
  d: 'F1ED',
  n: 'Vehicle Battery Balancing',
  h: 'איזון סוללה'
}, {
  d: 'F1EE',
  n: 'Vehicle Battery Protection',
  h: 'הגנת סוללה'
}, {
  d: 'F1EF',
  n: 'Vehicle Battery Safety',
  h: 'בטיחות סוללה'
}, {
  d: 'F1F0',
  n: 'Vehicle Battery Warning',
  h: 'אזהרת סוללה'
}, {
  d: 'F1F1',
  n: 'Vehicle Battery Error',
  h: 'שגיאת סוללה'
}, {
  d: 'F1F2',
  n: 'Vehicle Battery Fault',
  h: 'תקלת סוללה'
}, {
  d: 'F1F3',
  n: 'Vehicle Battery Failure',
  h: 'כשל סוללה'
}, {
  d: 'F1F4',
  n: 'Vehicle Battery Status',
  h: 'סטטוס סוללה'
}, {
  d: 'F1F5',
  n: 'Vehicle Battery Mode',
  h: 'מצב סוללה'
}, {
  d: 'F1F6',
  n: 'Vehicle Battery Type',
  h: 'סוג סוללה'
}, {
  d: 'F1F7',
  n: 'Vehicle Battery Manufacturer',
  h: 'יצרן סוללה'
}, {
  d: 'F1F8',
  n: 'Vehicle Battery Model',
  h: 'דגם סוללה'
}, {
  d: 'F1F9',
  n: 'Vehicle Battery Serial',
  h: 'סידורי סוללה'
}, {
  d: 'F1FA',
  n: 'Vehicle Battery Production',
  h: 'ייצור סוללה'
}, {
  d: 'F1FB',
  n: 'Vehicle Battery Warranty',
  h: 'אחריות סוללה'
}, {
  d: 'F1FC',
  n: 'Vehicle Battery Life',
  h: 'אורך חיי סוללה'
}, {
  d: 'F1FD',
  n: 'Vehicle Battery Replacement',
  h: 'החלפת סוללה'
}, {
  d: 'F1FE',
  n: 'Vehicle Battery Recycling',
  h: 'מיחזור סוללה'
}, {
  d: 'F1FF',
  n: 'Vehicle Battery Disposal',
  h: 'סילוק סוללה'
}];

// ═══════════════════════════════════════════
// DEMO SIMULATOR
// ═══════════════════════════════════════════
function demoResp(cmd) {
  const c = cmd.trim().toUpperCase().replace(/\s/g, '');
  if (c === 'ATZ') return 'ELM327 v2.1 (Demo)';
  if (c.startsWith('AT')) return 'OK';
  if (c === '0100') return '41 00 BE 3E B8 13';
  if (c === '0101') {
    return '41 01 82 47 65 05';
  }
  if (c === '03') return '43 01 71 03 01';
  if (c === '07') return '47 01 28';
  if (c === '04') {
    return '44';
  }
  // Freeze Frame (Mode 02)
  if (c.startsWith('02')) {
    const pid = c.substring(2);
    if (pid === '02') return '42 02 01 71';
    const p = PIDS[pid];
    if (!p) return 'NO DATA';
    let bs = [];
    if (pid === '0C') {
      bs = [12, 80];
    } else if (pid === '0D') {
      bs = [65];
    } else if (pid === '05') {
      bs = [92 + 40];
    } else if (pid === '11') {
      bs = [45];
    } else if (pid === '04') {
      bs = [120];
    } else if (pid === '06') {
      bs = [148];
    } else if (pid === '07') {
      bs = [138];
    } else if (pid === '0F') {
      bs = [55 + 40];
    } else {
      for (let i = 0; i < p.b; i++) bs.push(Math.floor(Math.random() * 200));
    }
    return '42 ' + pid + ' ' + bs.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
  }
  if (c === '0902') return '49 02 01 31 47 31 4A 43 35 34 34 34 52 37 32 35 32 33 36 37';
  if (c === '3E00') return '7E 00';
  if (c === '1001' || c === '1003') return '50 03';
  if (c === '1902FF') {
    return Math.random() > 0.5 ? '59 02 FF 01 71 24 03 01 08' : '59 02 FF';
  }
  if (c === '22F190') return '62 F1 90 31 47 31 4A 43 35 34 34 34 52 37 32 35 32 33 36 37';
  if (c === '22F191') return '62 F1 91 48 57 30 32 2E 31';
  if (c === '22F195') return '62 F1 95 53 57 31 2E 33 2E 35';
  if (c === '22F197') return '62 F1 97 45 43 4D';
  if (c === '22F18C') return '62 F1 8C 41 42 43 31 32 33 34 35';
  if (c === '220200') {
    const km = 85000 + Math.floor(Math.random() * 2000);
    const b1 = km >> 16 & 0xFF,
      b2 = km >> 8 & 0xFF,
      b3 = km & 0xFF;
    return `62 02 00 ${b1.toString(16).padStart(2, '0')} ${b2.toString(16).padStart(2, '0')} ${b3.toString(16).padStart(2, '0')}`;
  }
  // Support for new odometer commands
  if (c === '22F010') {
    const km = 85000 + Math.floor(Math.random() * 2000);
    const b1 = km >> 16 & 0xFF,
      b2 = km >> 8 & 0xFF,
      b3 = km & 0xFF;
    return `62 F0 10 ${b1.toString(16).padStart(2, '0')} ${b2.toString(16).padStart(2, '0')} ${b3.toString(16).padStart(2, '0')}`;
  }
  if (c === '22F011') {
    const km = 84000 + Math.floor(Math.random() * 1000);
    const b1 = km >> 16 & 0xFF,
      b2 = km >> 8 & 0xFF,
      b3 = km & 0xFF;
    return `62 F0 11 ${b1.toString(16).padStart(2, '0')} ${b2.toString(16).padStart(2, '0')} ${b3.toString(16).padStart(2, '0')}`;
  }
  if (c === '22F012') {
    const km = 83000 + Math.floor(Math.random() * 1000);
    const b1 = km >> 16 & 0xFF,
      b2 = km >> 8 & 0xFF,
      b3 = km & 0xFF;
    return `62 F0 12 ${b1.toString(16).padStart(2, '0')} ${b2.toString(16).padStart(2, '0')} ${b3.toString(16).padStart(2, '0')}`;
  }
  if (c === '22F020') {
    const km = 86000 + Math.floor(Math.random() * 3000);
    const b1 = km >> 16 & 0xFF,
      b2 = km >> 8 & 0xFF,
      b3 = km & 0xFF;
    return `62 F0 20 ${b1.toString(16).padStart(2, '0')} ${b2.toString(16).padStart(2, '0')} ${b3.toString(16).padStart(2, '0')}`;
  }
  if (c === '22F021') {
    const km = 500 + Math.floor(Math.random() * 200);
    const b1 = km >> 8 & 0xFF,
      b2 = km & 0xFF;
    return `62 F0 21 ${b1.toString(16).padStart(2, '0')} ${b2.toString(16).padStart(2, '0')}`;
  }
  if (c === '22F022') {
    const km = 15000 + Math.floor(Math.random() * 1000);
    const b1 = km >> 16 & 0xFF,
      b2 = km >> 8 & 0xFF,
      b3 = km & 0xFF;
    return `62 F0 22 ${b1.toString(16).padStart(2, '0')} ${b2.toString(16).padStart(2, '0')} ${b3.toString(16).padStart(2, '0')}`;
  }
  if (c === '22F1D0') {
    const km = 87000 + Math.floor(Math.random() * 2500);
    const b1 = km >> 16 & 0xFF,
      b2 = km >> 8 & 0xFF,
      b3 = km & 0xFF;
    return `62 F1 D0 ${b1.toString(16).padStart(2, '0')} ${b2.toString(16).padStart(2, '0')} ${b3.toString(16).padStart(2, '0')}`;
  }
  const pid = c.length >= 4 ? c.substring(2) : '';
  const p = PIDS[pid];
  if (!p) return 'NO DATA';
  let bs = [];
  if (pid === '0C') {
    const v = Math.round((800 + Math.random() * 2500) * 4);
    bs = [v >> 8 & 0xFF, v & 0xFF];
  } else if (pid === '0D') bs = [Math.floor(Math.random() * 120)];else if (pid === '05') bs = [80 + Math.floor(Math.random() * 20) + 40];else if (pid === '11') bs = [Math.floor(Math.random() * 180)];else if (pid === '42') {
    const v = Math.round((13.5 + Math.random() * 1.5) * 1000);
    bs = [v >> 8 & 0xFF, v & 0xFF];
  } else if (pid === '2F') bs = [128 + Math.floor(Math.random() * 80)];else if (pid === '06' || pid === '07') bs = [128 + Math.floor((Math.random() - 0.5) * 30)];else if (pid === '0F' || pid === '46') bs = [60 + Math.floor(Math.random() * 15)];else {
    for (let i = 0; i < p.b; i++) bs.push(Math.floor(Math.random() * 200));
  }
  return '41 ' + pid + ' ' + bs.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
}

// ═══════════════════════════════════════════
// BLE PROFILES
// ═══════════════════════════════════════════
const BLE_PROFILES = [{
  svc: '0000ffe0-0000-1000-8000-00805f9b34fb',
  chr: '0000ffe1-0000-1000-8000-00805f9b34fb'
}, {
  svc: '0000fff0-0000-1000-8000-00805f9b34fb',
  wrt: '0000fff2-0000-1000-8000-00805f9b34fb',
  ntf: '0000fff1-0000-1000-8000-00805f9b34fb'
}, {
  svc: 'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
  chr: 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'
}, {
  svc: '0000ffe5-0000-1000-8000-00805f9b34fb',
  chr: '0000ffe9-0000-1000-8000-00805f9b34fb'
}, {
  svc: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  wrt: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
  ntf: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
}, {
  svc: '0000aa00-0000-1000-8000-00805f9b34fb',
  chr: '0000aa01-0000-1000-8000-00805f9b34fb'
}, {
  svc: '00001101-0000-1000-8000-00805f9b34fb',
  chr: '00001102-0000-1000-8000-00805f9b34fb'
}];

// ═══════════════════════════════════════════
// GAUGE COMPONENT
// ═══════════════════════════════════════════
function Gauge({
  value = 0,
  max = 100,
  label = '',
  unit = '',
  warn,
  size = 120
}) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const sa = -225,
    ea = 45,
    rng = ea - sa;
  const ang = sa + pct * rng,
    r = size / 2 - 12,
    cx = size / 2,
    cy = size / 2;
  const bad = warn && value >= warn;
  const arc = (s, e, rad) => {
    const s1 = (s - 90) * Math.PI / 180,
      e1 = (e - 90) * Math.PI / 180;
    return `M ${cx + rad * Math.cos(s1)} ${cy + rad * Math.sin(s1)} A ${rad} ${rad} 0 ${e - s > 180 ? 1 : 0} 1 ${cx + rad * Math.cos(e1)} ${cy + rad * Math.sin(e1)}`;
  };
  const nd = a => {
    const rd = (a - 90) * Math.PI / 180;
    return {
      x: cx + (r - 8) * Math.cos(rd),
      y: cy + (r - 8) * Math.sin(rd)
    };
  };
  const ne = nd(ang);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      flex: 1,
      minWidth: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`
  }, /*#__PURE__*/React.createElement("path", {
    d: arc(sa, ea, r),
    fill: "none",
    stroke: "#334155",
    strokeWidth: "6",
    strokeLinecap: "round"
  }), warn && /*#__PURE__*/React.createElement("path", {
    d: arc(sa + warn / max * rng, ea, r),
    fill: "none",
    stroke: "rgba(239,68,68,0.3)",
    strokeWidth: "6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: arc(sa, ang, r),
    fill: "none",
    stroke: bad ? '#ef4444' : '#f59e0b',
    strokeWidth: "6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: cx,
    y1: cy,
    x2: ne.x,
    y2: ne.y,
    stroke: bad ? '#ef4444' : '#f59e0b',
    strokeWidth: "2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "4",
    fill: bad ? '#ef4444' : '#f59e0b'
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 20,
    textAnchor: "middle",
    fill: "#e2e8f0",
    fontSize: "18",
    fontWeight: "700",
    fontFamily: "monospace"
  }, Math.round(value)), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 34,
    textAnchor: "middle",
    fill: "#64748b",
    fontSize: "9"
  }, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94a3b8',
      marginTop: -8
    }
  }, label));
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

function SimpleChart({
  data,
  dataKey,
  color
}) {
  if (!data || data.length < 2) return null;
  var vals = data.map(function (d) {
    return d[dataKey || 'v'];
  });
  var mn = Math.min.apply(null, vals),
    mx = Math.max.apply(null, vals) || 1;
  var w = 300,
    h = 80;
  var pts = data.map(function (d, i) {
    var x = i / (data.length - 1) * w;
    var y = h - (d[dataKey || 'v'] - mn) / (mx - mn || 1) * (h - 10) - 5;
    return x + ',' + y;
  }).join(' ');
  return React.createElement('div', null, React.createElement('svg', {
    width: '100%',
    viewBox: '0 0 ' + w + ' ' + h,
    style: {
      display: 'block'
    }
  }, React.createElement('polyline', {
    points: pts,
    fill: 'none',
    stroke: color || '#f59e0b',
    strokeWidth: '2'
  })), React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 9,
      color: '#64748b'
    }
  }, React.createElement('span', null, mn.toFixed(0)), React.createElement('span', null, mx.toFixed(0))));
}
function App() {
  const [tab, setTab] = useState('connect');
  const [lang, setLang] = useState('he');
  const [connMethod, setCM] = useState(null);
  const [connStatus, setCS] = useState('off');
  const [connInfo, setCI] = useState('');
  const [liveData, setLD] = useState({});
  const [dtcList, setDL] = useState([]);
  const [dtcPending, setDP] = useState([]);
  const [vehicleInfo, setVI] = useState({});
  const [termHist, setTH] = useState([]);
  const [termCmd, setTC] = useState('');
  const [monitoring, setMon] = useState(false);
  const [preset, setPre] = useState('basic');
  const [supPids, setSP] = useState([]);
  const [logs, setLogs] = useState([]);
  const [ecuList, setEL] = useState([]);
  const [ecuScanning, setES] = useState(false);
  const [ecuProg, setEP] = useState('');
  const [selEcu, setSE] = useState(null);
  const [ecuDet, setED] = useState({});
  const [kmRpt, setKR] = useState([]);
  const [showAbout, setSA] = useState(false);
  const [readyData, setRD] = useState(null);
  const [freezeData, setFD] = useState(null);
  const [graphData, setGD] = useState([]);
  const [graphPid, setGP] = useState('0C');
  const [loading, setLo] = useState(false);
  const [wifiH, setWH] = useState('192.168.0.10');
  const [wifiP, setWP] = useState('35000');
  const [baud, setBaud] = useState('38400');
  const [recording, setRec] = useState(false);
  const [recData, setRecD] = useState([]);
  const [scanHist, setSH] = useState([]);
  const [ohmV, setOhmV] = useState('');
  const [ohmI, setOhmI] = useState('');
  const [ohmR, setOhmR] = useState('');
  const [theme, setTheme] = useState('dark');
  const [perfActive, setPA] = useState(false);
  const [perfStart, setPS] = useState(null);
  const [perfTime, setPT] = useState(null);
  const [tripStart, setTS2] = useState(null);
  const [tripDist, setTD2] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [odoScanning, setOScan] = useState(false);
  const [odoProg, setOProg] = useState('');
  const [odoResults, setOResults] = useState([]);
  const [odoRawLog, setORaw] = useState([]);
  const [odoKnownKm, setOKm] = useState('');
  
  // New states for advanced features
  const [scanHistory, setScanHistory] = useState([]);
  const [kmHistory, setKmHistory] = useState([]);
  const [vehicleHistory, setVehicleHistory] = useState([]);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [favoriteECUs, setFavoriteECUs] = useState([]);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [temperatureData, setTemperatureData] = useState([]);
  const [pressureData, setPressureData] = useState([]);
  const [safetySystems, setSafetySystems] = useState({});
  const [simpleMode, setSimpleMode] = useState(false);
  const [customTheme, setCustomTheme] = useState(null);
  const [advancedDTC, setAdvancedDTC] = useState(null);
  const [ecuTestResults, setEcuTestResults] = useState([]);
  const [liveCharts, setLiveCharts] = useState({});
  const [exportFormat, setExportFormat] = useState('csv');
  const [scanSchedule, setScanSchedule] = useState(null);
  const [reportTemplates, setReportTemplates] = useState([]);
  
  const t = useCallback(k => T[k]?.[lang] || T[k]?.en || k, [lang]);
  const isRTL = RTL.includes(lang);
  const bleDevRef = useRef(null);
  const bleWrRef = useRef(null);
  const serialPortRef = useRef(null);
  const serialWrRef = useRef(null);
  const serialRdRef = useRef(null);
  const wsRef = useRef(null);
  const resBuf = useRef('');
  const resolveFn = useRef(null);
  const monRef = useRef(null);
  const cmRef = useRef(null);
  const demoCleared = useRef(false);
  const addLog = useCallback((m, tp = 'info') => setLogs(p => [...p.slice(-80), {
    m,
    tp,
    t: new Date().toLocaleTimeString()
  }]), []);

  // ─── SAVE SCAN HISTORY ───
  const saveScanHistory = useCallback((scanData) => {
    const historyEntry = {
      timestamp: new Date().toISOString(),
      vehicleInfo: vehicleInfo,
      ecuList: ecuList.filter(e => e.ok),
      kmRpt: kmRpt,
      dtcList: dtcList,
      readyData: readyData,
      vehicle: currentVehicle
    };
    
    const newHistory = [...scanHistory, historyEntry];
    setScanHistory(newHistory);
    
    try {
      localStorage.setItem('obdScanHistory', JSON.stringify(newHistory.slice(-50)));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
    
    if (kmRpt.length > 0) {
      const kmEntry = {
        timestamp: new Date().toISOString(),
        kms: kmRpt,
        vehicle: currentVehicle || vehicleInfo.vin
      };
      setKmHistory(prev => [...prev, kmEntry].slice(-20));
    }
  }, [scanHistory, vehicleInfo, ecuList, kmRpt, dtcList, readyData, currentVehicle]);

  // ─── COMPARE KILOMETERS ───
  const compareKilometers = useCallback(() => {
    if (kmRpt.length < 2) return null;
    
    const kms = kmRpt.map(r => parseInt(r.km) || 0);
    const maxKm = Math.max(...kms);
    const minKm = Math.min(...kms);
    const diff = maxKm - minKm;
    
    const suspicious = kmRpt.filter(r => {
      const km = parseInt(r.km) || 0;
      return Math.abs(km - minKm) > 10000;
    });
    
    return {
      maxKm,
      minKm,
      diff,
      suspicious,
      isSuspicious: diff > 10000,
      message: diff > 10000 ? '⚠️ חשד להורדת ק"מ!' : '✅ הק"מ תקין'
    };
  }, [kmRpt]);

  // ─── DETECT ODOMETER ROLLBACK ───
  const detectOdometerRollback = useCallback(() => {
    if (kmHistory.length < 2) return null;
    
    const sortedHistory = [...kmHistory].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    let detected = false;
    let rollbackDetails = [];
    
    for (let i = 1; i < sortedHistory.length; i++) {
      const current = sortedHistory[i];
      const previous = sortedHistory[i - 1];
      
      if (current.kms && previous.kms) {
        const currentMax = Math.max(...current.kms.map(k => parseInt(k.km) || 0));
        const previousMax = Math.max(...previous.kms.map(k => parseInt(k.km) || 0));
        
        if (currentMax < previousMax - 1000) {
          detected = true;
          rollbackDetails.push({
            date: current.timestamp,
            previousKm: previousMax,
            currentKm: currentMax,
            decrease: previousMax - currentMax
          });
        }
      }
    }
    
    return detected ? {
      detected,
      details: rollbackDetails,
      message: `🚨 זוהו ${rollbackDetails.length} מקרים של ירידת ק"מ!`
    } : null;
  }, [kmHistory]);

  // ─── DECODE VIN ───
  const decodeVIN = useCallback((vin) => {
    if (!vin || vin.length !== 17) return null;
    
    const wmi = vin.substring(0, 3);
    const vds = vin.substring(3, 9);
    const vis = vin.substring(9, 17);
    
    const countryCodes = {
      'J': 'Japan', 'K': 'Korea', 'L': 'China', 'M': 'Thailand',
      'S': 'UK', 'T': 'Czech Republic', 'V': 'France', 'W': 'Germany',
      'X': 'Russia', 'Y': 'Sweden', 'Z': 'Italy',
      '1': 'USA', '2': 'Canada', '3': 'Mexico', '4': 'USA', '5': 'USA'
    };
    
    const country = countryCodes[vin.charAt(0)] || 'Unknown';
    
    const yearMap = {
      'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
      'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
      'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
      'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
      'Y': 2030, '1': 2001, '2': 2002, '3': 2003, '4': 2004,
      '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009
    };
    
    const year = yearMap[vin.charAt(9)] || 'Unknown';
    
    return { wmi, vds, vis, country, year, vin };
  }, []);

  // ─── GET VEHICLE INFO FROM VIN ───
  const getVehicleInfoFromVIN = useCallback(async (vin) => {
    if (!vin || vin.length !== 17) {
      addLog('Invalid VIN format', 'error');
      return null;
    }
    
    addLog('Getting vehicle info from VIN...', 'info');
    
    const decodedVIN = decodeVIN(vin);
    if (decodedVIN) {
      addLog(`VIN decoded: ${decodedVIN.country}, ${decodedVIN.year}`, 'success');
    }
    
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      if (response.ok) {
        const data = await response.json();
        const results = data.Results;
        
        const vehicleInfo = {
          vin: vin,
          make: results.find(r => r.Variable === 'Make')?.Value,
          model: results.find(r => r.Variable === 'Model')?.Value,
          year: results.find(r => r.Variable === 'Model Year')?.Value,
          manufacturer: results.find(r => r.Variable === 'Manufacturer')?.Value,
          plant: results.find(r => r.Variable === 'Plant City')?.Value,
          body: results.find(r => r.Variable === 'Body Class')?.Value,
          fuel: results.find(r => r.Variable === 'Fuel Type Primary')?.Value,
          engine: results.find(r => r.Variable === 'Engine Model')?.Value,
          transmission: results.find(r => r.Variable === 'Transmission Style')?.Value,
          drive: results.find(r => r.Variable === 'Drive Type')?.Value,
          doors: results.find(r => r.Variable === 'Doors')?.Value,
          gvwr: results.find(r => r.Variable === 'Gross Vehicle Weight Rating')?.Value
        };
        
        addLog('Vehicle info retrieved from NHTSA', 'success');
        return vehicleInfo;
      }
    } catch (e) {
      addLog('Failed to get vehicle info from API', 'warning');
    }
    
    return decodedVIN;
  }, [decodeVIN, addLog]);

  // ─── EXPORT TO CSV ───
  const exportToCSV = useCallback(() => {
    const csvData = [];
    
    csvData.push(['VEHICLE INFORMATION']);
    csvData.push(['VIN', vehicleInfo.vin || 'N/A']);
    csvData.push(['Protocol', vehicleInfo.proto || 'N/A']);
    csvData.push(['Battery', vehicleInfo.batt || 'N/A']);
    csvData.push([]);
    
    csvData.push(['ECU SCAN RESULTS']);
    csvData.push(['ECU Name', 'Address', 'Status', 'Kilometers', 'DTCs']);
    
    ecuList.filter(e => e.ok).forEach(ecu => {
      const det = ecuDet[ecu.a];
      const km = det?.odometer || det?.['0200'] || det?.['F010'] || 'N/A';
      const dtcs = det?.dtcs?.map(d => d.code).join(', ') || 'None';
      
      csvData.push([
        ecu.h || ecu.n,
        ecu.a,
        'Active',
        km,
        dtcs
      ]);
    });
    
    csvData.push([]);
    
    csvData.push(['TROUBLE CODES']);
    csvData.push(['Code', 'Description', 'Status']);
    
    dtcList.forEach(dtc => {
      csvData.push([dtc.code, dtc.desc, 'Confirmed']);
    });
    
    dtcPending.forEach(dtc => {
      csvData.push([dtc.code, dtc.desc, 'Pending']);
    });
    
    csvData.push([]);
    csvData.push(['Scan Date', new Date().toLocaleString()]);
    
    const csvString = csvData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `OBD_Scan_${vehicleInfo.vin || 'vehicle'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addLog('CSV exported successfully', 'success');
  }, [vehicleInfo, ecuList, ecuDet, dtcList, dtcPending, addLog]);

  // ─── EXPORT TO PDF ───
  const exportToPDF = useCallback(() => {
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>OBD Scanner Pro Report</title>
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; color: #f59e0b; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #f59e0b; color: white; }
          .confirmed { color: #dc2626; }
          .pending { color: #f59e0b; }
          .ok { color: #16a34a; }
          .warning { color: #f59e0b; }
          .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔧 OBD Scanner Pro Report</h1>
          <p>${t('aboutTxt')}</p>
          <p>${new Date().toLocaleString('he-IL')}</p>
        </div>
        
        <div class="section">
          <div class="section-title">מידע רכב</div>
          <table>
            <tr><th>VIN</th><td>${vehicleInfo.vin || 'N/A'}</td></tr>
            <tr><th>פרוטוקול</th><td>${vehicleInfo.proto || 'N/A'}</td></tr>
            <tr><th>מתח סוללה</th><td>${vehicleInfo.batt || 'N/A'}V</td></tr>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">סריקת מחשבים</div>
          <table>
            <tr><th>מחשב</th><th>כתובת</th><th>סטטוס</th><th>ק"מ</th><th>תקלות</th></tr>
            ${ecuList.filter(e => e.ok).map(ecu => {
              const det = ecuDet[ecu.a];
              const km = det?.odometer || det?.['0200'] || det?.['F010'] || 'N/A';
              const dtcs = det?.dtcs?.map(d => d.code).join(', ') || 'אין';
              return `<tr>
                <td>${ecu.h || ecu.n}</td>
                <td>${ecu.a}</td>
                <td class="ok">פעיל</td>
                <td>${km}</td>
                <td>${dtcs}</td>
              </tr>`;
            }).join('')}
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">השוואת ק"מ</div>
          <table>
            <tr><th>מחשב</th><th>ק"מ</th><th>סטטוס</th></tr>
            ${kmRpt.map(r => {
              const km = parseInt(r.km) || 0;
              const maxKm = Math.max(...kmRpt.map(k => parseInt(k.km) || 0));
              const isMax = km === maxKm;
              const minKm = Math.min(...kmRpt.map(k => parseInt(k.km) || 0));
              const isMin = km === minKm;
              const status = kmRpt.length > 1 && (maxKm - minKm) > 10000 ? 
                (isMax ? '✅ גבוה ביותר' : isMin ? '⚠️ נמוך ביותר' : 'אמצעי') : '✅ תקין';
              
              return `<tr>
                <td>${r.name}</td>
                <td>${r.km}</td>
                <td class="${status.includes('⚠️') ? 'warning' : 'ok'}">${status}</td>
              </tr>`;
            }).join('')}
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">קודי תקלה</div>
          ${dtcList.length > 0 ? `
            <table>
              <tr><th>קוד</th><th>תיאור</th><th>סטטוס</th></tr>
              ${dtcList.map(d => `
                <tr>
                  <td class="confirmed">${d.code}</td>
                  <td>${d.desc}</td>
                  <td class="confirmed">מאושר</td>
                </tr>
              `).join('')}
            </table>
          ` : '<p class="ok">✅ אין תקלות מאושרות</p>'}
          
          ${dtcPending.length > 0 ? `
            <h3>תקלות ממתינות</h3>
            <table>
              <tr><th>קוד</th><th>תיאור</th><th>סטטוס</th></tr>
              ${dtcPending.map(d => `
                <tr>
                  <td class="pending">${d.code}</td>
                  <td>${d.desc}</td>
                  <td class="pending">ממתין</td>
                </tr>
              `).join('')}
            </table>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>${t('copy')}</p>
          <p>${t('warn')}</p>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `OBD_Report_${vehicleInfo.vin || 'vehicle'}_${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addLog('PDF report exported successfully', 'success');
  }, [vehicleInfo, ecuList, ecuDet, kmRpt, dtcList, dtcPending, t, addLog]);

  // ─── SHARE TO WHATSAPP ───
  const shareToWhatsApp = useCallback(() => {
    let message = `🔧 *OBD Scanner Pro Report*\n`;
    message += `📅 ${new Date().toLocaleString('he-IL')}\n\n`;
    
    if (vehicleInfo.vin) {
      message += `🚗 VIN: ${vehicleInfo.vin}\n`;
    }
    
    message += `\n📊 *סריקת מחשבים:*\n`;
    const activeECUs = ecuList.filter(e => e.ok);
    message += `נמצאו ${activeECUs.length} מחשבים פעילים\n\n`;
    
    if (kmRpt.length > 0) {
      message += `📏 *השוואת ק"מ:*\n`;
      kmRpt.forEach(r => {
        message += `• ${r.name}: ${r.km}\n`;
      });
      message += '\n';
    }
    
    if (dtcList.length > 0) {
      message += `❌ *תקלות מאושרות (${dtcList.length}):*\n`;
      dtcList.forEach(d => {
        message += `• ${d.code}: ${d.desc}\n`;
      });
    } else {
      message += `✅ אין תקלות מאושרות\n`;
    }
    
    message += `\n${t('copy')}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    addLog('Shared to WhatsApp', 'success');
  }, [vehicleInfo, ecuList, kmRpt, dtcList, t, addLog]);

  // ─── SMART ALERTS ───
  const checkSmartAlerts = useCallback(() => {
    const newAlerts = [];
    
    const rollback = detectOdometerRollback();
    if (rollback && rollback.detected) {
      newAlerts.push({
        type: 'critical',
        title: 'זיהוי הורדת ק"מ',
        message: rollback.message,
        timestamp: new Date().toISOString()
      });
    }
    
    const engineTemp = liveData['05'];
    if (engineTemp && parseFloat(engineTemp) > 100) {
      newAlerts.push({
        type: 'warning',
        title: 'טמפרטורת מנוע גבוהה',
        message: `טמפרטורת מנוע: ${engineTemp}°C`,
        timestamp: new Date().toISOString()
      });
    }
    
    const batteryVoltage = liveData['42'];
    if (batteryVoltage && parseFloat(batteryVoltage) < 12.0) {
      newAlerts.push({
        type: 'warning',
        title: 'מתח סוללה נמוך',
        message: `מתח סוללה: ${batteryVoltage}V`,
        timestamp: new Date().toISOString()
      });
    }
    
    if (dtcList.length > 0) {
      newAlerts.push({
        type: 'error',
        title: 'תקלות מאושרות',
        message: `נמצאו ${dtcList.length} תקלות מאושרות`,
        timestamp: new Date().toISOString()
      });
    }
    
    if (dtcPending.length > 0) {
      newAlerts.push({
        type: 'info',
        title: 'תקלות ממתינות',
        message: `נמצאו ${dtcPending.length} תקלות ממתינות`,
        timestamp: new Date().toISOString()
      });
    }
    
    setAlerts(newAlerts);
    
    if (notificationsEnabled && newAlerts.length > 0) {
      newAlerts.forEach(alert => {
        if (Notification.permission === 'granted') {
          new Notification(alert.title, {
            body: alert.message,
            icon: '/icon.svg'
          });
        }
      });
    }
  }, [detectOdometerRollback, liveData, dtcList, dtcPending, notificationsEnabled]);

  // ─── LOAD SAVED DATA ON STARTUP ───
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('obdScanHistory');
      if (savedHistory) {
        setScanHistory(JSON.parse(savedHistory));
      }
      
      const savedVehiclesData = localStorage.getItem('obdSavedVehicles');
      if (savedVehiclesData) {
        setSavedVehicles(JSON.parse(savedVehiclesData));
      }
      
      const savedKmHistory = localStorage.getItem('obdKmHistory');
      if (savedKmHistory) {
        setKmHistory(JSON.parse(savedKmHistory));
      }
      
      const savedFavorites = localStorage.getItem('obdFavoriteECUs');
      if (savedFavorites) {
        setFavoriteECUs(JSON.parse(savedFavorites));
      }
      
      const savedSettings = localStorage.getItem('obdSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setAutoScanEnabled(settings.autoScanEnabled || false);
        setNotificationsEnabled(settings.notificationsEnabled !== false);
        setSimpleMode(settings.simpleMode || false);
        if (settings.customTheme) setCustomTheme(settings.customTheme);
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
  }, []);

  // ─── SAVE SETTINGS ───
  const saveSettings = useCallback(() => {
    const settings = {
      autoScanEnabled,
      notificationsEnabled,
      simpleMode,
      customTheme
    };
    
    try {
      localStorage.setItem('obdSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [autoScanEnabled, notificationsEnabled, simpleMode, customTheme]);

  // ─── SEND COMMAND ───
  const send = useCallback(async (cmd, timeout = 3000) => {
    return new Promise(async resolve => {
      // Clear any stale data from previous command before starting
      resBuf.current = '';
      resolveFn.current = null;
      // Small settle delay so late responses from prev command don't leak in
      await new Promise(r => setTimeout(r, 60));
      resBuf.current = '';
      let done = false;
      const finish = val => {
        if (done) return;
        done = true;
        resolveFn.current = null;
        
        // Log command results for debugging
        if (val && val !== 'TIMEOUT' && !val.includes('BUFFER_OVERFLOW')) {
          console.log(`Cmd: ${cmd} → ${val.substring(0, 50)}${val.length > 50 ? '...' : ''}`);
        } else if (val === 'TIMEOUT') {
          console.warn(`Cmd: ${cmd} → TIMEOUT`);
        }
        
        resolve(val);
      };
      const timer = setTimeout(() => {
        console.warn(`Timeout for command: ${cmd}`);
        finish(resBuf.current || 'TIMEOUT');
      }, timeout);
      resolveFn.current = d => {
        clearTimeout(timer);
        finish(d);
      };
      try {
        const bytes = new TextEncoder().encode(cmd + '\r');
        if (cmRef.current === 'demo') {
          setTimeout(() => {
            let r = demoResp(cmd);
            if (demoCleared.current) {
              const cu = cmd.trim().toUpperCase().replace(/\s/g, '');
              if (cu === '03') r = '43 00 00';
              if (cu === '07') r = '47 00 00';
              if (cu === '0101') r = '41 01 00 07 65 00';
              if (cu === '04') {
                demoCleared.current = false;
                r = '44';
              }
            }
            if (resolveFn.current) {
              resolveFn.current(r);
            }
          }, 40 + Math.random() * 80);
        } else if (cmRef.current === 'ble' && bleWrRef.current) {
          console.log(`Sending BLE command: ${cmd}`);
          const data = new TextEncoder().encode(cmd + '\r');
          for (let i = 0; i < data.length; i += 20) {
            const chunk = data.slice(i, Math.min(i + 20, data.length));
            try {
              if (bleWrRef.current.properties.writeWithoutResponse) {
                await bleWrRef.current.writeValueWithoutResponse(chunk);
              } else {
                await bleWrRef.current.writeValue(chunk);
              }
            } catch (writeErr) {
              console.error('BLE write error:', writeErr);
              finish('BLE_WRITE_ERROR');
              return;
            }
            if (i + 20 < data.length) await new Promise(r => setTimeout(r, 15));
          }
        } else if (cmRef.current === 'serial' && serialWrRef.current) {
          console.log(`Sending Serial command: ${cmd}`);
          await serialWrRef.current.write(bytes);
        } else if (cmRef.current === 'wifi' && wsRef.current && wsRef.current.readyState === 1) {
          console.log(`Sending WiFi command: ${cmd}`);
          wsRef.current.send(cmd + '\r');
        } else {
          console.error('Not connected or invalid connection method');
          finish('NOT CONNECTED');
        }
      } catch (e) {
        console.error('Send command error:', e);
        finish('ERROR: ' + e.message);
      }
    });
  }, []);
  const handleData = useCallback(txt => {
    resBuf.current += txt;
    const buf = resBuf.current;
    // SEARCHING... is intermediate - keep waiting for real data after it
    const trimmed = buf.replace(/[\r\n]/g, '').trim();
    if (/^SEARCHING\.*$/.test(trimmed)) return;
    // The '>' prompt is the definitive end of any ELM327 response
    if (buf.includes('>')) {
      let clean = buf.replace(/SEARCHING\.*/gi, '').replace(/[\r\n>]/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Log the response for debugging
      if (clean && clean.length > 0) {
        // Only log substantial responses to avoid noise
        if (clean.length > 5 || clean.includes('41') || clean.includes('62') || clean.includes('7E')) {
          console.log('ELM Response:', clean);
        }
      }
      
      if (resolveFn.current) {
        resolveFn.current(clean);
        resolveFn.current = null;
      } else {
        // Received data without pending command - might be async notification
        console.log('Unsolicited data:', clean);
      }
      resBuf.current = '';
    }
    
    // Timeout protection - if buffer gets too large without '>', clear it
    if (buf.length > 1000) {
      console.warn('Buffer overflow, clearing');
      resBuf.current = '';
      if (resolveFn.current) {
        resolveFn.current('BUFFER_OVERFLOW');
        resolveFn.current = null;
      }
    }
  }, []);

  // ─── BLE CONNECT ───
  const connBLE = useCallback(async () => {
    if (!navigator.bluetooth) {
      addLog('Web Bluetooth not supported', 'error');
      return false;
    }
    setCS('ing');
    setCI('Scanning BLE...');
    try {
      const svcList = BLE_PROFILES.map(p => p.svc);
      let dev;
      try {
        dev = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: svcList
        });
      } catch (e) {
        addLog('BLE cancelled', 'error');
        setCS('off');
        return false;
      }
      bleDevRef.current = dev;
      addLog('Connecting: ' + (dev.name || 'Unknown'));
      dev.addEventListener('gattserverdisconnected', () => {
        setCS('off');
        cmRef.current = null;
        addLog('BLE disconnected', 'error');
      });
      const srv = await dev.gatt.connect();
      let wc = null,
        nc = null;

      // Strategy 1: try known profiles
      for (const prof of BLE_PROFILES) {
        if (wc) break;
        try {
          const svc = await srv.getPrimaryService(prof.svc);
          addLog('Found service: ' + prof.svc.substring(4, 8));
          const chs = await svc.getCharacteristics();
          for (const ch of chs) {
            const uuid = ch.uuid.substring(4, 8);
            const p = ch.properties;
            addLog('  Char ' + uuid + ': ' + (p.write ? 'W ' : ' ') + (p.writeWithoutResponse ? 'WnR ' : ' ') + (p.notify ? 'N ' : ' ') + (p.indicate ? 'I' : ''));
            if (!nc && (p.notify || p.indicate)) {
              nc = ch;
            }
            if (!wc && (p.write || p.writeWithoutResponse)) {
              wc = ch;
            }
          }
        } catch (e) {}
      }

      // Strategy 2: greedy — try ALL services on device
      if (!wc) {
        addLog('Trying greedy discovery...');
        try {
          const allSvcs = await srv.getPrimaryServices();
          for (const svc of allSvcs) {
            addLog('Service: ' + svc.uuid.substring(4, 8));
            try {
              const chs = await svc.getCharacteristics();
              for (const ch of chs) {
                const p = ch.properties;
                addLog('  Char ' + ch.uuid.substring(4, 8) + ': ' + (p.write ? 'W ' : ' ') + (p.writeWithoutResponse ? 'WnR ' : ' ') + (p.notify ? 'N ' : ' ') + (p.indicate ? 'I' : ''));
                if (!nc && (p.notify || p.indicate)) {
                  nc = ch;
                }
                if (!wc && (p.write || p.writeWithoutResponse)) {
                  wc = ch;
                }
              }
            } catch (e) {}
          }
        } catch (e) {
          addLog('Greedy discovery failed: ' + e.message);
        }
      }
      if (!wc) {
        addLog('No write characteristic found! Try a different adapter.', 'error');
        setCS('off');
        return false;
      }

      // Subscribe to notifications
      if (nc) {
        try {
          await nc.startNotifications();
          nc.addEventListener('characteristicvaluechanged', e => handleData(new TextDecoder().decode(e.target.value)));
          addLog('Subscribed to notify: ' + nc.uuid.substring(4, 8), 'success');
        } catch (e) {
          addLog('Notify subscribe failed: ' + e.message);
        }
      }
      // If no dedicated notify, use write char for both (some adapters do this)
      if (!nc && wc) {
        try {
          if (wc.properties.notify || wc.properties.indicate) {
            await wc.startNotifications();
            wc.addEventListener('characteristicvaluechanged', e => handleData(new TextDecoder().decode(e.target.value)));
            addLog('Using write char for notify too');
          }
        } catch (e) {}
      }
      bleWrRef.current = wc;
      addLog('Write char: ' + wc.uuid.substring(4, 8) + ' ' + (wc.properties.writeWithoutResponse ? '(noResp)' : '(withResp)'), 'success');
      return true;
    } catch (e) {
      addLog('BLE error: ' + e.message, 'error');
      setCS('off');
      return false;
    }
  }, [addLog, handleData]);

  // ─── SERIAL CONNECT ───
  const connSerial = useCallback(async () => {
    if (!navigator.serial) {
      addLog('Web Serial not supported', 'error');
      return false;
    }
    setCS('ing');
    setCI('Select USB port...');
    try {
      const port = await navigator.serial.requestPort();
      await port.open({
        baudRate: parseInt(baud)
      });
      serialPortRef.current = port;
      serialWrRef.current = port.writable.getWriter();
      const rdr = port.readable.getReader();
      serialRdRef.current = rdr;
      (async () => {
        try {
          while (true) {
            const {
              value,
              done
            } = await rdr.read();
            if (done) break;
            handleData(new TextDecoder().decode(value));
          }
        } catch (e) {}
      })();
      return true;
    } catch (e) {
      addLog('Serial error: ' + e.message, 'error');
      setCS('off');
      return false;
    }
  }, [baud, addLog, handleData]);

  // ─── WIFI CONNECT ───
  const connWiFi = useCallback(async () => {
    setCS('ing');
    setCI(`WiFi ${wifiH}:${wifiP}...`);
    try {
      const ws = new WebSocket(`ws://${wifiH}:${wifiP}`);
      wsRef.current = ws;
      return new Promise(resolve => {
        ws.onopen = () => {
          addLog('WiFi connected');
          resolve(true);
        };
        ws.onmessage = e => handleData(e.data);
        ws.onerror = () => {
          addLog('WiFi error - needs WebSocket proxy', 'error');
          setCS('off');
          resolve(false);
        };
        ws.onclose = () => {
          setCS('off');
          cmRef.current = null;
        };
        setTimeout(() => {
          if (ws.readyState !== 1) {
            ws.close();
            resolve(false);
          }
        }, 5000);
      });
    } catch (e) {
      addLog('WiFi: ' + e.message, 'error');
      setCS('off');
      return false;
    }
  }, [wifiH, wifiP, addLog, handleData]);

  // ─── INIT ELM327 ───
  const initELM = useCallback(async () => {
    setCI('Initializing...');
    const atz = await send('ATZ', 8000);
    addLog('ATZ → ' + atz);
    await new Promise(r => setTimeout(r, 1200));
    await send('ATE0', 3000);
    await send('ATE0', 3000);
    await send('ATL0', 2000);
    await send('ATH0', 2000);
    await send('ATS0', 2000);
    await send('ATCAF1', 2000); // Auto formatting ON
    const ver = await send('ATI', 3000);
    addLog('Version: ' + ver);
    const volt = await send('ATRV', 3000);
    if (volt && /[0-9]/.test(volt)) setVI(p => ({
      ...p,
      batt: volt.replace('V', '').trim()
    }));

    // Try protocols one by one - most common first
    const protocols = [{
      n: '6',
      d: 'CAN 11bit 500k',
      to: 7000
    }, {
      n: '7',
      d: 'CAN 29bit 500k',
      to: 7000
    }, {
      n: '8',
      d: 'CAN 11bit 250k',
      to: 7000
    }, {
      n: '9',
      d: 'CAN 29bit 250k',
      to: 7000
    }, {
      n: '5',
      d: 'KWP2000 fast',
      to: 10000
    }, {
      n: '4',
      d: 'ISO9141-2',
      to: 12000
    },
    // Nissan Micra, old Japanese - SLOW init
    {
      n: '3',
      d: 'KWP2000 5baud',
      to: 12000
    }, {
      n: '1',
      d: 'J1850 PWM',
      to: 8000
    }, {
      n: '2',
      d: 'J1850 VPW',
      to: 8000
    }];
    setCI('Detecting protocol...');
    let connected = false,
      goodTest = '';
    for (const proto of protocols) {
      if (connected) break;
      setCI('Trying ' + proto.d + '...');
      addLog('Trying protocol ' + proto.n + ' (' + proto.d + ')');
      await send('ATSP' + proto.n, 2000);
      // For slow ISO protocols, set slow init timing
      if (proto.n === '4' || proto.n === '3') {
        await send('ATIB10', 1500);
        await send('ATSW00', 1500);
      }
      // First attempt triggers bus init - can be slow on ISO
      let test = await send('0100', proto.to);
      addLog('  0100 → ' + test);
      // ISO protocols often need a second try after bus init
      if ((!test || !test.replace(/\s/g, '').includes('4100')) && (proto.n === '4' || proto.n === '3' || proto.n === '5')) {
        await new Promise(r => setTimeout(r, 500));
        test = await send('0100', proto.to);
        addLog('  0100 retry → ' + test);
      }
      if (test && test.replace(/\s/g, '').includes('4100')) {
        connected = true;
        goodTest = test;
        addLog('✅ Protocol ' + proto.n + ' works! (' + proto.d + ')', 'success');
        setVI(p => ({
          ...p,
          proto: proto.d
        }));
      }
    }
    if (!connected) {
      // Last resort: auto mode with long wait
      addLog('Trying AUTO protocol...');
      await send('ATSP0', 2000);
      const test = await send('0100', 15000);
      addLog('  AUTO 0100 → ' + test);
      if (test && test.replace(/\s/g, '').includes('4100')) {
        connected = true;
        goodTest = test;
        const dp = await send('ATDP', 2000);
        setVI(p => ({
          ...p,
          proto: dp
        }));
        addLog('✅ AUTO works: ' + dp, 'success');
      }
    }
    if (connected) {
      addLog('Vehicle connected!', 'success');
      const hx = goodTest.replace(/\s/g, '').replace(/.*4100/, '');
      const sp = [];
      for (let i = 0; i < hx.length && i < 8; i += 2) {
        const bt = parseInt(hx.substring(i, i + 2), 16);
        if (!isNaN(bt)) {
          for (let bit = 7; bit >= 0; bit--) {
            if (bt & 1 << bit) sp.push((i / 2 * 8 + (7 - bit) + 1).toString(16).toUpperCase().padStart(2, '0'));
          }
        }
      }
      setSP(sp);
      setVI(p => ({
        ...p,
        vehicleOk: true
      }));
    } else {
      addLog('⚠️ No protocol worked. Car may use non-standard protocol, or adapter incompatible.', 'error');
      addLog('Try: engine running, adapter pushed in fully, different adapter.', 'error');
      setVI(p => ({
        ...p,
        vehicleOk: false
      }));
    }
    setCS('on');
    setCI(connected ? 'Connected ✓' : 'Connected (no vehicle data)');
    addLog('Init complete!', 'success');
    setTab('dash');
  }, [send, addLog]);

  // ─── READ ODOMETER FROM ECU ───
  const readOdometerFromECU = useCallback(async (ecu) => {
    const odometerCommands = [
      '22 02 00',  // Standard UDS odometer
      '22 F0 10',  // Alternative odometer
      '22 F0 11',  // Odometer 2
      '22 F0 12',  // Odometer 3
      '22 F0 20',  // Distance total
      '22 F0 21',  // Distance trip
      '22 F0 22',  // Distance service
      '22 F1 D0',  // Vehicle mileage
      '21 01',     // Alternative read
      '21 02',     // Alternative read 2
      '2E 21 01',  // Write/read alternative
      '2F 03 01',  // Alternative read/write
    ];

    addLog(`Trying to read odometer from ${ecu.n}...`);
    
    for (const cmd of odometerCommands) {
      try {
        const response = await send(cmd, 3000);
        if (response && !response.includes('NO DATA') && !response.includes('ERROR') && !response.includes('7F')) {
          const clean = response.replace(/\s/g, '').toUpperCase();
          
          // Try to extract odometer value from various response formats
          let km = null;
          
          // Format: 62 XX XX [data]
          if (clean.includes('62')) {
            const dataStart = clean.indexOf('62') + 6;
            const dataHex = clean.substring(dataStart);
            
            // Try different parsing methods
            for (let len of [8, 6, 4, 2]) {
              if (dataHex.length >= len) {
                const hexPart = dataHex.substring(0, len);
                let value = 0;
                for (let i = 0; i < hexPart.length; i += 2) {
                  value = value << 8 | parseInt(hexPart.substring(i, i + 2), 16);
                }
                
                // Check if value is reasonable for odometer (0-2,000,000 km)
                if (value > 0 && value < 2000000) {
                  km = value;
                  addLog(`Odometer found in ${ecu.n}: ${km} km (cmd: ${cmd})`, 'success');
                  return km;
                }
              }
            }
          }
          
          // Format: 61 01 [data] (alternative format)
          if (clean.includes('61')) {
            const dataStart = clean.indexOf('61') + 4;
            const dataHex = clean.substring(dataStart);
            
            for (let len of [8, 6, 4, 2]) {
              if (dataHex.length >= len) {
                const hexPart = dataHex.substring(0, len);
                let value = 0;
                for (let i = 0; i < hexPart.length; i += 2) {
                  value = value << 8 | parseInt(hexPart.substring(i, i + 2), 16);
                }
                
                if (value > 0 && value < 2000000) {
                  km = value;
                  addLog(`Odometer found in ${ecu.n}: ${km} km (cmd: ${cmd})`, 'success');
                  return km;
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn(`Error reading odometer with command ${cmd}:`, e);
      }
    }
    
    addLog(`No odometer found in ${ecu.n}`, 'warning');
    return null;
  }, [send, addLog]);

  // ─── AUTO SCAN ADDRESSES ───
  const autoScanAddresses = useCallback(async () => {
    addLog('Starting automatic address scan...');
    const found = [];
    
    // Common address ranges to scan
    const addressRanges = [
      { start: 0x700, end: 0x7FF },  // Standard ECU range
      { start: 0x600, end: 0x6FF },  // Alternative range
      { start: 0x100, end: 0x1FF },  // Extended range
    ];
    
    for (const range of addressRanges) {
      addLog(`Scanning range ${range.start.toString(16).toUpperCase()}-${range.end.toString(16).toUpperCase()}...`);
      
      for (let addr = range.start; addr <= range.end; addr++) {
        const addrHex = addr.toString(16).toUpperCase().padStart(3, '0');
        const respHex = (addr + 8).toString(16).toUpperCase().padStart(3, '0');
        
        try {
          await send('AT SH ' + addrHex, 500);
          await send('AT CRA ' + respHex, 500);
          
          const r = await send('3E 00', 1000);
          const clean = (r || '').replace(/\s/g, '').toUpperCase();
          
          if (clean.length > 4 && 
              (clean.includes('7E') || clean.includes(respHex.substring(0,2)) || 
               (clean.startsWith('7F') && clean.length > 6) ||
               (clean.startsWith('62') || clean.startsWith('50') || clean.startsWith('60'))) &&
              !clean.includes('NODATA') && !clean.includes('ERROR') && !clean.includes('TIMEOUT')) {
            
            found.push({
              a: addrHex,
              r: respHex,
              n: 'ECU ' + addrHex,
              h: 'מחשב ' + addrHex,
              ic: '🔧',
              ok: true,
              raw: r,
              autoFound: true
            });
            
            addLog(`Auto-found ECU at ${addrHex}`, 'success');
          }
        } catch (e) {
          // Continue to next address
        }
      }
    }
    
    // Reset to default address
    await send('ATH0', 1000);
    await send('AT SH 7DF', 1000);
    await send('AT CRA', 1000);
    
    addLog(`Auto-scan found ${found.length} additional ECUs`, 'success');
    return found;
  }, [send, addLog]);

  // ─── CONNECT MAIN ───
  const doConnect = useCallback(async method => {
    setCM(method);
    cmRef.current = method;
    let ok = false;
    if (method === 'ble') ok = await connBLE();else if (method === 'serial') ok = await connSerial();else if (method === 'wifi') ok = await connWiFi();else if (method === 'demo') {
      ok = true;
      setCS('ing');
    }
    if (ok) await initELM();else {
      setCM(null);
      cmRef.current = null;
    }
  }, [connBLE, connSerial, connWiFi, initELM]);
  const doDisconnect = useCallback(async () => {
    stopMon();
    try {
      if (bleDevRef.current?.gatt?.connected) bleDevRef.current.gatt.disconnect();
      if (serialRdRef.current) {
        await serialRdRef.current.cancel();
      }
      if (serialWrRef.current) {
        await serialWrRef.current.close();
      }
      if (serialPortRef.current) {
        await serialPortRef.current.close();
      }
      if (wsRef.current) wsRef.current.close();
    } catch (e) {}
    setCS('off');
    setCM(null);
    cmRef.current = null;
    setLD({});
    addLog('Disconnected');
  }, [addLog]);

  // ─── READ PID ───
  const readPID = useCallback(async pid => {
    const resp = await send('01 ' + pid, 4000);
    if (!resp || resp.includes('NO DATA') || resp.includes('STOPPED') || resp.includes('ERROR') || resp.includes('SEARCHING') || resp.includes('UNABLE') || resp.includes('TIMEOUT')) return null;
    const cl = resp.replace(/\s/g, '').toUpperCase();
    // Find "41"+pid anywhere in response (handles headers like 7E8064105...)
    const idx = cl.indexOf('41' + pid.toUpperCase());
    if (idx < 0) return null;
    const p = PIDS[pid];
    if (!p) return null;
    const bs = [];
    for (let i = 0; i < p.b; i++) {
      const h = cl.substring(idx + 4 + i * 2, idx + 4 + i * 2 + 2);
      if (h.length < 2) return null;
      bs.push(parseInt(h, 16));
    }
    if (bs.some(isNaN)) return null;
    try {
      return p.f(...bs);
    } catch {
      return null;
    }
  }, [send]);

  // ─── MONITOR ───
  const startMon = useCallback(() => {
    const pr = PRESETS[preset];
    if (!pr) return;
    setMon(true);
    setGD([]);
    addLog('Monitor: ' + pr.n);
    let idx = 0;
    let busy = false;
    // Sequential polling - don't overlap requests (BLE can't handle parallel)
    monRef.current = setInterval(async () => {
      if (busy) return;
      busy = true;
      const pid = pr.p[idx % pr.p.length];
      const v = await readPID(pid);
      if (v !== null) setLD(p => ({
        ...p,
        [pid]: parseFloat(v) || v
      }));
      idx++;
      busy = false;
    }, Math.max(pr.ms / pr.p.length, 300));
  }, [preset, readPID, addLog]);
  const stopMon = useCallback(() => {
    if (monRef.current) clearInterval(monRef.current);
    monRef.current = null;
    setMon(false);
  }, []);

  // ─── GRAPH ───
  useEffect(() => {
    if (monitoring && liveData[graphPid] !== undefined) setGD(p => {
      const n = [...p, {
        x: p.length,
        v: parseFloat(liveData[graphPid]) || 0
      }];
      return n.length > 60 ? n.slice(-60) : n;
    });
  }, [monitoring, liveData, graphPid]);

  // ─── READINESS ───
  const readReady = useCallback(async () => {
    const r = await send('01 01', 3000);
    if (!r || !r.includes('41 01')) return;
    const cl = r.replace(/\s/g, '');
    const idx = cl.indexOf('4101');
    const bs = [];
    for (let i = idx + 4; i < cl.length && bs.length < 4; i += 2) bs.push(parseInt(cl.substring(i, i + 2), 16));
    if (bs.length < 4) return;
    const mons = [{
      s: bs[1] & 0x01,
      c: !(bs[1] & 0x10)
    }, {
      s: bs[1] & 0x02,
      c: !(bs[1] & 0x20)
    }, {
      s: bs[1] & 0x04,
      c: !(bs[1] & 0x40)
    }, {
      s: bs[2] & 0x01,
      c: !(bs[3] & 0x01)
    }, {
      s: bs[2] & 0x02,
      c: !(bs[3] & 0x02)
    }, {
      s: bs[2] & 0x04,
      c: !(bs[3] & 0x04)
    }, {
      s: bs[2] & 0x08,
      c: !(bs[3] & 0x08)
    }, {
      s: bs[2] & 0x20,
      c: !(bs[3] & 0x20)
    }, {
      s: bs[2] & 0x40,
      c: !(bs[3] & 0x40)
    }];
    setRD({
      mil: !!(bs[0] & 0x80),
      n: bs[0] & 0x7F,
      mons
    });
    addLog('Readiness done', 'success');
  }, [send, addLog]);

  // ─── READ DTCs ───
  const readDTCs = useCallback(async () => {
    setLo(true);
    addLog('Reading DTCs...');
    const milR = await send('01 01', 3000);
    if (milR && milR.includes('41 01')) {
      const hx = milR.replace(/\s/g, '').replace(/.*4101/, '');
      const b = parseInt(hx.substring(0, 2), 16);
      setVI(p => ({
        ...p,
        milOn: !!(b & 0x80),
        dtcN: b & 0x7F
      }));
    }
    const r3 = await send('03', 5000);
    addLog('Mode 03: ' + r3);
    setDL(parseDTCResp(r3, '43'));
    const r7 = await send('07', 5000);
    addLog('Mode 07: ' + r7);
    setDP(parseDTCResp(r7, '47'));
    await readReady();
    setLo(false);
  }, [send, addLog, readReady]);
  function parseDTCResp(resp, pfx) {
    if (!resp || resp.includes('NO DATA')) return [];
    const cl = resp.replace(/\s/g, '');
    const idx = cl.indexOf(pfx);
    let d = idx >= 0 ? cl.substring(idx + 2) : cl;
    const codes = [];
    for (let i = 0; i < d.length - 3; i += 4) {
      const h = d.substring(i, i + 4);
      if (h === '0000') continue;
      const dtc = parseDTC(h);
      if (dtc) codes.push(dtc);
    }
    return codes;
  }
  const clearDTCs = useCallback(async () => {
    setLo(true);
    if (cmRef.current === 'demo') demoCleared.current = true;
    const r = await send('04', 5000);
    addLog('Mode 04: ' + r);
    if (r && (r.includes('44') || r.includes('OK'))) {
      addLog('DTCs cleared!', 'success');
      setDL([]);
      setDP([]);
      setVI(p => ({
        ...p,
        milOn: false,
        dtcN: 0
      }));
      setRD(null);
      setFD(null);
      await new Promise(res => setTimeout(res, 500));
      addLog('Re-scanning...');
      await readDTCs();
      await readReady();
    }
    setLo(false);
  }, [send, addLog, readDTCs, readReady]);

  // ─── FREEZE FRAME ───
  const readFreeze = useCallback(async () => {
    const ff = {};
    const dr = await send('02 02', 2000);
    if (dr && !dr.includes('NO DATA')) {
      const cl = dr.replace(/\s/g, '');
      const di = cl.indexOf('4202');
      if (di >= 0) {
        const dtc = parseDTC(cl.substring(di + 4, di + 8));
        if (dtc) ff.trigger = dtc;
      }
    }
    for (const pid of ['04', '05', '06', '07', '0C', '0D', '0F', '11']) {
      const resp = await send('02 ' + pid, 2000);
      if (resp && !resp.includes('NO DATA')) {
        const cl = resp.replace(/\s/g, '');
        const px = '42' + pid.toUpperCase();
        const pi = cl.indexOf(px);
        if (pi >= 0) {
          const p = PIDS[pid];
          if (p) {
            const bs = [];
            const dh = cl.substring(pi + px.length);
            for (let j = 0; j < p.b * 2 && j < dh.length; j += 2) bs.push(parseInt(dh.substring(j, j + 2), 16));
            if (!bs.some(isNaN)) try {
              ff[pid] = {
                n: p.h || p.n,
                v: p.f(...bs),
                u: p.u
              };
            } catch {}
          }
        }
      }
    }
    setFD(ff);
    addLog('Freeze frame done', 'success');
  }, [send, addLog]);

  // ─── ODOMETER INVESTIGATOR ───
  // Addresses to probe (standard + Toyota/Lexus + Nissan specific)
  const ODO_ADDRESSES = [{
    a: '7E0',
    r: '7E8',
    n: 'ECM Engine'
  }, {
    a: '7E1',
    r: '7E9',
    n: 'TCM Trans'
  }, {
    a: '7E2',
    r: '7EA',
    n: 'ECU 3'
  }, {
    a: '7C0',
    r: '7C8',
    n: 'IC Cluster (Toyota)'
  }, {
    a: '7C4',
    r: '7CC',
    n: 'Head Unit'
  }, {
    a: '720',
    r: '728',
    n: 'BCM Body'
  }, {
    a: '740',
    r: '748',
    n: 'IC Instrument'
  }, {
    a: '760',
    r: '768',
    n: 'Cluster Alt'
  }, {
    a: '7B0',
    r: '7B8',
    n: 'Meter (Nissan)'
  }, {
    a: '7C6',
    r: '7CE',
    n: 'Combination Meter'
  }, {
    a: '750',
    r: '758',
    n: 'ABS'
  }, {
    a: '7D0',
    r: '7D8',
    n: 'Cluster D0'
  }, {
    a: '7E6',
    r: '7EE',
    n: 'Meter E6'
  }, {
    a: '7DF',
    r: '',
    n: 'Broadcast'
  }];
  // Commands known to return odometer across manufacturers
  const ODO_COMMANDS = ['22 F1 A6', '22 F1 90', '22 02 00', '22 F0 10', '22 DD 01', '22 DD 04', '22 DD 05', '21 01', '21 02', '21 06', '21 0E', '21 81', '22 F1 91', '22 01 21', '22 24 21', '22 F4 5E', '22 B0 01', '22 20 03', '22 30 06', '01 A6', '22 F1 9C', '22 F1 A2'];
  const investigateOdometer = useCallback(async () => {
    setOScan(true);
    setOResults([]);
    setORaw([]);
    addLog('🔍 Odometer investigation starting...', 'success');
    const results = [];
    const rawLog = [];
    const knownKm = parseInt(odoKnownKm) || 0;
    // Precompute hex fingerprints to search for
    const fingerprints = [];
    if (knownKm > 0) {
      fingerprints.push({
        label: 'raw',
        hex: knownKm.toString(16).toUpperCase().padStart(6, '0')
      });
      fingerprints.push({
        label: 'x10',
        hex: (knownKm * 10).toString(16).toUpperCase().padStart(6, '0')
      });
      fingerprints.push({
        label: 'x100',
        hex: (knownKm * 100).toString(16).toUpperCase().padStart(8, '0')
      });
      fingerprints.push({
        label: 'miles',
        hex: Math.round(knownKm / 1.609).toString(16).toUpperCase().padStart(6, '0')
      });
      fingerprints.push({
        label: 'x2',
        hex: (knownKm * 2).toString(16).toUpperCase().padStart(6, '0')
      });
    }
    await send('ATH1', 1500); // headers ON to see responses

    for (let i = 0; i < ODO_ADDRESSES.length; i++) {
      const ecu = ODO_ADDRESSES[i];
      setOProg(`${ecu.n} (${i + 1}/${ODO_ADDRESSES.length})`);
      await send('AT SH ' + ecu.a, 1000);
      if (ecu.r) await send('AT CRA ' + ecu.r, 1000);else await send('AT CRA', 1000);
      // Enter diagnostic session first
      await send('10 03', 1500);
      for (const cmd of ODO_COMMANDS) {
        const resp = await send(cmd, 2500);
        if (!resp || resp.includes('NO DATA') || resp.includes('TIMEOUT') || resp.includes('ERROR') || resp.includes('STOPPED') || resp.includes('UNABLE') || resp === '?' || resp.includes('7F')) continue;
        const clean = resp.replace(/\s/g, '').toUpperCase();
        if (clean.length < 6) continue;
        // Log every real response
        rawLog.push({
          ecu: ecu.n,
          addr: ecu.a,
          cmd,
          resp: clean
        });
        // Check fingerprints
        let match = null;
        for (const fp of fingerprints) {
          if (clean.includes(fp.hex)) {
            match = fp.label;
            break;
          }
        }
        // Also try to decode any 3-4 byte value as potential km
        const decoded = [];
        for (let j = 0; j < clean.length - 5; j += 2) {
          const v3 = parseInt(clean.substring(j, j + 6), 16);
          if (v3 > 10000 && v3 < 3000000) decoded.push({
            raw: v3,
            km: v3
          });
          const v4 = parseInt(clean.substring(j, j + 8), 16);
          if (v4 > 100000 && v4 < 30000000) decoded.push({
            raw: v4,
            km: Math.round(v4 / 10)
          });
        }
        results.push({
          ecu: ecu.n,
          addr: ecu.a,
          cmd,
          resp: clean,
          match,
          decoded: decoded.slice(0, 3)
        });
        if (match) addLog(`✅✅ MATCH! ${ecu.n} ${cmd} = ${match}`, 'success');
      }
    }
    await send('ATH0', 1000);
    await send('AT SH 7DF', 1000);
    await send('AT CRA', 1000);
    setOResults(results);
    setORaw(rawLog);
    setOProg('');
    setOScan(false);
    addLog(`Investigation done! ${results.length} responses, ${results.filter(r => r.match).length} matches`, 'success');
  }, [send, addLog, odoKnownKm]);

  // ─── ECU SCAN ───
  const scanECUs = useCallback(async () => {
    setES(true);
    setEL([]);
    setKR([]);
    setSE(null);
    addLog('ECU scan starting...');
    const found = [];
    // Turn headers ON to see which ECU responds
    await send('ATH1', 1500);
    for (let i = 0; i < ECUS.length; i++) {
      const ecu = ECUS[i];
      setEP(`${ecu.ic} ${ecu.h || ecu.n} (${i + 1}/${ECUS.length})`);
      await send('AT SH ' + ecu.a, 1000);
      await send('AT CRA ' + ecu.r, 1000);
      
      // Try multiple commands to increase detection chance
      let r = await send('3E 00', 3000); // Tester present
      
      // If no response, try alternative commands
      if (!r || r.includes('NO DATA') || r.includes('ERROR') || r.includes('TIMEOUT')) {
        addLog(`Trying alternative command for ${ecu.n}...`);
        r = await send('10 01', 2000); // Diagnostic session control
      }
      
      const isDemo = cmRef.current === 'demo';
      // Improved response validation - more lenient but still accurate
      const clean = (r || '').replace(/\s/g, '').toUpperCase();
      const validResp = clean.length > 4 && 
                        (clean.includes('7E') || clean.includes(ecu.r.substring(0,2)) || 
                         (clean.startsWith('7F') && clean.length > 6) ||
                         (clean.startsWith('62') || clean.startsWith('50') || clean.startsWith('60'))) &&
                        !clean.includes('NODATA') && 
                        !clean.includes('ERROR') && 
                        !clean.includes('TIMEOUT') && 
                        !clean.includes('STOPPED') && 
                        !clean.includes('UNABLE') && 
                        !clean.includes('?');
      
      const ok = isDemo ? DEMO_ACTIVE.has(ecu.a) : validResp;
      found.push({
        ...ecu,
        ok,
        raw: r || ''
      });
      if (ok) addLog('Found: ' + ecu.n + ' → ' + r, 'success');
      else addLog(`No response from ${ecu.n}`, 'warning');
    }
    
    // If no ECUs found, try auto-scan
    if (found.filter(e => e.ok).length === 0) {
      addLog('No standard ECUs found, trying auto-scan...', 'warning');
      const autoFound = await autoScanAddresses();
      found.push(...autoFound);
    }
    
    // Reset headers and address
    await send('ATH0', 1000);
    await send('AT SH 7DF', 1000);
    await send('AT CRA', 1000);
    setEL(found);
    setEP('');
    setES(false);
    addLog(`Scan done! ${found.filter(e => e.ok).length} active`, 'success');
  }, [send, addLog, autoScanAddresses]);
  const readECUDet = useCallback(async ecu => {
    setSE(ecu);
    setLo(true);
    addLog(`Reading details from ${ecu.n}...`);
    await send('AT SH ' + ecu.a, 1000);
    await send('AT CRA ' + ecu.r, 1000);
    
    // Try to enter diagnostic session with extended timeout
    const sessionResp = await send('10 03', 3000);
    if (!sessionResp || sessionResp.includes('ERROR')) {
      addLog('Extended diagnostic session failed, trying default session', 'warning');
      await send('10 01', 2000);
    }
    
    const det = {
      dtcs: []
    };
    
    // First, try to read odometer using the specialized function
    const odometerKm = await readOdometerFromECU(ecu);
    if (odometerKm !== null) {
      det['odometer'] = odometerKm + ' km';
      addLog(`✅ Odometer in ${ecu.n}: ${odometerKm} km`, 'success');
    }
    
    // Then read other DIDs (limit to critical ones to save time)
    const criticalDIDs = UDS_DIDS.filter(did => did.crit);
    for (const did of criticalDIDs) {
      if (did.d === '0200' || did.d === 'F010') continue; // Skip odometer, already read
      
      const cmd = '22 ' + did.d.substring(0, 2) + ' ' + did.d.substring(2);
      const r = await send(cmd, 3000);
      
      if (r && !r.includes('NO DATA') && !r.includes('ERROR') && !r.includes('7F 22')) {
        const cl = r.replace(/\s/g, '');
        const px = '62' + did.d.toUpperCase();
        const idx = cl.indexOf(px);
        if (idx >= 0) {
          const dh = cl.substring(idx + px.length);
          let asc = '';
          for (let j = 0; j < dh.length; j += 2) {
            const ch = parseInt(dh.substring(j, j + 2), 16);
            if (ch >= 32 && ch <= 126) asc += String.fromCharCode(ch);
          }
          det[did.d] = asc.length >= 2 ? asc : dh;
          if (asc.length >= 2) addLog(`Data from ${did.d}: ${asc}`);
        }
      }
    }
    
    // Read DTCs with multiple attempts
    addLog('Reading DTCs...');
    const dtcR = await send('19 02 FF', 4000);
    
    if (dtcR && !dtcR.includes('NO DATA') && !dtcR.includes('7F 19')) {
      const cl = dtcR.replace(/\s/g, '');
      const di = cl.indexOf('5902');
      if (di >= 0) {
        const dd = cl.substring(di + 6);
        for (let j = 0; j < dd.length - 5; j += 6) {
          const ch = dd.substring(j, j + 4);
          if (ch !== '0000') {
            const dtc = parseDTC(ch);
            if (dtc) {
              det.dtcs.push(dtc);
              addLog(`Found DTC: ${dtc.code} - ${dtc.desc}`, 'warning');
            }
          }
        }
      }
    } else {
      addLog('No DTCs found or read failed', 'info');
    }
    
    setED(p => ({
      ...p,
      [ecu.a]: det
    }));
    await send('AT SH 7DF', 1000);
    setLo(false);
    addLog(`Finished reading ${ecu.n}`, 'success');
  }, [send, readOdometerFromECU]);
  const fullReport = useCallback(async () => {
    setES(true);
    const active = ecuList.filter(e => e.ok);
    const kms = [];
    for (let i = 0; i < active.length; i++) {
      setEP(`Reading ${active[i].n} (${i + 1}/${active.length})`);
      await readECUDet(active[i]);
      const d = ecuDet[active[i].a];
      if (d) {
        // Try new odometer field first, then fall back to old fields
        const km = d['odometer'] || d['0200'] || d['F010'];
        if (km) kms.push({
          name: active[i].h || active[i].n,
          km: parseInt(km) || km
        });
      }
    }
    setKR(kms);
    setEP('');
    setES(false);
    
    // Save scan history after full report
    saveScanHistory({
      type: 'manual',
      timestamp: new Date().toISOString()
    });
    
    // Check for smart alerts
    checkSmartAlerts();
  }, [ecuList, readECUDet, ecuDet, saveScanHistory, checkSmartAlerts]);

  // ─── VEHICLE INFO ───
  const readVeh = useCallback(async () => {
    setLo(true);
    addLog('Reading vehicle info...');
    
    // Read VIN with multiple attempts
    let vinR = await send('09 02', 5000);
    if (!vinR || vinR.includes('NO DATA') || vinR.includes('ERROR')) {
      addLog('First VIN read failed, trying alternative...', 'warning');
      vinR = await send('09 02', 5000); // Retry
    }
    
    if (vinR && !vinR.includes('NO DATA') && !vinR.includes('ERROR')) {
      const hx = vinR.replace(/\s/g, '').replace(/.*4902\d*/, '');
      let vin = '';
      for (let i = 0; i < hx.length; i += 2) {
        const c = parseInt(hx.substring(i, i + 2), 16);
        if (c >= 32 && c <= 126) vin += String.fromCharCode(c);
      }
      if (vin.length >= 10) {
        setVI(p => ({
          ...p,
          vin
        }));
        addLog('VIN: ' + vin, 'success');
        
        // Decode VIN and get additional info
        const decodedVIN = decodeVIN(vin);
        if (decodedVIN) {
          addLog(`VIN decoded: ${decodedVIN.country}, ${decodedVIN.year}`, 'info');
          setVI(p => ({
            ...p,
            country: decodedVIN.country,
            year: decodedVIN.year
          }));
        }
        
        // Try to get additional vehicle info from API
        const vehicleInfo = await getVehicleInfoFromVIN(vin);
        if (vehicleInfo) {
          setVI(p => ({
            ...p,
            ...vehicleInfo
          }));
        }
      } else {
        addLog('VIN too short or invalid', 'warning');
      }
    } else {
      addLog('Could not read VIN', 'error');
    }
    
    // Read OBD standard
    const obdR = await send('01 1C', 3000);
    if (obdR && obdR.includes('41 1C')) {
      const std = parseInt(obdR.replace(/\s/g, '').replace(/.*411C/, '').substring(0, 2), 16);
      const stds = {
        1: 'OBD-II CARB',
        2: 'OBD EPA',
        3: 'OBD+OBD-II',
        6: 'EOBD',
        7: 'EOBD+OBD-II'
      };
      setVI(p => ({
        ...p,
        obdStd: stds[std] || 'Std ' + std
      }));
      addLog('OBD Standard: ' + (stds[std] || 'Std ' + std), 'success');
    } else {
      addLog('Could not read OBD standard', 'warning');
    }
    
    setLo(false);
    addLog('Vehicle info read complete', 'success');
  }, [send, decodeVIN, getVehicleInfoFromVIN, addLog]);
  const [showReport, setSR2] = useState(false);

  // ─── PRINT — show in-app report ───
  const doPrint = useCallback(() => setSR2(true), []);
  const reportHTML = useCallback(() => {
    let h = '🔧 OBD SCANNER PRO REPORT\n' + t('aboutTxt') + '\n' + new Date().toLocaleString() + '\n══════════════════════\n';
    if (vehicleInfo.vin) h += 'VIN: ' + vehicleInfo.vin + '\n';
    if (vehicleInfo.proto) h += 'Protocol: ' + vehicleInfo.proto + '\n';
    if (vehicleInfo.batt) h += 'Battery: ' + vehicleInfo.batt + 'V\n';
    h += '\n';
    if (dtcList.length) {
      h += '❌ ' + t('confirmed') + ' (' + dtcList.length + '):\n';
      dtcList.forEach(d => h += '  • ' + d.code + ': ' + d.desc + '\n');
    } else h += '✅ ' + t('noDtc') + '\n';
    if (dtcPending.length) {
      h += '\n⚠️ ' + t('pending') + ' (' + dtcPending.length + '):\n';
      dtcPending.forEach(d => h += '  • ' + d.code + ': ' + d.desc + '\n');
    }
    if (readyData) {
      const mn = t('monNames');
      h += '\n' + t('readiness') + ':\n';
      readyData.mons.forEach((m, i) => {
        if (m.s) h += '  ' + (m.c ? '✅' : '❌') + ' ' + mn[i] + '\n';
      });
    }
    if (ecuList.filter(e => e.ok).length) {
      h += '\nECU SCAN:\n';
      ecuList.forEach(e => h += '  ' + (e.ok ? '✅' : '—') + ' ' + e.n + ' (' + e.a + ')\n');
    }
    if (kmRpt.length > 1) {
      h += '\n' + t('kmComp') + ':\n';
      kmRpt.forEach(r => h += '  ' + r.name + ': ' + r.km + '\n');
    }
    h += '\n══════════════════════\n' + t('copy') + '\n' + t('warn');
    return h;
  }, [t, vehicleInfo, dtcList, dtcPending, readyData, ecuList, kmRpt]);

  // ─── SHARE ───
  const doShare = useCallback(() => {
    let m = '🔧 *OBD Scanner Pro*\n' + new Date().toLocaleString() + '\n';
    if (vehicleInfo.vin) m += `\n🚗 VIN: ${vehicleInfo.vin}`;
    if (dtcList.length) {
      m += `\n\n❌ *${t('confirmed')} (${dtcList.length}):*`;
      dtcList.forEach(d => m += `\n• ${d.code}: ${d.desc}`);
    } else m += `\n\n✅ ${t('noDtc')}`;
    m += `\n\n${t('copy')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(m)}`, '_blank');
  }, [vehicleInfo, dtcList, t]);

  // ─── TERMINAL ───
  const termSend = useCallback(async () => {
    if (!termCmd.trim()) return;
    const cmd = termCmd.trim();
    setTH(p => [...p, {
      t: 'cmd',
      v: cmd
    }]);
    setTC('');
    const r = await send(cmd, 5000);
    setTH(p => [...p, {
      t: 'res',
      v: r
    }]);
  }, [termCmd, send]);

  // ─── RECORDING ───
  useEffect(() => {
    if (recording && Object.keys(liveData).length > 0) {
      setRecD(p => [...p, {
        ts: Date.now(),
        ...liveData
      }]);
    }
  }, [recording, liveData]);

  // ─── PERFORMANCE 0-100 ───
  useEffect(() => {
    if (!perfActive) return;
    const spd = parseFloat(liveData['0D']) || 0;
    if (!perfStart && spd > 2) setPS(Date.now());
    if (perfStart && spd >= 100) {
      setPT(((Date.now() - perfStart) / 1000).toFixed(2));
      setPA(false);
    }
  }, [perfActive, perfStart, liveData]);

  // ─── TRIP COMPUTER ───
  useEffect(() => {
    if (monitoring && tripStart) {
      const spd = parseFloat(liveData['0D']) || 0;
      setTD2(p => p + spd / 3600 * (PRESETS[preset].ms / 1000));
    }
  }, [monitoring, liveData, tripStart, preset]);

  // ─── ALERTS ───
  useEffect(() => {
    if (!monitoring) return;
    const a = [];
    if (parseFloat(liveData['05']) > 105) a.push({
      m: '🌡️ Coolant > 105°C!',
      c: '#ef4444'
    });
    if (parseFloat(liveData['42']) < 11.8) a.push({
      m: '🔋 Voltage < 11.8V!',
      c: '#ef4444'
    });
    if (parseFloat(liveData['42']) > 15) a.push({
      m: '🔋 Voltage > 15V!',
      c: '#ef4444'
    });
    if (parseFloat(liveData['0C']) > 6500) a.push({
      m: '⏱️ RPM > 6500!',
      c: '#f59e0b'
    });
    if (Math.abs(parseFloat(liveData['07']) || 0) > 25) a.push({
      m: '📊 LTFT > ±25%!',
      c: '#f59e0b'
    });
    if (parseFloat(liveData['5C']) > 120) a.push({
      m: '🛢️ Oil > 120°C!',
      c: '#ef4444'
    });
    setAlerts(a);
  }, [monitoring, liveData]);
  const exportCSV = useCallback(() => {
    if (recData.length === 0) return;
    const keys = Object.keys(recData[0]);
    const header = keys.map(k => PIDS[k] ? PIDS[k].n : k).join(',');
    const rows = recData.map(r => keys.map(k => r[k] ?? '').join(','));
    const csv = header + '\n' + rows.join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obd_recording_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }, [recData]);

  // ─── SAVE SCAN TO HISTORY ───
  const saveScan = useCallback(() => {
    const scan = {
      date: new Date().toLocaleString(),
      vin: vehicleInfo.vin || 'N/A',
      dtcCount: dtcList.length,
      dtcs: dtcList.map(d => d.code),
      milOn: vehicleInfo.milOn
    };
    setSH(p => [scan, ...p].slice(0, 20));
    addLog('Scan saved to history', 'success');
  }, [vehicleInfo, dtcList, addLog]);

  // ─── OHM CALC ───
  const calcOhm = useCallback(() => {
    const v = parseFloat(ohmV),
      i = parseFloat(ohmI),
      r = parseFloat(ohmR);
    if (v && i && !r) setOhmR((v / i).toFixed(3));else if (v && r && !i) setOhmI((v / r).toFixed(3));else if (i && r && !v) setOhmV((i * r).toFixed(3));
  }, [ohmV, ohmI, ohmR]);

  // ─── FUEL CONSUMPTION ───
  const fuelLH = liveData['10'] && liveData['0D'] ? (parseFloat(liveData['10']) * 3600 / (14.7 * 820)).toFixed(2) : null;
  const fuelL100 = fuelLH && liveData['0D'] && parseFloat(liveData['0D']) > 5 ? (parseFloat(fuelLH) * 100 / parseFloat(liveData['0D'])).toFixed(1) : null;
  useEffect(() => {
    return () => {
      if (monRef.current) clearInterval(monRef.current);
    };
  }, []);
  const isOn = connStatus === 'on';
  const s = {
    card: {
      background: '#1e293b',
      borderRadius: 12,
      padding: 14,
      margin: '8px 0',
      border: '1px solid #334155'
    },
    btn: (c, d) => ({
      padding: '10px 20px',
      borderRadius: 8,
      border: 'none',
      background: d ? '#374151' : c || '#f59e0b',
      color: c === '#ef4444' || c === '#3b82f6' ? '#fff' : '#000',
      fontWeight: 600,
      cursor: d ? 'not-allowed' : 'pointer',
      fontSize: 14,
      width: '100%',
      opacity: d ? 0.5 : 1
    }),
    btnS: c => ({
      padding: '5px 12px',
      borderRadius: 6,
      border: 'none',
      background: c || '#f59e0b',
      color: c === '#ef4444' || c === '#3b82f6' ? '#fff' : '#000',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: 11
    }),
    inp: {
      background: '#0f172a',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '7px 10px',
      color: '#e2e8f0',
      fontSize: 13,
      width: '100%',
      boxSizing: 'border-box',
      direction: 'ltr',
      fontFamily: 'monospace'
    },
    connC: sel => ({
      flex: '1 1 45%',
      minWidth: 130,
      background: sel ? '#1e3a5f' : '#1e293b',
      border: sel ? '2px solid #3b82f6' : '1px solid #334155',
      borderRadius: 12,
      padding: 14,
      cursor: 'pointer',
      textAlign: 'center'
    }),
    tabR: {
      display: 'flex',
      background: '#111827',
      borderBottom: '1px solid #1e293b'
    },
    tabB: a => ({
      flex: 1,
      padding: '9px 4px',
      textAlign: 'center',
      fontSize: 12,
      cursor: 'pointer',
      background: a ? '#1e293b' : 'transparent',
      color: a ? '#f59e0b' : '#94a3b8',
      borderBottom: a ? '2px solid #f59e0b' : '2px solid transparent',
      whiteSpace: 'nowrap'
    })
  };

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  const isDark = theme === 'dark';
  const bg = isDark ? '#0c1220' : '#f0f4f8';
  const fg = isDark ? '#e2e8f0' : '#1e293b';
  const cbg = isDark ? '#1e293b' : '#ffffff';
  const cbr = isDark ? '#334155' : '#d1d5db';
  const hbg = isDark ? '#111827' : '#e2e8f0';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      color: fg,
      fontFamily: 'system-ui,sans-serif',
      minHeight: '100vh',
      direction: isRTL ? 'rtl' : 'ltr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: hbg,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${cbr}`,
      flexWrap: 'wrap',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: '#f59e0b'
    }
  }, "🔧 OBD Scanner Pro"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme(isDark ? 'light' : 'dark'),
    style: {
      ...s.btnS(isDark ? '#1e293b' : '#e2e8f0'),
      border: `1px solid ${cbr}`,
      color: isDark ? '#94a3b8' : '#475569'
    }
  }, isDark ? '☀️' : '🌙'), /*#__PURE__*/React.createElement("select", {
    style: {
      background: cbg,
      border: `1px solid ${cbr}`,
      borderRadius: 6,
      color: fg,
      fontSize: 11,
      padding: '3px'
    },
    value: lang,
    onChange: e => setLang(e.target.value)
  }, Object.entries(LANGS).map(([k, v]) => /*#__PURE__*/React.createElement("option", {
    key: k,
    value: k
  }, v))), isOn && /*#__PURE__*/React.createElement("button", {
    onClick: doPrint,
    style: {
      ...s.btnS('#1e293b'),
      border: '1px solid #334155',
      color: '#94a3b8'
    }
  }, "🖨️"), isOn && /*#__PURE__*/React.createElement("button", {
    onClick: doShare,
    style: {
      ...s.btnS('#1e293b'),
      border: '1px solid #334155',
      color: '#94a3b8'
    }
  }, "📤"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSA(!showAbout),
    style: {
      ...s.btnS('#1e293b'),
      border: '1px solid #334155',
      color: '#94a3b8'
    }
  }, "ℹ️"), isOn && /*#__PURE__*/React.createElement("button", {
    onClick: doDisconnect,
    style: {
      ...s.btnS('#ef4444')
    }
  }, t('disc')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      padding: '3px 10px',
      borderRadius: 10,
      background: isOn ? '#064e3b' : connStatus === 'ing' ? '#78350f' : '#1e293b',
      color: isOn ? '#34d399' : connStatus === 'ing' ? '#fbbf24' : '#94a3b8'
    }
  }, isOn ? t('on') : connStatus === 'ing' ? t('ing') : t('off')))), showAbout && /*#__PURE__*/React.createElement("div", {
    style: {
      ...s.card,
      margin: 0,
      borderRadius: 0,
      textAlign: 'center',
      background: '#111827'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: '#f59e0b'
    }
  }, "🔧 OBD Scanner Pro"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      marginTop: 4,
      color: '#94a3b8'
    }
  }, t('aboutTxt')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      marginTop: 2,
      color: '#64748b'
    }
  }, t('copy')), /*#__PURE__*/React.createElement("a", {
    href: "https://barakaflalo.github.io/appnest",
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: 'inline-block',
      marginTop: 6,
      padding: '5px 14px',
      background: '#f59e0b',
      color: '#000',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, t('moreApps'))), showReport && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#f59e0b',
      fontWeight: 700,
      fontSize: 16
    }
  }, "🖨️ ", isRTL ? 'דוח סריקה' : 'Scan Report'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#3b82f6'),
    onClick: () => {
      navigator.clipboard.writeText(reportHTML());
      addLog('Report copied!', 'success');
    }
  }, isRTL ? '📋 העתק' : '📋 Copy'), /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#ef4444'),
    onClick: () => setSR2(false)
  }, "✕"))), /*#__PURE__*/React.createElement("pre", {
    style: {
      flex: 1,
      background: '#1e293b',
      borderRadius: 8,
      padding: 12,
      overflow: 'auto',
      fontSize: 11,
      fontFamily: 'monospace',
      color: '#e2e8f0',
      whiteSpace: 'pre-wrap',
      direction: 'ltr',
      textAlign: 'left',
      border: '1px solid #334155'
    }
  }, reportHTML())), /*#__PURE__*/React.createElement("div", {
    style: s.tabR
  }, [['connect', t('connect')], ['dash', t('dash')], ['dtc', t('dtc')], ['scan', t('scan')]].map(([id, lb]) => /*#__PURE__*/React.createElement("div", {
    key: id,
    style: s.tabB(tab === id),
    onClick: () => setTab(id)
  }, lb))), /*#__PURE__*/React.createElement("div", {
    style: s.tabR
  }, [['vehicle', t('vehicle')], ['term', t('term')], ['tools', t('tools')], ['guide', t('guide')]].map(([id, lb]) => /*#__PURE__*/React.createElement("div", {
    key: id,
    style: s.tabB(tab === id),
    onClick: () => setTab(id)
  }, lb))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14
    }
  }, tab === 'connect' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 10,
      color: '#f59e0b'
    }
  }, t('chooseConn')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, [['ble', '📶', t('bleT'), t('bleD')], ['wifi', '📡', t('wifiT'), t('wifiD')], ['serial', '🔌', t('usbT'), t('usbD')], ['demo', '🎮', t('demoT'), t('demoD')]].map(([m, ic, ti, de]) => /*#__PURE__*/React.createElement("div", {
    key: m,
    style: s.connC(connMethod === m),
    onClick: () => !isOn && setCM(m)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      marginBottom: 6
    }
  }, ic), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, ti), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#94a3b8',
      marginTop: 3
    }
  }, de)))), connMethod === 'wifi' && !isOn && /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: {
      ...s.inp,
      flex: 2
    },
    value: wifiH,
    onChange: e => setWH(e.target.value),
    placeholder: "IP"
  }), /*#__PURE__*/React.createElement("input", {
    style: {
      ...s.inp,
      flex: 1
    },
    value: wifiP,
    onChange: e => setWP(e.target.value),
    placeholder: "Port"
  }))), connMethod === 'serial' && !isOn && /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("select", {
    style: s.inp,
    value: baud,
    onChange: e => setBaud(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "9600"
  }, "9600"), /*#__PURE__*/React.createElement("option", {
    value: "38400"
  }, "38400"), /*#__PURE__*/React.createElement("option", {
    value: "115200"
  }, "115200"))), connMethod && !isOn && /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#f59e0b', connStatus === 'ing'),
      marginTop: 12
    },
    disabled: connStatus === 'ing',
    onClick: () => doConnect(connMethod)
  }, connStatus === 'ing' ? t('btnWait') : t('btnConn')), connInfo && /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#94a3b8'
    }
  }, connInfo)), logs.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      ...s.card,
      maxHeight: 180,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 4
    }
  }, t('log')), logs.slice(-12).map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 10,
      fontFamily: 'monospace',
      color: l.tp === 'error' ? '#ef4444' : l.tp === 'success' ? '#34d399' : '#94a3b8',
      direction: 'ltr',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#475569'
    }
  }, l.t), " ", l.m)))), tab === 'dash' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 10,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("select", {
    style: {
      ...s.inp,
      flex: 1,
      maxWidth: 160
    },
    value: preset,
    onChange: e => setPre(e.target.value)
  }, Object.entries(PRESETS).map(([k, v]) => /*#__PURE__*/React.createElement("option", {
    key: k,
    value: k
  }, v.n))), !monitoring ? /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#22c55e'),
    onClick: startMon,
    disabled: !isOn
  }, t('start')) : /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#ef4444'),
    onClick: stopMon
  }, t('stop')), isOn && (!recording ? /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#dc2626'),
    onClick: () => {
      setRec(true);
      setRecD([]);
    }
  }, t('rec')) : /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#7f1d1d'),
    onClick: () => setRec(false)
  }, t('stopRec'))), recData.length > 0 && /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#3b82f6'),
    onClick: exportCSV
  }, t('exportCsv'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Gauge, {
    value: liveData['0C'] || 0,
    max: 8000,
    label: PIDS['0C'].h,
    unit: "RPM",
    warn: 6500,
    size: 125
  }), /*#__PURE__*/React.createElement(Gauge, {
    value: liveData['0D'] || 0,
    max: 260,
    label: PIDS['0D'].h,
    unit: "km/h",
    size: 125
  }), /*#__PURE__*/React.createElement(Gauge, {
    value: liveData['05'] || 0,
    max: 130,
    label: PIDS['05'].h,
    unit: "°C",
    warn: 105,
    size: 125
  })), (fuelLH || liveData['42']) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 8
    }
  }, fuelLH && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f172a',
      borderRadius: 8,
      padding: '6px 10px',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#64748b'
    }
  }, t('fuelCons')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      fontFamily: 'monospace',
      color: '#22c55e'
    }
  }, fuelLH, " L/h ", fuelL100 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8',
      fontSize: 11
    }
  }, "(", fuelL100, " L/100km)"))), liveData['42'] && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f172a',
      borderRadius: 8,
      padding: '6px 10px',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#64748b'
    }
  }, "🔋 Battery"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      fontFamily: 'monospace',
      color: parseFloat(liveData['42']) < 12 ? '#ef4444' : parseFloat(liveData['42']) < 12.5 ? '#f59e0b' : '#22c55e'
    }
  }, parseFloat(liveData['42']).toFixed(1), " V"))), recording && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#ef4444',
      textAlign: 'center',
      marginBottom: 6
    }
  }, "⏺ ", isRTL ? 'מקליט' : 'Recording', ": ", recData.length, " ", isRTL ? 'דגימות' : 'samples'), alerts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, alerts.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: '#450a0a',
      border: '1px solid #7f1d1d',
      borderRadius: 8,
      padding: '6px 10px',
      marginBottom: 4,
      fontSize: 12,
      fontWeight: 600,
      color: a.c
    }
  }, a.m))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 8,
      padding: '8px 10px',
      flex: '1 1 45%',
      minWidth: 130,
      border: `1px solid ${cbr}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b'
    }
  }, "🏁 0-100 km/h"), !perfActive ? /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btnS('#22c55e'),
      marginTop: 4,
      width: '100%'
    },
    onClick: () => {
      setPA(true);
      setPS(null);
      setPT(null);
    },
    disabled: !monitoring
  }, isRTL ? 'התחל מדידה' : 'Start timer') : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      fontFamily: 'monospace',
      color: '#f59e0b',
      marginTop: 2
    }
  }, perfStart ? ((Date.now() - perfStart) / 1000).toFixed(1) + 's' : isRTL ? 'דרוך...' : 'Ready...'), perfTime && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: '#22c55e',
      marginTop: 2
    }
  }, perfTime, "s ✓")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 8,
      padding: '8px 10px',
      flex: '1 1 45%',
      minWidth: 130,
      border: `1px solid ${cbr}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b'
    }
  }, "🗺️ ", isRTL ? 'מחשבון נסיעה' : 'Trip computer'), !tripStart ? /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btnS('#3b82f6'),
      marginTop: 4,
      width: '100%'
    },
    onClick: () => {
      setTS2(Date.now());
      setTD2(0);
    },
    disabled: !monitoring
  }, isRTL ? 'התחל נסיעה' : 'Start trip') : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      fontFamily: 'monospace',
      color: '#e2e8f0',
      marginTop: 2
    }
  }, tripDist.toFixed(1), " km"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b'
    }
  }, ((Date.now() - (tripStart || Date.now())) / 60000).toFixed(0), " min | avg ", tripDist > 0 ? (tripDist / ((Date.now() - tripStart) / 3600000)).toFixed(0) : '0', " km/h"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btnS('#ef4444'),
      marginTop: 4,
      fontSize: 9
    },
    onClick: () => setTS2(null)
  }, isRTL ? 'עצור' : 'Stop')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, PRESETS[preset].p.map(pid => {
    const p = PIDS[pid];
    if (!p) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: pid,
      style: {
        background: '#0f172a',
        borderRadius: 8,
        padding: '6px 10px',
        flex: '1 1 45%',
        minWidth: 110
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#64748b'
      }
    }, p.h || p.n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'monospace',
        color: p.w && parseFloat(liveData[pid]) >= p.w ? '#ef4444' : '#e2e8f0'
      }
    }, liveData[pid] != null ? typeof liveData[pid] === 'number' ? liveData[pid].toFixed(pid === '0C' || pid === '0D' ? 0 : 1) : liveData[pid] : '—', " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: '#64748b'
      }
    }, p.u)));
  })), monitoring && /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600
    }
  }, "📈 ", PIDS[graphPid]?.h || graphPid), /*#__PURE__*/React.createElement("select", {
    style: {
      ...s.inp,
      width: 'auto',
      fontSize: 10,
      padding: '3px 6px'
    },
    value: graphPid,
    onChange: e => {
      setGP(e.target.value);
      setGD([]);
    }
  }, PRESETS[preset].p.map(p => /*#__PURE__*/React.createElement("option", {
    key: p,
    value: p
  }, PIDS[p]?.h || p)))), /*#__PURE__*/React.createElement(SimpleChart, {
    data: graphData,
    dataKey: "v",
    color: "#f59e0b"
  }))), tab === 'dtc' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: s.btn('#3b82f6', !isOn || loading),
    onClick: readDTCs,
    disabled: !isOn || loading
  }, loading ? '⏳...' : t('readDtc'))), vehicleInfo.milOn !== undefined && /*#__PURE__*/React.createElement("div", {
    style: {
      ...s.card,
      background: vehicleInfo.milOn ? '#451a03' : '#052e16',
      borderColor: vehicleInfo.milOn ? '#92400e' : '#166534'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, vehicleInfo.milOn ? '🔴' : '🟢'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: vehicleInfo.milOn ? '#fbbf24' : '#34d399'
    }
  }, vehicleInfo.milOn ? t('milOn') : t('milOff')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94a3b8'
    }
  }, t('faults'), ": ", vehicleInfo.dtcN || 0)))), dtcList.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 6,
      color: '#ef4444'
    }
  }, t('confirmed'), " (", dtcList.length, ")"), dtcList.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...s.card,
      borderColor: '#7f1d1d'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontFamily: 'monospace',
      color: '#ef4444',
      fontSize: 16
    }
  }, d.code), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#64748b'
    }
  }, d.type)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      marginTop: 3
    }
  }, d.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: `https://youtube.com/results?search_query=${d.code}+fix`,
    target: "_blank",
    rel: "noreferrer",
    style: {
      ...s.btnS('#ef4444'),
      textDecoration: 'none',
      fontSize: 10
    }
  }, "▶ YouTube"), /*#__PURE__*/React.createElement("a", {
    href: `https://google.com/search?q=${d.code}+diagnostic`,
    target: "_blank",
    rel: "noreferrer",
    style: {
      ...s.btnS('#3b82f6'),
      textDecoration: 'none',
      fontSize: 10
    }
  }, "🔍 Google"))))), dtcPending.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 6,
      color: '#f59e0b'
    }
  }, t('pending'), " (", dtcPending.length, ")"), dtcPending.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...s.card,
      borderColor: '#78350f'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontFamily: 'monospace',
      color: '#fbbf24'
    }
  }, d.code), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, d.desc)))), dtcList.length === 0 && dtcPending.length === 0 && vehicleInfo.milOn !== undefined && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 24,
      color: '#34d399'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40
    }
  }, "✅"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      marginTop: 6
    }
  }, t('noDtc'))), (dtcList.length > 0 || dtcPending.length > 0) && /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#ef4444'),
      marginTop: 10
    },
    onClick: clearDTCs,
    disabled: loading
  }, t('clearDtc')), isOn && /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#1e293b', false),
      marginTop: 6,
      border: '1px solid #334155',
      color: '#94a3b8'
    },
    onClick: saveScan
  }, "💾 ", t('history'), " — ", isRTL ? 'שמור סריקה' : 'Save scan'), scanHist.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 6
    }
  }, t('history'), " (", scanHist.length, ")"), scanHist.slice(0, 5).map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 10,
      padding: '4px 0',
      borderBottom: '1px solid #334155',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b'
    }
  }, h.date), /*#__PURE__*/React.createElement("span", {
    style: {
      color: h.dtcCount > 0 ? '#ef4444' : '#34d399'
    }
  }, h.dtcCount > 0 ? h.dtcs.join(', ') : '✅ Clean')))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...s.card,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#22c55e'
    }
  }, t('readiness')), /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#22c55e'),
    onClick: readReady,
    disabled: !isOn
  }, "🔄")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b',
      marginBottom: 6
    }
  }, t('readyDesc')), readyData && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 5
    }
  }, readyData.mons.map((m, i) => {
    if (!m.s) return null;
    const names = t('monNames');
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: '1 1 45%',
        minWidth: 110,
        padding: '5px 8px',
        borderRadius: 6,
        background: m.c ? '#052e16' : '#450a0a',
        border: `1px solid ${m.c ? '#166534' : '#7f1d1d'}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: m.c ? '#34d399' : '#ef4444',
        fontWeight: 600
      }
    }, m.c ? '✅' : '❌', " ", names[i] || 'Monitor ' + i));
  }))), /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#3b82f6'
    }
  }, t('freeze')), /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#3b82f6'),
    onClick: readFreeze,
    disabled: !isOn
  }, "📸")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b',
      marginBottom: 6
    }
  }, t('freezeD')), freezeData && /*#__PURE__*/React.createElement("div", null, freezeData.trigger && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6,
      background: '#450a0a',
      borderRadius: 6,
      marginBottom: 6,
      border: '1px solid #7f1d1d'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'monospace',
      color: '#ef4444',
      fontWeight: 700
    }
  }, freezeData.trigger.code), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#fca5a5'
    }
  }, freezeData.trigger.desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 5
    }
  }, Object.entries(freezeData).filter(([k]) => k !== 'trigger').map(([pid, d]) => /*#__PURE__*/React.createElement("div", {
    key: pid,
    style: {
      background: '#0f172a',
      borderRadius: 6,
      padding: '5px 8px',
      flex: '1 1 45%',
      minWidth: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#64748b'
    }
  }, d.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      fontFamily: 'monospace'
    }
  }, d.v, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: '#64748b'
    }
  }, d.u)))))))), tab === 'scan' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...s.card,
      background: isDark ? '#1c1917' : '#fef3c7',
      borderColor: '#f59e0b',
      borderWidth: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: '#f59e0b',
      marginBottom: 6
    }
  }, "🔍 ", isRTL ? 'חוקר ק"מ' : 'Odometer Investigator'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94a3b8',
      marginBottom: 8
    }
  }, isRTL ? 'סורק את כל המחשבים ומחפש ק"מ. הזן את הק"מ הידוע לזיהוי אוטומטי:' : 'Scans all ECUs for odometer. Enter known km for auto-detection:'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: {
      ...s.inp,
      flex: 1
    },
    value: odoKnownKm,
    onChange: e => setOKm(e.target.value.replace(/[^0-9]/g, '')),
    placeholder: isRTL ? 'ק"מ ידוע (למשל 273078)' : 'Known km (e.g. 273078)',
    type: "tel"
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#f59e0b'),
      width: '100%'
    },
    onClick: investigateOdometer,
    disabled: !isOn || odoScanning
  }, odoScanning ? '⏳ ' + (isRTL ? 'סורק...' : 'Scanning...') : '🔍 ' + (isRTL ? 'חקור ק"מ' : 'Investigate Odometer')), odoProg && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#93c5fd',
      marginTop: 6,
      textAlign: 'center'
    }
  }, odoProg), odoResults.filter(r => r.match).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: 8,
      background: '#052e16',
      borderRadius: 8,
      border: '1px solid #166534'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#34d399',
      marginBottom: 6
    }
  }, "✅ ", isRTL ? 'נמצאו התאמות!' : 'Matches found!'), odoResults.filter(r => r.match).map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 11,
      padding: '4px 0',
      borderBottom: '1px solid #166534'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#34d399',
      fontWeight: 600
    }
  }, r.ecu, " (", r.addr, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'monospace',
      color: '#e2e8f0',
      direction: 'ltr'
    }
  }, r.cmd, " → ", r.resp), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#fbbf24',
      fontSize: 10
    }
  }, "format: ", r.match)))), odoResults.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: '#f59e0b',
      marginBottom: 4
    }
  }, isRTL ? 'כל התוצאות' : 'All results', " (", odoResults.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 300,
      overflowY: 'auto'
    }
  }, odoResults.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 10,
      padding: '5px 8px',
      background: r.match ? '#052e16' : isDark ? '#0f172a' : '#f1f5f9',
      borderRadius: 6,
      marginBottom: 4,
      border: r.match ? '1px solid #166534' : '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontWeight: 600
    }
  }, r.ecu, " (", r.addr, ") — ", r.cmd), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'monospace',
      color: '#e2e8f0',
      direction: 'ltr',
      textAlign: 'left',
      wordBreak: 'break-all'
    }
  }, r.resp), r.decoded && r.decoded.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#fbbf24',
      fontSize: 9,
      direction: 'ltr',
      textAlign: 'left'
    }
  }, isRTL ? 'ערכים אפשריים:' : 'possible km:', " ", r.decoded.map(d => d.km.toLocaleString()).join(', ')))))), odoRawLog.length > 0 && /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#3b82f6'),
      width: '100%',
      marginTop: 8,
      fontSize: 12
    },
    onClick: () => {
      let txt = 'ODOMETER INVESTIGATION RAW LOG\nKnown km: ' + odoKnownKm + '\n\n';
      odoRawLog.forEach(r => txt += `${r.ecu} (${r.addr}) | ${r.cmd} → ${r.resp}\n`);
      navigator.clipboard.writeText(txt);
      addLog('Raw log copied!', 'success');
    }
  }, "📋 ", isRTL ? 'העתק לוג גולמי (לשליחה)' : 'Copy raw log (to send)')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 10,
      marginTop: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#f59e0b'),
      flex: 1
    },
    onClick: scanECUs,
    disabled: !isOn || ecuScanning
  }, ecuScanning ? '⏳...' : t('scanAll')), ecuList.filter(e => e.ok).length > 0 && /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#3b82f6'),
      flex: 1
    },
    onClick: fullReport,
    disabled: ecuScanning
  }, t('fullRpt'))), ecuProg && /*#__PURE__*/React.createElement("div", {
    style: {
      ...s.card,
      background: '#172554',
      borderColor: '#1e40af'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#93c5fd'
    }
  }, ecuProg)), kmRpt.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      ...s.card,
      background: '#1c1917',
      borderColor: '#78350f'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#f59e0b',
      marginBottom: 6
    }
  }, t('kmComp')), kmRpt.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 0',
      borderBottom: '1px solid #334155',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'monospace',
      fontWeight: 600
    }
  }, r.km))), (() => {
    const nums = kmRpt.filter(r => typeof r.km === 'number').map(r => r.km);
    if (nums.length < 2) return null;
    const diff = Math.max(...nums) - Math.min(...nums);
    const ok = diff < 5000;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        padding: 6,
        borderRadius: 6,
        background: ok ? '#052e16' : '#450a0a',
        border: `1px solid ${ok ? '#166534' : '#7f1d1d'}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: ok ? '#34d399' : '#ef4444'
      }
    }, ok ? t('kmOk') : t('kmBad'), " — ", diff.toLocaleString(), " km"), !ok && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#fca5a5',
        marginTop: 2
      }
    }, t('kmBadD')));
  })()), ecuList.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 6
    }
  }, ecuList.filter(e => e.ok).length, " active / ", ecuList.length, " scanned"), ecuList.map((ecu, i) => {
    const det = ecuDet[ecu.a];
    const isSel = selEcu && selEcu.a === ecu.a;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        ...s.card,
        borderColor: ecu.ok ? isSel ? '#f59e0b' : '#166534' : '#334155',
        background: ecu.ok ? isSel ? '#1c1917' : '#0f2918' : '#1e293b',
        cursor: ecu.ok ? 'pointer' : 'default',
        opacity: ecu.ok ? 1 : 0.5
      },
      onClick: () => ecu.ok && readECUDet(ecu)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, ecu.ic), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 12
      }
    }, isRTL ? ecu.h || ecu.n : ecu.n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: '#64748b',
        fontFamily: 'monospace'
      }
    }, "CAN: ", ecu.a, " → ", ecu.r))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 8,
        background: ecu.ok ? '#052e16' : '#1e293b',
        color: ecu.ok ? '#34d399' : '#64748b',
        border: `1px solid ${ecu.ok ? '#166534' : '#334155'}`
      }
    }, ecu.ok ? t('active') : t('inactive'))), isSel && det && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid #334155'
      }
    }, loading && /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#fbbf24',
        fontSize: 11
      }
    }, "⏳..."), UDS_DIDS.map(did => {
      const v = det[did.d];
      if (!v) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: did.d,
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          padding: '3px 0',
          fontSize: 11
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#94a3b8'
        }
      }, isRTL ? did.h : did.n), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'monospace',
          color: did.crit ? '#f59e0b' : '#e2e8f0',
          direction: 'ltr'
        }
      }, v));
    }), det.dtcs && det.dtcs.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: '#ef4444'
      }
    }, t('faults'), " (", det.dtcs.length, ")"), det.dtcs.map((d, j) => /*#__PURE__*/React.createElement("div", {
      key: j,
      style: {
        fontSize: 10,
        padding: '3px 6px',
        background: '#450a0a',
        borderRadius: 4,
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'monospace',
        color: '#fca5a5',
        fontWeight: 600
      }
    }, d.code), " ", d.desc))), det.dtcs && det.dtcs.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#34d399',
        marginTop: 4
      }
    }, "✅ ", t('noDtc'))));
  })), ecuList.length === 0 && !ecuScanning && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 30,
      color: '#64748b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36
    }
  }, "🔍"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 13
    }
  }, isRTL ? 'לחץ סרוק לגילוי כל המחשבים' : 'Press scan to discover all ECUs'))), tab === 'vehicle' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    style: s.btn('#3b82f6', !isOn || loading),
    onClick: readVeh,
    disabled: !isOn || loading
  }, loading ? '⏳...' : t('readVeh')), Object.keys(vehicleInfo).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 8,
      color: '#f59e0b'
    }
  }, t('vehInfo')), [['VIN', vehicleInfo.vin], ['Protocol', vehicleInfo.proto], ['OBD', vehicleInfo.obdStd], ['Battery', vehicleInfo.batt ? vehicleInfo.batt + ' V' : null], ['MIL', vehicleInfo.milOn != null ? vehicleInfo.milOn ? 'ON 🔴' : 'OFF 🟢' : null]].map(([l, v], i) => v ? /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0',
      borderBottom: '1px solid #334155',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8'
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'monospace',
      direction: 'ltr'
    }
  }, v)) : null)), supPids.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 6
    }
  }, t('supPids'), " (", supPids.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 3
    }
  }, supPids.map(pid => /*#__PURE__*/React.createElement("span", {
    key: pid,
    style: {
      fontSize: 9,
      fontFamily: 'monospace',
      background: PIDS[pid] ? '#1e3a5f' : '#1e293b',
      padding: '2px 5px',
      borderRadius: 3,
      color: PIDS[pid] ? '#93c5fd' : '#64748b'
    }
  }, pid, PIDS[pid] ? ' ' + PIDS[pid].h : ''))))), tab === 'term' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f172a',
      borderRadius: 8,
      padding: 10,
      minHeight: 200,
      maxHeight: 350,
      overflowY: 'auto',
      fontFamily: 'monospace',
      fontSize: 11,
      direction: 'ltr',
      textAlign: 'left',
      marginBottom: 10,
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#34d399'
    }
  }, "ELM327 Terminal"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#475569',
      marginBottom: 6
    }
  }, "───────────────"), termHist.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      color: h.t === 'cmd' ? '#f59e0b' : '#e2e8f0',
      marginBottom: 1
    }
  }, h.t === 'cmd' ? '> ' : ' ', h.v))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: {
      ...s.inp,
      flex: 1
    },
    value: termCmd,
    onChange: e => setTC(e.target.value.toUpperCase()),
    onKeyDown: e => e.key === 'Enter' && termSend(),
    placeholder: t('cmdPlace'),
    disabled: !isOn
  }), /*#__PURE__*/React.createElement("button", {
    style: s.btnS('#f59e0b'),
    onClick: termSend,
    disabled: !isOn
  }, "➤")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      marginBottom: 4
    }
  }, t('qCmds')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4
    }
  }, [['ATZ', 'Reset'], ['ATI', 'Version'], ['ATRV', 'Voltage'], ['ATDP', 'Protocol'], ['01 0C', 'RPM'], ['01 0D', 'Speed'], ['01 05', 'Temp'], ['01 11', 'Throttle'], ['03', 'Read DTC'], ['07', 'Pending'], ['04', 'Clear DTC'], ['09 02', 'VIN']].map(([c, l]) => /*#__PURE__*/React.createElement("button", {
    key: c,
    style: {
      ...s.btnS('#1e293b'),
      border: '1px solid #334155',
      color: '#94a3b8',
      fontSize: 9
    },
    onClick: () => {
      setTC(c);
    }
  }, l))))), tab === 'tools' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: '#f59e0b',
      marginBottom: 10
    }
  }, "🔧 ", t('tools')), /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#f59e0b',
      marginBottom: 8
    }
  }, "⚡ ", t('ohmCalc')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b'
    }
  }, "V (", isRTL ? 'מתח' : 'Voltage', ")"), /*#__PURE__*/React.createElement("input", {
    style: s.inp,
    value: ohmV,
    onChange: e => setOhmV(e.target.value),
    placeholder: "V"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b'
    }
  }, "I (", isRTL ? 'זרם' : 'Current', ") A"), /*#__PURE__*/React.createElement("input", {
    style: s.inp,
    value: ohmI,
    onChange: e => setOhmI(e.target.value),
    placeholder: "A"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b'
    }
  }, "R (", isRTL ? 'התנגדות' : 'Resistance', ") Ω"), /*#__PURE__*/React.createElement("input", {
    style: s.inp,
    value: ohmR,
    onChange: e => setOhmR(e.target.value),
    placeholder: "Ω"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#f59e0b'),
      flex: 1
    },
    onClick: calcOhm
  }, isRTL ? 'חשב' : 'Calculate'), /*#__PURE__*/React.createElement("button", {
    style: {
      ...s.btn('#374151'),
      flex: '0 0 auto',
      color: '#94a3b8'
    },
    onClick: () => {
      setOhmV('');
      setOhmI('');
      setOhmR('');
    }
  }, "🔄")), ohmV && ohmI && ohmR && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 12,
      color: '#94a3b8',
      textAlign: 'center'
    }
  }, "P = ", (parseFloat(ohmV) * parseFloat(ohmI)).toFixed(2), " W (", isRTL ? 'הספק' : 'Power', ")")), /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#3b82f6',
      marginBottom: 8
    }
  }, "📌 ", t('pinout')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      fontSize: 11
    }
  }, [{
    p: 2,
    n: 'J1850+',
    c: '#64748b'
  }, {
    p: 4,
    n: 'Chassis GND',
    c: '#22c55e'
  }, {
    p: 5,
    n: 'Signal GND',
    c: '#22c55e'
  }, {
    p: 6,
    n: 'CAN-H',
    c: '#f59e0b'
  }, {
    p: 7,
    n: 'K-Line',
    c: '#64748b'
  }, {
    p: 10,
    n: 'J1850-',
    c: '#64748b'
  }, {
    p: 14,
    n: 'CAN-L',
    c: '#3b82f6'
  }, {
    p: 15,
    n: 'L-Line',
    c: '#64748b'
  }, {
    p: 16,
    n: '+12V Battery',
    c: '#ef4444'
  }].map(pin => /*#__PURE__*/React.createElement("div", {
    key: pin.p,
    style: {
      background: '#0f172a',
      padding: '4px 8px',
      borderRadius: 4,
      border: `1px solid ${pin.c}`,
      minWidth: 90
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: pin.c,
      fontWeight: 700
    }
  }, "Pin ", pin.p), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8'
    }
  }, pin.n)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#64748b',
      marginTop: 6
    }
  }, isRTL ? '💡 בדיקה: מתח בין פין 16 ל-4/5 = 12V. CAN: ~2.5V על 6 ו-14' : '💡 Test: Pin 16 to 4/5 = 12V. CAN: ~2.5V on pins 6 & 14')), /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#22c55e',
      marginBottom: 8
    }
  }, "📊 ", t('sensorRef')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10
    }
  }, [['MAF', '0.5-5V', '2-250 g/s', isRTL ? 'מד זרימת אוויר' : 'Mass air flow'], ['MAP', '0.5-4.5V', '20-105 kPa', isRTL ? 'לחץ מניפולד' : 'Manifold pressure'], ['TPS', '0.5-4.5V', '0-100%', isRTL ? 'מצב מצערת' : 'Throttle position'], ['ECT', '0.3-4.5V', '-40 to 150°C', isRTL ? 'טמפ\' מנוע' : 'Coolant temp'], ['IAT', '0.3-4.5V', '-40 to 80°C', isRTL ? 'טמפ\' אוויר' : 'Intake air temp'], ['O2 (Narrow)', '0.1-0.9V', 'λ=1', isRTL ? 'חמצן צר' : 'Narrow O2'], ['O2 (Wide)', '0-5V', 'AFR 10-20', isRTL ? 'חמצן רחב' : 'Wideband O2'], ['CKP', 'AC signal', 'varies', isRTL ? 'גל ארכובה' : 'Crank position'], ['CMP', 'AC/Hall', 'varies', isRTL ? 'גל זיזים' : 'Cam position'], ['Knock', 'AC signal', '<50mV idle', isRTL ? 'חיישן נקישות' : 'Knock sensor'], ['Fuel Pressure', '0.5-4.5V', '250-450 kPa', isRTL ? 'לחץ דלק' : 'Fuel rail'], ['Oil Pressure', '0.5-4.5V', '100-500 kPa', isRTL ? 'לחץ שמן' : 'Oil pressure']].map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      padding: '4px 0',
      borderBottom: '1px solid #1e293b',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 2,
      fontWeight: 600,
      color: '#e2e8f0'
    }
  }, row[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 2,
      color: '#f59e0b',
      fontFamily: 'monospace'
    }
  }, row[1]), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 2,
      color: '#94a3b8',
      fontFamily: 'monospace'
    }
  }, row[2]), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 3,
      color: '#64748b'
    }
  }, row[3]))))), /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#f59e0b',
      marginBottom: 8
    }
  }, "🔋 ", isRTL ? 'טבלת מצבר' : 'Battery reference'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10
    }
  }, [['12.6V+', '100%', '#22c55e'], ['12.4V', '75%', '#22c55e'], ['12.2V', '50%', '#f59e0b'], ['12.0V', '25%', '#f59e0b'], ['11.8V', '0%', '#ef4444'], ['<11.5V', isRTL ? 'מת' : 'Dead', '#ef4444']].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '3px 0',
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'monospace',
      fontWeight: 600,
      color: r[2]
    }
  }, r[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      color: r[2]
    }
  }, r[1]))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: '#64748b'
    }
  }, isRTL ? 'אלטרנטור תקין: 13.5-14.5V. Cranking: מעל 9.6V' : 'Alternator: 13.5-14.5V. Cranking: above 9.6V'))), /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#3b82f6',
      marginBottom: 8
    }
  }, "🔌 ", isRTL ? 'צבעי חיווט לפי יצרן' : 'Wire colors by manufacturer'), [{
    m: isRTL ? 'כללי / ISO' : 'General / ISO',
    w: [{
      c: '#ef4444',
      n: 'Red',
      h: 'אדום',
      f: '+12V / Power'
    }, {
      c: '#000',
      n: 'Black',
      h: 'שחור',
      f: 'Ground / GND'
    }, {
      c: '#22c55e',
      n: 'Green',
      h: 'ירוק',
      f: 'Signal / Sensor'
    }, {
      c: '#f59e0b',
      n: 'Yellow',
      h: 'צהוב',
      f: 'SRS / Airbag'
    }, {
      c: '#f97316',
      n: 'Orange',
      h: 'כתום',
      f: 'HV / Hybrid (>60V)'
    }, {
      c: '#3b82f6',
      n: 'Blue',
      h: 'כחול',
      f: 'CAN-L / Comm'
    }, {
      c: '#fff',
      n: 'White',
      h: 'לבן',
      f: 'CAN-H / Comm'
    }]
  }, {
    m: 'Toyota / Lexus',
    w: [{
      c: '#ef4444',
      n: 'Red-Black',
      h: 'אדום-שחור',
      f: '+12V'
    }, {
      c: '#22c55e',
      n: 'Green',
      h: 'ירוק',
      f: 'CAN-H'
    }, {
      c: '#f59e0b',
      n: 'Yellow',
      h: 'צהוב',
      f: 'CAN-L'
    }, {
      c: '#ec4899',
      n: 'Pink',
      h: 'ורוד',
      f: 'O2 Signal'
    }]
  }, {
    m: 'BMW / VAG',
    w: [{
      c: '#f97316',
      n: 'Orange-Green',
      h: 'כתום-ירוק',
      f: 'CAN-H'
    }, {
      c: '#f97316',
      n: 'Orange-Brown',
      h: 'כתום-חום',
      f: 'CAN-L'
    }, {
      c: '#a855f7',
      n: 'Violet',
      h: 'סגול',
      f: 'K-Line'
    }, {
      c: '#ef4444',
      n: 'Red-Blue',
      h: 'אדום-כחול',
      f: 'Injectors'
    }]
  }, {
    m: 'Hyundai / Kia',
    w: [{
      c: '#ec4899',
      n: 'Pink',
      h: 'ורוד',
      f: 'CAN-H'
    }, {
      c: '#7dd3fc',
      n: 'Sky Blue',
      h: 'תכלת',
      f: 'CAN-L'
    }, {
      c: '#22c55e',
      n: 'Green',
      h: 'ירוק',
      f: 'Sensor signal'
    }, {
      c: '#f59e0b',
      n: 'Yellow',
      h: 'צהוב',
      f: 'SRS'
    }]
  }].map((mfr, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: '#94a3b8',
      marginBottom: 4
    }
  }, mfr.m), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 3
    }
  }, mfr.w.map((w, j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      background: isDark ? '#0f172a' : '#f1f5f9',
      padding: '3px 8px',
      borderRadius: 4,
      fontSize: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: w.c,
      border: '1px solid #475569'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: fg
    }
  }, isRTL ? w.h : w.n), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b'
    }
  }, "— ", w.f))))))), /*#__PURE__*/React.createElement("div", {
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#a855f7',
      marginBottom: 8
    }
  }, "🔧 ", isRTL ? 'סוגי חוטים' : 'Wire types'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10
    }
  }, [[isRTL ? 'רגיל' : 'Standard', isRTL ? 'חוט נחושת עם בידוד PVC' : 'Copper wire with PVC insulation'], [isRTL ? 'מסוכך (Shielded)' : 'Shielded', isRTL ? 'חוט עם מעטה מתכת נגד הפרעות' : 'Metal shield against EMI'], [isRTL ? 'מסובב (Twisted Pair)' : 'Twisted Pair', isRTL ? 'CAN Bus — שני חוטים מסובבים יחד' : 'CAN Bus — two wires twisted together'], ['CAN Bus', isRTL ? 'H + L מסובבים, 120Ω בקצוות' : 'H + L twisted, 120Ω termination'], [isRTL ? 'עמיד חום' : 'Heat Resistant', isRTL ? 'ליד מנוע/פליטה, סיליקון' : 'Near engine/exhaust, silicone'], ['HV (' + (isRTL ? 'כתום' : 'Orange') + ')', isRTL ? 'מתח גבוה >60V, היברידי/חשמלי' : 'High voltage >60V, hybrid/EV'], ['SRS (' + (isRTL ? 'צהוב' : 'Yellow') + ')', isRTL ? 'כריות אוויר, לא לגעת!' : 'Airbag, do not touch!'], ['Fusible Link', isRTL ? 'חוט פיוז, נמס בקצר' : 'Fuse wire, melts on short']].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      padding: '3px 0',
      borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 600,
      color: '#f59e0b',
      minWidth: 100
    }
  }, r[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 2,
      color: '#94a3b8'
    }
  }, r[1])))))), tab === 'guide' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: '#f59e0b',
      marginBottom: 10
    }
  }, "📖 ", isRTL ? 'מדריך למשתמש' : 'User Guide'), [{
    t: isRTL ? '🔗 חיבור' : '🔗 Connection',
    d: isRTL ? 'בחר שיטת חיבור: BLE (בלוטוס) למתאם ELM327 BLE, WiFi למתאם WiFi, USB למתאם USB, או הדגמה לבדיקה בלי חומרה. לחץ "התחבר" והמתן לאתחול.' : 'Choose connection: BLE for ELM327 BLE adapter, WiFi for WiFi adapter, USB for wired adapter, or Demo to test without hardware. Press Connect and wait for initialization.'
  }, {
    t: isRTL ? '📊 דשבורד' : '📊 Dashboard',
    d: isRTL ? 'בחר פריסט ניטור (בסיסי/דלק/טמפרטורות/מפורט) ולחץ "התחל". תראה מדים חיים של סל"ד, מהירות וטמפרטורה. גרף בזמן אמת מתעדכן תוך כדי. בחר איזה PID להציג בגרף מהרשימה.' : 'Select monitoring preset (Basic/Fuel/Temps/Detail) and press Start. You\'ll see live gauges for RPM, Speed, Temperature. A real-time graph updates as data flows. Choose which PID to graph from the dropdown.'
  }, {
    t: isRTL ? '❌ תקלות' : '❌ Faults',
    d: isRTL ? 'לחץ "קרא תקלות" לקריאת קודי DTC. מוצגות תקלות מאושרות (אדום) וממתינות (כתום). כל קוד כולל קישור ל-YouTube ו-Google. לחץ "מחק" לניקוי כל התקלות ונורית Check Engine.' : 'Press "Read Faults" to scan DTCs. Shows confirmed (red) and pending (orange) codes with YouTube/Google links. Press Clear to erase all faults and reset Check Engine light.'
  }, {
    t: isRTL ? '✅ מוניטורים (טסט)' : '✅ Readiness',
    d: isRTL ? 'בלשונית תקלות — לחץ 🔄 ליד "מוניטורים". מראה אם בדיקות הפליטה הושלמו: קטליזטור, O2, EVAP, EGR ועוד. חשוב לטסט! ירוק=עבר, אדום=לא הושלם.' : 'In the Faults tab, press 🔄 next to Readiness. Shows which emissions tests completed: Catalyst, O2, EVAP, EGR, etc. Green=pass, Red=incomplete.'
  }, {
    t: isRTL ? '📸 Freeze Frame' : '📸 Freeze Frame',
    d: isRTL ? 'בלשונית תקלות — לחץ 📸. מציג "תמונה" של כל החיישנים ברגע שהתקלה נרשמה. אתה רואה באיזה סל"ד, טמפרטורה ומצערת הייתה הבעיה.' : 'In Faults tab, press 📸. Shows a snapshot of all sensors at the exact moment a fault was logged — RPM, temp, throttle at the time of the problem.'
  }, {
    t: isRTL ? '🔍 סריקת ECU' : '🔍 ECU Scan',
    d: isRTL ? 'לחץ "סרוק כל המחשבים" — האפליקציה עוברת על ~17 כתובות ומגלה אילו מחשבים פעילים ברכב. לחץ על מחשב פעיל לקריאת VIN, גרסאות, ק"מ ותקלות. כפתור "דוח מלא" משווה ק"מ בין כל המחשבים לגילוי הורדת ק"מ!' : 'Press "Scan All ECUs" — the app probes ~17 addresses to find active modules. Tap any active ECU to read its VIN, versions, odometer and faults. "Full Report" compares odometer across all ECUs to detect rollback!'
  }, {
    t: isRTL ? '🚗 רכב' : '🚗 Vehicle',
    d: isRTL ? 'קורא VIN (מספר שילדה), פרוטוקול תקשורת, תקן OBD, מתח מצבר, ורשימת PIDs נתמכים.' : 'Reads VIN, communication protocol, OBD standard, battery voltage, and supported PIDs list.'
  }, {
    t: isRTL ? '💻 טרמינל' : '💻 Terminal',
    d: isRTL ? 'שליחת פקודות AT ו-OBD ידנית. פקודות מהירות בלחיצה. שימושי לאבחון מתקדם ובדיקות ספציפיות.' : 'Send AT and OBD commands manually. Quick command buttons available. Useful for advanced diagnostics and specific tests.'
  }, {
    t: isRTL ? '🖨️ הדפסה / 📤 שיתוף' : '🖨️ Print / 📤 Share',
    d: isRTL ? 'כפתורים בהדר. הדפסה יוצרת דוח מלא עם כל הממצאים. שיתוף שולח סיכום ב-WhatsApp.' : 'Buttons in header. Print creates a full report. Share sends a summary via WhatsApp.'
  }, {
    t: isRTL ? '⚠️ מתאמים נתמכים' : '⚠️ Supported Adapters',
    d: isRTL ? 'נדרש מתאם ELM327 BLE (לא Classic!). מומלצים: Vgate iCar Pro BLE, OBDLink MX+. מתאמי Delphi/Autocom לא נתמכים — פרוטוקול סגור.' : 'Requires ELM327 BLE adapter (not Classic!). Recommended: Vgate iCar Pro BLE, OBDLink MX+. Delphi/Autocom not supported — proprietary protocol.'
  }, {
    t: isRTL ? '🏁 ביצועים + 🗺️ נסיעה' : '🏁 Performance + 🗺️ Trip',
    d: isRTL ? 'בדשבורד: טיימר 0-100 — לחץ "התחל מדידה" ותאיץ. מחשבון נסיעה — עוקב אחרי מרחק, זמן ומהירות ממוצעת. הקלטת נתונים — לחץ ⏺ להקלטה וייצא ל-CSV.' : 'Dashboard: 0-100 timer — press Start and accelerate. Trip computer — tracks distance, time, average speed. Recording — press ⏺ to record, export to CSV.'
  }, {
    t: isRTL ? '🔧 כלים' : '🔧 Tools',
    d: isRTL ? 'מחשבון אוהם (V/I/R), פינאוט OBD-II (9 פינים), טבלת חיישנים (12 חיישנים עם ערכים תקינים), טבלת מצבר, צבעי חיווט ל-4 יצרנים, סוגי חוטים ברכב.' : 'Ohm calculator (V/I/R), OBD-II pinout (9 pins), sensor reference (12 sensors), battery table, wire colors for 4 manufacturers, wire types.'
  }, {
    t: isRTL ? '🔔 התראות' : '🔔 Alerts',
    d: isRTL ? 'התראות אוטומטיות בדשבורד: טמפ\' מנוע מעל 105°C, מתח מתחת 11.8V או מעל 15V, סל"ד מעל 6500, LTFT מעל ±25%, שמן מעל 120°C.' : 'Auto alerts in dashboard: coolant >105°C, voltage <11.8V or >15V, RPM >6500, LTFT >±25%, oil >120°C.'
  }].map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: s.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#f59e0b',
      marginBottom: 4
    }
  }, item.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#94a3b8',
      lineHeight: 1.6
    }
  }, item.d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      textAlign: 'center',
      borderTop: '1px solid #1e293b',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#475569'
    }
  }, t('aboutTxt')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#374151',
      marginTop: 2
    }
  }, t('copy')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: '#374151',
      marginTop: 3
    }
  }, t('warn'))));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));