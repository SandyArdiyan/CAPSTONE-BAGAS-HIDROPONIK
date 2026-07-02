# PRD (Product Requirements Document)
## Hydropulse Dashboard - Sistem Pemantauan Nutrisi Hidroponik

---

## 1. Executive Summary

**Project Name:** Hydropulse Dashboard  
**Version:** 0.1.0  
**Client:** Kebun Bagas Hidroponik  
**Purpose:** Sistem monitoring real-time untuk nutrisi tanaman hidroponik dengan kontrol otomatis pompa berbasis IoT

---

## 2. Project Overview

### 2.1 Tujuan Produk
Hydropulse Dashboard adalah platform manajemen untuk sistem hidroponik otomatis yang memungkinkan:
- Pemantauan tingkat TDS (Total Dissolved Solids) nutrisi secara real-time
- Kontrol otomatis pompa nutrisi berdasarkan ambang batas TDS
- Analisis historis melalui visualisasi data grafis
- Pengaturan parameter sistem sesuai fase pertumbuhan tanaman

### 2.2 Target User
- Petani/operator sistem hidroponik
- Manajer kebun pintar
- Tim teknis pemeliharaan sistem

### 2.3 Key Features
1. **Dashboard Utama** - Tampilan real-time sensor TDS dan status pompa
2. **Analisis Grafik** - Riwayat data dengan visualisasi tren nutrisi
3. **Pengaturan Alat** - Konfigurasi parameter dan ambang batas TDS

---

## 3. Frontend Architecture

### 3.1 Technology Stack
```
- Framework: Next.js 16.2.10 (React 19.2.4)
- Language: TypeScript 5
- Styling: Tailwind CSS 4
- Type Safety: Full TypeScript coverage
- Node Runtime: Built-in with Next.js
```

### 3.2 Project Structure
```
app/
├── layout.tsx                 # Root layout dengan metadata
├── page.tsx                   # Dashboard utama
├── globals.css                # Global styles
├── api/
│   ├── sensor/route.js        # Endpoint data TDS
│   └── pump/route.js          # Endpoint status pompa
├── pengaturan/
│   └── page.tsx               # Halaman konfigurasi alat
└── riwayat/
    └── page.tsx               # Halaman analisis grafik
```

### 3.3 Component Architecture

#### 3.3.1 Dashboard Page (`app/page.tsx`)
**Tujuan:** Menampilkan monitoring real-time nutrisi dan status pompa

**State Management:**
```typescript
interface SensorLog {
  idLog: string;
  deviceId: string;
  nilai_tds: number;
  timestamp: string;
}

interface PumpLog {
  idLog: string;
  deviceId: string;
  status_pompa: string;
  timestamp_event: string;
}

const [tdsData, setTdsData] = useState<SensorLog[]>([]);
const [pumpLogs, setPumpLogs] = useState<PumpLog[]>([]);
const [loading, setLoading] = useState(true);
```

**Features:**
- Auto-refresh data setiap 10 detik
- Display TDS terkini dengan satuan PPM
- Indikator status pompa (ON/OFF) dengan color coding
- Responsive design (mobile & desktop)
- Sticky navigation bar di mobile

