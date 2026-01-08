# حل ربط الماسح الضوئي المحلي السوداني

حل محلي متكامل لربط أجهزة الماسح الضوئي بمتصفحات الويب باستخدام خدمة Python في الخلفية وواجهة React في الأمام. يتيح سير عمل "مسح إلى نموذج" سلس دون الحاجة إلى تحميل الملفات يدويًا.

## نظرة عامة

يوفر هذا المشروع حلاً متكاملاً لدمج الماسح الضوئي محليًا يقوم بـ:

- **ربط الماسحات الضوئية بالويب**: يربط ماسحات TWAIN/WIA (Windows) و SANE (Linux) و ICA (macOS) مباشرة بتطبيقات الويب
- **معمارية محلية أولاً**: يعمل بالكامل على جهازك - بدون خدمات سحابية أو تبعيات خارجية
- **تحديثات فورية**: اتصال WebSocket يوفر تحديثات حالة المسح والتقدم الفورية
- **دعم ماسحات متعددة**: يكتشف تلقائيًا ويسمح بالاختيار من بين ماسحات متعددة متصلة
- **تحسين الصور**: يحول ويضغط الصور الممسوحة ضوئيًا قبل إرسالها إلى المتصفح
- **بدون إعدادات معقدة**: اكتشاف تلقائي للماسح وإعداد بسيط جدًا

## المعمارية التقنية

```
┌─────────────────────────────────────────────────────────────────┐
│                   متصفح الويب (React)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  واجهة المسح | اختيار الماسح | معاينة الصور             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│                    REST API + WebSocket                         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│         خدمة Python في الخلفية (Flask/FastAPI)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  مدير الماسح | معالج الصور | معالج WebSocket           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              برامج تشغيل الماسح الخاصة بالمنصة                 │
│  ┌──────────────┬──────────────┬──────────────────────────┐    │
│  │   TWAIN      │     WIA      │        SANE              │    │
│  │  (Windows)   │  (Windows)   │      (Linux)             │    │
│  └──────────────┴──────────────┴──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## المتطلبات التقنية

### متطلبات النظام

- **Python**: الإصدار 3.8 أو أحدث
- **Node.js**: الإصدار 16 أو أحدث
- **الماسح الضوئي**: جهاز متصل وبرامج التشغيل مثبتة
- **الذاكرة**: 512 ميجابايت على الأقل
- **المساحة**: 500 ميجابايت للتثبيت

### متطلبات منصة محددة

**Windows:**
- برامج تشغيل TWAIN أو WIA
- Visual C++ Redistributable
- .NET Framework 4.5+

**Linux:**
- حزمة SANE: `sudo apt-get install sane-utils`
- libusb-1.0: `sudo apt-get install libusb-1.0-0`
- صلاحيات المستخدم: إضافة المستخدم إلى مجموعة scanner

**macOS:**
- برامج التشغيل مدمجة (ICA)
- macOS 10.12 أو أحدث

## خطوات التثبيت والتشغيل

### 1. استنساخ المستودع

```bash
git clone https://github.com/yourusername/scanner-bridge.git
cd scanner-bridge
```

### 2. إعداد خدمة Python

```bash
cd backend

# إنشاء بيئة افتراضية
python -m venv venv

# تفعيل البيئة الافتراضية
source venv/bin/activate  # على Windows: venv\Scripts\activate

# تثبيت المكتبات
pip install -r requirements.txt

# تشغيل الخدمة
python app.py
```

**الإخراج المتوقع:**
```
 * Running on http://127.0.0.1:5000
 * Scanner detection initialized
 * WebSocket server ready
```

### 3. إعداد واجهة React

في نافذة طرفية جديدة:

```bash
cd frontend

# تثبيت المكتبات
npm install