**UI/UX Design:**
- **Color Scheme:** Green (#166534 for sidebar), White backgrounds
- **Typography:** Bold headers, clear hierarchy
- **Spacing:** Material Design padding/margin standards
- **Icons:** Emoji indicators (💧 for water, etc.)

#### 3.3.2 Navigation System
**Sidebar (Desktop):**
- Logo branding dengan rounded border
- Menu navigation: Dasbor Utama, Analisis Grafik, Pengaturan Alat
- Active state highlighting (green 700/50 background)
- Hover effects untuk interaktivitas

**Bottom Navigation (Mobile):**
- Fixed position navigation untuk konservasi space
- Shadow effect untuk depth
- Touch-friendly tap targets

### 3.4 Data Flow

```
┌─────────────────┐
│   Dashboard     │
│    page.tsx     │
└────────┬────────┘
         │
         ├─ useEffect(() => {
         │    fetchData();
         │    setInterval(fetchData, 10000)
         │ })
         │
         ├─> GET /api/sensor
         │    └─> setTdsData(data)
         │
         └─> GET /api/pump
              └─> setPumpLogs(data)
```

### 3.5 Responsive Design Strategy
```
Mobile (< 768px):
- Single column layout
- Header dengan logo di atas
- Bottom navigation sticky bar
- Full-width cards

Desktop (≥ 768px):
- Sidebar kiri fixed (w-72)
- 2-column grid untuk cards
- Top header dengan breadcrumb
- Desktop navigation standard
```

---

## 4. Backend Architecture

### 4.1 Technology Stack
```
- Runtime: Node.js (Next.js API Routes)
- ORM: Prisma 5.22.0
- Database: PostgreSQL
- API Protocol: REST (JSON)
```

### 4.2 API Routes Architecture

#### 4.2.1 Sensor API (`/api/sensor/route.js`)

**GET Endpoint:** `GET /api/sensor`
```
Purpose: Mengambil riwayat data TDS terbaru
Response:
{
  success: true,
  data: [
    {
      idLog: "uuid",
      deviceId: "string",
      nilai_tds: 850,
      timestamp: "2026-07-03T10:30:45.000Z"
    },
    ...
  ]
}

Query Parameters:
- take: 10 (default) - Jumlah record
- orderBy: timestamp:desc (default)
```

**POST Endpoint:** `POST /api/sensor`
```
Purpose: Menerima data sensor dari ESP32
Request Body:
{
  deviceId: "string",
  nilai_tds: 850
}

Response:
{
  success: true,
  data: {
    idLog: "uuid",
    deviceId: "string",
    nilai_tds: 850,
    timestamp: "2026-07-03T10:30:45.000Z"
  }
}

Error Handling:
- 400: Data deviceId dan nilai_tds wajib ada
- 500: Internal Server Error
```

#### 4.2.2 Pump API (`/api/pump/route.js`)

**GET Endpoint:** `GET /api/pump`
```
Purpose: Mengambil status pompa terbaru
Response:
{
  success: true,
  data: [
    {
      idLog: "uuid",
      deviceId: "string",
      status_pompa: "ON" | "OFF",
      timestamp_event: "2026-07-03T10:30:45.000Z"
    }
  ]
}

Query Parameters:
- take: 1 (default) - Ambil status terakhir saja
```

**POST Endpoint:** `POST /api/pump`
```
Purpose: Mencatat perubahan status pompa dari ESP32
Request Body:
{
  deviceId: "string",
  status_pompa: "ON" | "OFF"
}

Response:
{
  success: true,
  data: {
    idLog: "uuid",
    deviceId: "string",
    status_pompa: "ON",
    timestamp_event: "2026-07-03T10:30:45.000Z"
  }
}

Error Handling:
- 400: Data deviceId dan status_pompa wajib ada
- 500: Internal Server Error
```

### 4.3 Business Logic

#### 4.3.1 Closed-Loop Control System
Sistem otomatis untuk pemeliharaan nutrisi:

```
┌──────────────────────────────────────┐
│  ESP32 Sensor membaca TDS            │
└─────────────┬────────────────────────┘
              │
              ├─ TDS < batas_bawah (560 ppm)?
              │  └─> POST /api/pump {status: "ON"}
              │      └─> Pompa Nutrisi HIDUP
              │
              ├─ TDS > batas_atas (840 ppm)?
              │  └─> POST /api/pump {status: "OFF"}
              │      └─> Pompa Nutrisi MATI
              │
              └─ TDS dalam range → Pompa OFF
```

**Parameter Konfigurasi (DeviceConfig):**
- `batas_bawah_tds`: 560 ppm (default)
- `batas_atas_tds`: 840 ppm (default)
- Dapat dikonfigurasi per fase pertumbuhan

#### 4.3.2 Data Retention Policy
- Sensor logs: Unlimited retention (historical analysis)
- Pump logs: Unlimited retention (audit trail)
- Device configs: Persistent storage

---

## 5. Database Architecture

### 5.1 Data Schema (Prisma)

#### 5.1.1 SensorLog Model
```prisma
model SensorLog {
  idLog     String   @id @default(uuid())    // Primary key
  deviceId  String                           // Device identifier
  nilai_tds Int                              // TDS value (ppm)
  timestamp DateTime @default(now())         // Auto-generated timestamp
}

Indexes:
- timestamp (for sorting/filtering historical data)
- deviceId (for device-specific queries)
```

**Purpose:** Mencatat setiap pembacaan sensor TDS dari ESP32
**Typical Record:**
```json
{
  "idLog": "550e8400-e29b-41d4-a716-446655440000",
  "deviceId": "ESP32_GARDEN_01",
  "nilai_tds": 850,
  "timestamp": "2026-07-03T10:30:45.123Z"
}
```

#### 5.1.2 PumpLog Model
```prisma
model PumpLog {
  idLog           String   @id @default(uuid())
  deviceId        String
  status_pompa    String                     // "ON" atau "OFF"
  timestamp_event DateTime @default(now())   // Event timestamp
}

Indexes:
- timestamp_event (for sorting)
- deviceId (for device-specific queries)
```

**Purpose:** Audit trail untuk setiap perubahan status pompa
**Typical Record:**
```json
{
  "idLog": "660f9500-f40c-52e5-b827-557766551111",
  "deviceId": "ESP32_GARDEN_01",
  "status_pompa": "ON",
  "timestamp_event": "2026-07-03T10:30:45.456Z"
}
```

#### 5.1.3 DeviceConfig Model
```prisma
model DeviceConfig {
  deviceId        String @id
  batas_bawah_tds Int    @default(560)     // Lower threshold
  batas_atas_tds  Int    @default(840)     // Upper threshold
}
```

**Purpose:** Menyimpan parameter kontrol per device
**Typical Record:**
```json
{
  "deviceId": "ESP32_GARDEN_01",
  "batas_bawah_tds": 560,
  "batas_atas_tds": 840
}
```

### 5.2 Database Migrations
Menggunakan Prisma migrations untuk versionning schema:
```bash
npx prisma migrate dev --name initial_setup
```

---

## 6. System Architecture Diagram

### 6.1 Overall System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     IoT ECOSYSTEM                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         WiFi/Network        ┌─────────┐   │
│  │   ESP32      │─────────────────────────────>│ Vercel  │   │
│  │ Microcontroller (Backend Processor)   │ Cloud │   │
│  │              │                               │ (Hosted)   │
│  │ ┌──────────┐ │                          ┌────────────┐   │
│  │ │TDS Sensor│ │                          │ PostgreSQL │   │
│  │ └──────────┘ │                          │ (Supabase) │   │
│  │ ┌──────────┐ │      API Calls            └────────────┘   │
│  │ │Pump      │ │      (REST/JSON)                            │
│  │ │Control   │ │                          ┌────────────┐   │
│  │ └──────────┘ │                          │ Next.js    │   │
│  └──────────────┘                          │ Dashboard  │   │
│        │                                   └────────────┘   │
│        │                                           │          │
│        └───────────────────────────────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         │
         └────> Browser (Client)
                - Mobile App
                - Desktop Web
```

### 6.2 Request/Response Flow

```
REAL-TIME MONITORING CYCLE:

Frontend (Dashboard)
│
├─ useEffect: setInterval(fetchData, 10000ms)
│
├─ GET /api/sensor
│  └─> Prisma Query: findMany (SensorLog)
│      └─> Database SELECT
│          └─ Return latest 10 records
│             └─ Response: { success, data: [] }
│                └─> setTdsData(data)
│
├─ GET /api/pump
│  └─> Prisma Query: findMany (PumpLog, take: 1)
│      └─> Database SELECT
│          └─ Return latest record
│             └─ Response: { success, data: [] }
│                └─> setPumpLogs(data)
│
└─ Render UI with updated values
   └─ Display: TDS value, Pump status
```

---

## 7. IoT Integration

### 7.1 ESP32 Integration Points

**Device Configuration:**
- Microcontroller: ESP32
- WiFi: 2.4GHz WiFi capability
- Sensors: TDS sensor on analog pin
- Actuators: Pump relay control

**Communication Protocol:**
```
Device ID Format: "ESP32_GARDEN_{NUMBER}"
Heartbeat: Every 10 seconds
Fallback: Reconnect on network failure
```

### 7.2 Sensor Data Flow

```
TDS Sensor Reading
    ↓
ESP32 Firmware: Analog → Digital Conversion
    ↓
Data Validation & Calibration
    ↓
HTTP POST /api/sensor
{
  "deviceId": "ESP32_GARDEN_01",
  "nilai_tds": <0-2000 ppm>
}
    ↓
Backend: Validate & Store in Database
    ↓
Trigger Logic: Check if TDS within bounds
    ↓
IF TDS < 560 → SIGNAL PUMP ON
IF TDS > 840 → SIGNAL PUMP OFF
    ↓
HTTP POST /api/pump
{
  "deviceId": "ESP32_GARDEN_01",
  "status_pompa": "ON" | "OFF"
}
    ↓
ESP32: Receive & Activate Pump Relay
```

---

## 8. Technology Stack Details

### 8.1 Frontend Dependencies
```json
{
  "next": "16.2.10",           // React Framework
  "react": "19.2.4",           // UI Library
  "react-dom": "19.2.4",       // DOM Rendering
  "@prisma/client": "^5.22.0"  // Database Client
}
```

### 8.2 Development Dependencies
```json
{
  "typescript": "^5",              // Type Safety
  "tailwindcss": "^4",             // Utility CSS
  "@tailwindcss/postcss": "^4",    // PostCSS Plugin
  "@types/react": "^19",           // React Types
  "@types/node": "^20",            // Node Types
  "eslint": "^9",                  // Code Linting
  "eslint-config-next": "16.2.10", // Next.js Linting
  "prisma": "^5.22.0"              // ORM CLI
}
```

### 8.3 Database
```
Provider: PostgreSQL
Hosting: Supabase (recommended)
Connection: Direct URL for edge cases
Credentials: .env.local (never commit)
```

---

## 9. Deployment Architecture

### 9.1 Vercel Deployment

**Build Process:**
```bash
1. GitHub Push (main branch)
2. Vercel Hook Triggered
3. Install Dependencies
4. Run TypeScript Type Check
5. Next.js Build (Turbopack)
6. Database Migrations (if needed)
7. Deploy to Edge Network
```

**Environment Variables (Vercel):**
```
DATABASE_URL=postgresql://user:password@host/db
DIRECT_URL=postgresql://user:password@host/db
NEXT_PUBLIC_API_URL=https://hydropulse-dashboard.vercel.app
```

**Build Configuration (`vercel.json`):**
```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### 9.2 CI/CD Pipeline

```
GitHub Repository
      │
      ├─ Event: Push to main branch
      │
      └─> GitHub Actions (optional)
          ├─ Run Linting
          ├─ Run Type Check
          ├─ Run Tests
          └─> Vercel Deployment
              ├─ Build
              ├─ Deploy
              └─ Live at: https://hydropulse-dashboard.vercel.app
```

---

## 10. Security Considerations

### 10.1 Data Security
- ✅ TLS/SSL encryption for all connections
- ✅ Database credentials in environment variables
- ✅ No sensitive data in client-side code
- ✅ Input validation on all API endpoints

### 10.2 API Security
```typescript
// Validate request body
if (!deviceId || nilai_tds === undefined) {
  return NextResponse.json(
    { error: "Data deviceId dan nilai_tds wajib ada!" }, 
    { status: 400 }
  );
}

// Sanitize string inputs
status_pompa: String(status_pompa).toUpperCase()
```

### 10.3 Recommended Enhancements
- [ ] Add API Rate Limiting
- [ ] Implement JWT Authentication
- [ ] Add CORS headers configuration
- [ ] Add request logging & monitoring
- [ ] Implement data encryption at rest

---

## 11. Performance Optimization

### 11.1 Frontend Optimization
- Next.js Image Optimization
- Automatic code splitting
- CSS-in-JS with Tailwind (purged unused styles)
- Auto-refresh interval: 10 seconds (configurable)

### 11.2 Database Optimization
```prisma
// Take only latest 10 records for dashboard
const logs = await prisma.sensorLog.findMany({
  orderBy: { timestamp: 'desc' },
  take: 10,
});

// Indexes on frequently queried columns
- timestamp (sorting)
- deviceId (filtering)
```

### 11.3 Caching Strategy
- Next.js: ISR (Incremental Static Regeneration)
- Browser cache: auto-refresh every 10 seconds
- Database query results: minimal caching (real-time requirement)

---

## 12. Monitoring & Logging

### 12.1 Frontend Logging
```typescript
catch (error) {
  console.error("Gagal mengambil data", error);
}
```

### 12.2 Backend Logging
```javascript
try {
  // ... operation
} catch (error) {
  console.error("Error GET Sensor:", error);
  return NextResponse.json(
    { success: false, error: "Internal Server Error" }, 
    { status: 500 }
  );
}
```

### 12.3 Recommended Monitoring Tools
- [ ] Sentry (Error tracking)
- [ ] LogRocket (Session replay)
- [ ] Vercel Analytics (Performance monitoring)

---

## 13. Scalability & Future Enhancements

### 13.1 Current Capacity
- Single device support (ESP32)
- Real-time updates every 10 seconds
- Historical data retention (unlimited)

### 13.2 Future Scalability
- [ ] Multi-device support (multiple ESP32 units)
- [ ] Advanced analytics dashboard
- [ ] Machine learning for predictive nutrient management
- [ ] Mobile app (React Native)
- [ ] WebSocket real-time updates
- [ ] Notification system (SMS/Email alerts)
- [ ] User authentication & role-based access

### 13.3 Data Volume Estimation
```
Per Device Per Day:
- Sensor reads: 8,640 records (10s interval × 24h × 60m)
- Data size: ~100KB (per day)
- Monthly: ~3MB

For 10 devices:
- Monthly storage: ~30MB
- PostgreSQL can easily handle this scale
```

---

## 14. Troubleshooting Guide

### 14.1 Build Errors
**Error:** TypeScript type checking fails
```
Solution: Ensure all useState hooks have proper type annotations
Example: useState<SensorLog[]>([])
```

**Error:** Database connection failed
```
Solution: Verify DATABASE_URL and DIRECT_URL in .env.local
- Check PostgreSQL service is running
- Verify credentials and host
```

### 14.2 Runtime Issues
**Issue:** Data not updating on dashboard
```
Steps:
1. Check browser console for fetch errors
2. Verify API endpoints are accessible
3. Check database connection
4. Restart application
```

**Issue:** Pump not responding to commands
```
Steps:
1. Verify ESP32 has WiFi connection
2. Check POST /api/pump requests in server logs
3. Verify GPIO pins configuration on ESP32
```

---

## 15. Documentation References

### 15.1 External Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### 15.2 Configuration Files
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `prisma/schema.prisma` - Database schema
- `.env.local` - Environment variables (local development)

---

## 16. Development Workflow

### 16.1 Local Setup
```bash
# Clone repository
git clone https://github.com/SandyArdiyan/CAPSTONE-BAGAS-HIDROPONIK

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
# App runs on http://localhost:3000
```

### 16.2 Build & Deploy
```bash
# Type check
npx tsc --noEmit

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
npm install -g vercel
vercel
```

### 16.3 Database Management
```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## 17. Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-07-03 | Initial release with dashboard, analytics, and settings |

---

## 18. Contact & Support

**Project Lead:** Sandy Ardiyan  
**Repository:** https://github.com/SandyArdiyan/CAPSTONE-BAGAS-HIDROPONIK  
**Live Demo:** https://hydropulse-dashboard.vercel.app  

---

**Document Status:** ✅ Complete  
**Last Updated:** 2026-07-03  
**Prepared for:** Capstone Project - Bagas Hidroponik