# تشغيل خادم التطوير
npm start
```

**الإخراج المتوقع:**
```
Compiled successfully!
You can now view the app in the browser at http://localhost:3000
```

### 4. الوصول إلى التطبيق

افتح متصفحك وانتقل إلى: **http://localhost:3000**

## نقاط النهاية (API Endpoints)

### إدارة الماسحات

| الطريقة | النقطة | الوصف |
|--------|--------|-------|
| GET | `/api/scanners` | قائمة بجميع الماسحات المتاحة |
| POST | `/api/scanners/select` | اختيار ماسح نشط |
| GET | `/api/scanners/current` | الحصول على الماسح المختار حاليًا |
| GET | `/api/scanners/{id}/info` | معلومات تفصيلية عن ماسح معين |

### عمليات المسح

| الطريقة | النقطة | الوصف |
|--------|--------|-------|
| POST | `/api/scan` | بدء عملية مسح جديدة |
| GET | `/api/scan/status` | الحصول على حالة المسح الحالية |
| GET | `/api/scan/history` | قائمة بجميع عمليات المسح السابقة |
| GET | `/api/scan/{id}` | الحصول على صورة ممسوحة محددة |
| DELETE | `/api/scan/{id}` | حذف صورة ممسوحة |

### WebSocket للتحديثات الفورية

```
ws://localhost:5000/ws/scan
```

**رسائل الحالة:**
```json
{
  "type": "scan_started",
  "timestamp": "2026-01-08T10:30:00Z",
  "scanner_id": "scanner_1"
}
```

## أمثلة الاستخدام

### 1. الحصول على قائمة الماسحات

```bash
curl http://localhost:5000/api/scanners
```

**الاستجابة:**
```json
{
  "scanners": [
    {
      "id": "scanner_1",
      "name": "HP ScanJet Pro 3000 s3",
      "manufacturer": "HP",
      "status": "available"
    },
    {
      "id": "scanner_2",
      "name": "Canon imageFORMULA DR-G1130",
      "manufacturer": "Canon",
      "status": "available"
    }
  ]
}
```

### 2. اختيار ماسح

```bash
curl -X POST http://localhost:5000/api/scanners/select \
  -H "Content-Type: application/json" \
  -d '{"scanner_id": "scanner_1"}'
```

### 3. بدء عملية مسح

```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "scanner_id": "scanner_1",
    "format": "jpeg",
    "resolution": 300,
    "color_mode": "color"
  }'
```

**الاستجابة:**
```json
{
  "scan_id": "scan_20260108_103000",
  "status": "scanning",
  "progress": 0,
  "timestamp": "2026-01-08T10:30:00Z"
}
```

### 4. الاتصال بـ WebSocket

```javascript
const ws = new WebSocket('ws://localhost:5000/ws/scan');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Scan status:', data);
  // تحديث واجهة المستخدم
};
```

## ملف الإعدادات

يقع في `config/scanner.config.json`:

```json
{
  "scanner": {
    "default_format": "jpeg",
    "compression_quality": 85,
    "max_image_size": 5242880,
    "timeout": 30,
    "resolution": 300,
    "color_mode": "color"
  },
  "api": {
    "host": "localhost",
    "port": 5000,
    "cors_origins": ["http://localhost:3000"],
    "max_request_size": 10485760
  },
  "storage": {
    "temp_dir": "./temp",
    "cache_dir": "./cache",
    "max_cache_size": 104857600
  }
}
```

## طريقة الاختبار

### الاختبار اليدوي

**1. التحقق من اكتشاف الماسح:**

```bash
# تأكد من أن الماسح متصل
curl http://localhost:5000/api/scanners

# يجب أن ترى قائمة بالماسحات المتاحة
```

**2. اختبار عملية المسح:**

```bash
# ضع مستند في الماسح
# ثم أرسل طلب المسح
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"scanner_id": "scanner_1", "format": "jpeg"}'

# تحقق من حالة المسح
curl http://localhost:5000/api/scan/status
```

**3. اختبار الواجهة:**

- افتح http://localhost:3000
- اختر ماسح من القائمة
- اضغط زر "مسح"
- تحقق من ظهور الصورة

### الاختبار الآلي

```bash
cd backend

# تشغيل اختبارات الوحدة
pytest tests/ -v

# اختبار التغطية
pytest tests/ --cov=. --cov-report=html
```

## معالجة المشاكل الشائعة

### المشكلة: الماسح غير مكتشف

**على Windows:**
```
✓ تأكد من تثبيت برامج تشغيل TWAIN
✓ افتح إدارة الأجهزة وتحقق من الماسح
✓ أعد تشغيل الخدمة
```

**على Linux:**
```bash
# تثبيت SANE
sudo apt-get install sane-utils libusb-1.0-0

# إضافة المستخدم إلى مجموعة scanner
sudo usermod -a -G scanner $USER

# إعادة تشغيل الخدمة
```

**على macOS:**
```
✓ الماسح يجب أن يظهر تلقائيًا
✓ تحقق من الإعدادات > الطابعات والماسحات الضوئية
```

### المشكلة: فشل الاتصال

```bash
# تحقق من أن الخدمة تعمل
curl http://localhost:5000/api/scanners

# تحقق من المنافذ
lsof -i :5000
lsof -i :3000

# تحقق من جدار الحماية
# تأكد من السماح بالمنافذ 5000 و 3000
```

### المشكلة: جودة الصورة منخفضة

```json
// عدّل في config/scanner.config.json
{
  "scanner": {
    "compression_quality": 95,  // زيادة الجودة
    "resolution": 600           // زيادة الدقة
  }
}
```

## دعم Docker

### بناء صورة Docker

```bash
docker build -t scanner-bridge:latest .
```

### تشغيل الحاوية

```bash
docker run -d \
  -p 3000:3000 \
  -p 5000:5000 \
  --device /dev/usb \
  --device /dev/bus/usb \
  --name scanner-bridge \
  scanner-bridge:latest
```

### التحقق من حالة الحاوية

```bash
docker logs scanner-bridge
docker ps
```

## هيكل المشروع

```
scanner-bridge/
│
├── backend/                    # خدمة Python
│   ├── app.py                 # التطبيق الرئيسي
│   ├── scanner_manager.py     # إدارة الماسح
│   ├── image_processor.py     # معالجة الصور
│   ├── websocket_handler.py   # معالج WebSocket
│   ├── requirements.txt       # مكتبات Python
│   ├── tests/                 # اختبارات الوحدة
│   └── config.py              # إعدادات الخدمة
│
├── frontend/                   # تطبيق React
│   ├── src/
│   │   ├── components/        # مكونات React
│   │   ├── pages/             # صفحات التطبيق
│   │   ├── hooks/             # hooks مخصصة
│   │   ├── styles/            # أنماط CSS
│   │   └── App.tsx            # المكون الرئيسي
│   ├── public/                # موارد ثابتة
│   ├── package.json           # مكتبات Node.js
│   └── tsconfig.json          # إعدادات TypeScript
│
├── config/                     # ملفات الإعدادات
│   └── scanner.config.json    # إعدادات الماسح
│
├── docs/                       # التوثيق الإضافية
│   ├── ARCHITECTURE.md        # شرح المعمارية
│   ├── API.md                 # توثيق API
│   └── TROUBLESHOOTING.md     # حل المشاكل
│
├── tests/                      # اختبارات التكامل
│   └── integration_test.py    # اختبارات التكامل
│
├── Dockerfile                  # إعدادات Docker
├── docker-compose.yml          # Docker Compose
├── .gitignore                  # ملفات Git المستثناة
├── LICENSE                     # رخصة المشروع
├── README.md                   # التوثيق الإنجليزية
└── README_AR.md               # التوثيق العربية (هذا الملف)
```

## المميزات المدعومة

### ✅ دعم المنصات

- **Windows**: TWAIN و WIA
- **Linux**: SANE
- **macOS**: ICA (Image Capture Architecture)

### ✅ صيغ الصور

- JPEG (مع ضغط قابل للتحكم)
- PNG (بدون فقدان)
- TIFF (للأرشفة)
- PDF (لعدة صفحات)

### ✅ خيارات المسح

- الدقة (من 75 إلى 1200 DPI)
- أنماط الألوان (أبيض وأسود، رمادي، ملون)
- حجم الورقة (A4، Letter، Custom)
- الجانب الواحد أو الجانبين

### ✅ معالجة الصور

- تدوير تلقائي
- اكتشاف الحواف
- تصحيح الانحراف
- ضغط ذكي

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. انظر ملف LICENSE للتفاصيل.

## الدعم والمساهمة

### الإبلاغ عن المشاكل

1. افتح issue على GitHub
2. صف المشكلة بالتفصيل
3. أرفق السجلات ذات الصلة

### المساهمة

1. انسخ المستودع (Fork)
2. أنشئ فرع للميزة الجديدة
3. أرسل طلب دمج (Pull Request)

## الإقرارات

تم بناء هذا الحل لتحدي البرمجة السوداني 2026، مما يتيح حلولاً عملية محلية لمشاكل واقعية تواجه الأنظمة المحلية في بيئات محدودة الموارد.

---

**الحالة**: إصدار تجريبي (v0.1.0)  
**آخر تحديث**: يناير 2026  
**المسؤول**: [اسمك]

## أسئلة شائعة

**س: هل يعمل الحل بدون اتصال بالإنترنت؟**
ج: نعم، تماماً. الحل يعمل محليًا 100% ولا يتطلب أي اتصال بالإنترنت.

**س: هل يدعم ماسحات متعددة في نفس الوقت؟**
ج: الحل يدعم اكتشاف ماسحات متعددة، لكن يمكن استخدام واحد في المرة الواحدة.

**س: ما هي أقصى دقة مدعومة؟**
ج: تصل إلى 1200 DPI حسب إمكانيات الماسح.

**س: هل يمكن دمج الحل في تطبيق موجود؟**
ج: نعم، API RESTful يسهل التكامل مع أي تطبيق ويب.

**س: كيف أتعامل مع الأخطاء؟**
ج: جميع الأخطاء تُرسل عبر API مع رسائل واضحة وأكواد الخطأ.
