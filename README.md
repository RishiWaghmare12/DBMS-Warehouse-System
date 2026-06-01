# 📦 Warehouse Management System (WMS)

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A modern, full-stack inventory management system** for tracking stock across categorized warehouse compartments, processing real-time transactions, and maintaining a complete audit trail of all inventory movement.

[Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture](#-system-architecture) • [API](#-api-reference) • [Deploy](#-deployment)

</div>

---

## 📋 Overview

**Warehouse Management System (WMS)** is a production-ready, full-stack inventory management solution designed for small-to-medium warehouse operations. It provides a responsive web interface for managing physical warehouse inventory organized into compartments (storage categories). 

### Key Capabilities

- 📊 **Real-time inventory tracking** across categorized compartments with live capacity visualization
- 🔄 **Dual-mode operations** — seamlessly send stock out or receive new inventory
- 📈 **Complete audit trail** — every transaction is logged with timestamps and operator context
- 🎨 **Intuitive dashboard** — modern React UI with dark/light theme support
- ⚡ **High performance** — PostgreSQL with connection pooling and optimized queries
- 🚀 **Production-ready** — one-click Vercel deployment with auto-seeded demo data

### Who It's For

- **Warehouse managers** tracking multi-category inventory across physical compartments
- **Logistics teams** needing quick send/receive workflows with audit compliance
- **Small-medium enterprises** seeking a self-hosted alternative to enterprise WMS software
- **Developers** wanting a full-stack reference implementation with clean architecture

---

## ✨ Key Features

- **📦 Compartment Management** — View all storage compartments with real-time capacity, available space, and utilization percentage indicators
- **🏷️ Per-Item Tracking** — Each item has its own quantity limit and live stock count within its compartment; granular control at every level
- **🔄 Send & Receive Workflow** — Process outbound sends and inbound receipts for existing items, or create new items on the fly during receive operations
- **🛡️ Capacity Enforcement** — Both compartment-level and item-level capacity checks prevent overfilling; descriptive API errors guide operators
- **📋 Transaction History** — Complete audit log of every send/receive operation with timestamp, item name, category, quantity, and operation type
- **🌱 Auto-Seeding** — On first startup, the database initializes five default compartments (Electronics, Appliances, Furniture, Clothing, Books) with 25 pre-populated items
- **🌓 Dark/Light Theme** — System preference auto-detection with manual toggle, persisted to browser storage
- **❤️ Health Monitoring** — `/health` endpoint confirms live DB connectivity for deployment monitoring and uptime tracking
- **⚡ Real-time UI** — Instant updates reflect inventory changes across all pages without page refreshes

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | React 19, React Router v6, Vite 6 | Modern component-based UI with client-side routing and rapid dev server |
| **Frontend HTTP** | Axios | Promised-based HTTP client for API communication with automatic error handling |
| **Backend Server** | Node.js, Express 4 | Lightweight, event-driven HTTP server with middleware support |
| **Database** | PostgreSQL 13+ | ACID-compliant relational database with built-in JSON support |
| **Database Driver** | `pg` (node-postgres) | Native PostgreSQL driver with connection pooling and retry logic |
| **Styling** | CSS3 with CSS Variables | Custom lightweight styling; no CSS framework bloat |
| **Fonts** | Lora (Google Fonts) | Beautiful serif font for typography |
| **Dev Tooling** | Nodemon, ESLint | Hot reload and code quality checking |
| **Deployment** | Vercel | Seamless serverless deployment with automatic HTTPS and CDN |

---

## 📁 Repository Structure

```
warehouse-management-system/
├── 📁 Backend/                         # Express REST API server
│   ├── 📁 config/
│   │   └── db.js                       # PostgreSQL connection pool setup with retry logic
│   ├── 📁 db/
│   │   ├── init.js                     # Auto-seeding logic for demo data
│   │   └── setup.sql                   # DDL: schema definition, tables, indexes
│   ├── 📁 models/
│   │   ├── Category.js                 # Compartment operations: getAll, getById, capacity checks
│   │   ├── Item.js                     # Item CRUD: create, read, update; quantity validation
│   │   └── Transaction.js              # Transaction log: create, query by type/item/date
│   ├── 📁 routes/
│   │   ├── compartments.js             # GET /api/compartments*, POST capacity updates
│   │   ├── items.js                    # GET /api/items*, item-level operations
│   │   └── transactions.js             # GET/POST /api/transactions (send & receive workflows)
│   ├── index.js                        # Express app entry point, middleware setup
│   ├── vercel.json                     # Vercel serverless deployment config
│   ├── .env.example                    # Environment variable template
│   └── package.json                    # Backend dependencies
│
└── 📁 FrontEnd/                        # React Vite SPA
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── Navbar.jsx              # Main navigation bar with theme toggle
    │   │   ├── Header.jsx              # Page header component
    │   │   ├── ThemeToggle.jsx         # Dark/light mode toggle button
    │   │   ├── 📁 Warehouse/
    │   │   │   ├── Compartment.jsx     # Expandable compartment card (single)
    │   │   │   └── CompartmentList.jsx # Renders all compartments in grid
    │   │   └── 📁 Reports/
    │   │       ├── WarehouseReport.jsx # Warehouse overview with charts
    │   │       ├── ReceivingForm.jsx   # Form to receive new items
    │   │       ├── SendingForm.jsx     # Form to send items out
    │   │       ├── ItemOperationsForm.jsx # Generic item operations
    │   │       ├── 📁 Receiving/
    │   │       │   ├── SpaceReport.jsx # Available space visualization
    │   │       │   └── ReceivingReport.jsx # Receiving transaction details
    │   │       └── 📁 Sending/
    │   │           ├── InventoryReport.jsx # Current inventory view
    │   │           └── SendingReport.jsx   # Sending transaction details
    │   ├── 📁 pages/
    │   │   ├── HomePage.jsx            # Landing page with feature overview
    │   │   ├── WarehousePage.jsx       # Compartment inventory view
    │   │   ├── SendReceivePage.jsx     # Unified send/receive operations
    │   │   ├── ReceivingPage.jsx       # Dedicated receiving interface
    │   │   ├── SendingPage.jsx         # Dedicated sending interface
    │   │   └── TransactionsPage.jsx    # Complete transaction audit log
    │   ├── 📁 context/
    │   │   └── ThemeContext.jsx        # Global theme state (dark/light) with localStorage
    │   ├── 📁 services/
    │   │   └── api.js                  # Axios client instance + all API endpoints
    │   ├── App.jsx                     # Root component with routing
    │   ├── App.css                     # Global styles
    │   ├── main.jsx                    # React entry point
    │   └── index.html                  # HTML template
    ├── vite.config.js                  # Vite build configuration
    ├── .env.example                    # Environment variable template
    ├── package.json                    # Frontend dependencies
    └── index.html                      # Static HTML template
```

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Browser["🌐 Browser<br/>React 19 + Vite SPA"]
    
    subgraph Frontend["Frontend (React)"]
        Pages["📄 Pages<br/>Warehouse | Send-Receive<br/>Receiving | Sending | Transactions"]
        Components["🧩 Components<br/>CompartmentList | Forms<br/>Reports | Theme"]
        APIClient["🔗 api.js<br/>Axios HTTP Client"]
        Context["🎨 ThemeContext<br/>Dark/Light Mode"]
    end
    
    subgraph Backend["Backend (Express)"]
        Routes["🛣️ API Routes<br/>/compartments | /items<br/>/transactions | /health"]
        Models["📦 Models<br/>Category | Item<br/>Transaction"]
        Pool["🔌 pg Connection Pool<br/>Max 1 connection<br/>Retry Logic"]
    end
    
    DB[(🗄️ PostgreSQL<br/>categories<br/>items<br/>transactions)]
    
    Browser -->|renders| Pages
    Pages -->|uses| Components
    Components -->|API calls| APIClient
    Components -->|theme state| Context
    APIClient -->|HTTP REST| Routes
    Routes -->|query/update| Models
    Models -->|execute| Pool
    Pool -->|SQL| DB
    
    style Frontend fill:#e1f5fe
    style Backend fill:#f3e5f5
    style DB fill:#fff3e0
```

### Component Communication Flow

1. **User Interaction** → React component dispatches action (Send/Receive)
2. **API Call** → `api.js` constructs request with payload (itemId, quantity, etc.)
3. **Backend Validation** → Route handler validates input and checks constraints
4. **Database Transaction** → Model executes SQL with automatic rollback on error
5. **Response** → Success/error response sent back to frontend
6. **UI Update** → Component re-renders with new data or error message

### Request Flow — Receive New Item

```
User selects "Receive Items" and fills form
         ↓
POST /api/transactions/receive
{ categoryId: 1, itemName: "Drone", quantity: 5 }
         ↓
Backend Validation
  ✓ Category exists?
  ✓ Compartment has available space?
  ✓ Quantity ≤ item max (100)?
         ↓
Database Operations
  → Item.create() — Insert new item record
  → Item.updateQuantity(5) — Set initial quantity
  → Transaction.create('RECEIVE') — Log transaction
  → Category.updateCapacity() — Increment used space
         ↓
Response → 200 { transaction, item }
         ↓
Frontend Updates UI with new item and transaction card
```

### Request Flow — Send Existing Item

```
User selects item and enters quantity to send
         ↓
POST /api/transactions/send
{ itemId: 3, quantity: 10 }
         ↓
Backend Validation
  ✓ Item exists?
  ✓ Current quantity ≥ requested quantity?
         ↓
Database Operations (Transactional)
  BEGIN TRANSACTION
    → Item.updateQuantity(-10) — Decrement stock
    → Transaction.create('SEND') — Log transaction
    → Category.updateCapacity() — Decrement used space
  COMMIT
         ↓
Response → 200 { transaction, item }
         ↓
Frontend Reflects updated inventory count in UI
```

---

## 🗄️ Database Schema

```sql
-- Compartments (storage categories)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    max_capacity INT NOT NULL,           -- e.g., 500
    current_capacity INT DEFAULT 0,       -- Total items currently stored
    created_at TIMESTAMP DEFAULT NOW()
);

-- Individual items within compartments
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,            -- FK to categories
    max_quantity INT NOT NULL,           -- e.g., 100 units per item
    current_quantity INT DEFAULT 0,      -- Current stock
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    UNIQUE (name, category_id)           -- No duplicate items in same category
);

-- Complete transaction log
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,                -- FK to items
    category_id INT NOT NULL,            -- FK to categories (for quick filtering)
    quantity INT NOT NULL,
    transaction_type VARCHAR(10)         -- 'SEND' or 'RECEIVE'
        CHECK (transaction_type IN ('SEND', 'RECEIVE')),
    transaction_date TIMESTAMP DEFAULT NOW()
        NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Performance indexes
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_transactions_item_id ON transactions(item_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
```

**Key Design Decisions:**
- ✅ **Composite unique constraint** on `(name, category_id)` prevents item duplicates within a compartment
- ✅ **Denormalized `category_id`** in transactions table enables fast filtering without joins
- ✅ **CHECK constraint** on transaction type prevents invalid values at DB level
- ✅ **Indexes on foreign keys and transaction type** for sub-second query performance

---

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api
```

### Health Check

| Method | Endpoint | Response |
|---|---|---|
| GET | `/health` | `{ "status": "healthy", "dbConnection": "connected", "timestamp": "2025-06-01T..." }` |

### Compartments (Warehouse Categories)

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| GET | `/compartments` | Fetch all compartments with items and utilization % | — |
| GET | `/compartments/:id` | Fetch single compartment with its items | — |
| GET | `/compartments/available/space` | Get available space for each compartment | — |

**Response Example:**
```json
{
  "category_id": 1,
  "name": "Electronics",
  "max_capacity": 500,
  "current_capacity": 180,
  "utilization_percent": 36,
  "items": [
    { "item_id": 1, "name": "Laptop", "current_quantity": 45, "max_quantity": 100 }
  ]
}
```

### Items

| Method | Endpoint | Description |
|---|---|---|
| GET | `/items` | All items across all compartments |
| GET | `/items/:id` | Single item details |
| GET | `/items/category/:categoryId` | Items filtered by compartment |

**Response Example:**
```json
{
  "item_id": 1,
  "name": "Laptop",
  "category_id": 1,
  "category_name": "Electronics",
  "max_quantity": 100,
  "current_quantity": 45
}
```

### Transactions (Send/Receive Operations)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | All transactions (newest first) |
| GET | `/transactions/item/:itemId` | Transactions for specific item |
| GET | `/transactions/type/:type` | Filter by `SEND` or `RECEIVE` |
| POST | `/transactions/send` | Send items out of warehouse |
| POST | `/transactions/receive` | Receive items into warehouse |

#### Send Items

**Request:**
```json
POST /api/transactions/send
{
  "itemId": 3,
  "quantity": 10
}
```

**Response (Success):**
```json
{
  "success": true,
  "transaction": {
    "transaction_id": 25,
    "item_id": 3,
    "quantity": 10,
    "transaction_type": "SEND",
    "transaction_date": "2025-06-01T10:30:00Z"
  },
  "item": {
    "item_id": 3,
    "current_quantity": 35
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Insufficient quantity. Current: 5, Requested: 10"
}
```

#### Receive Items (Existing Item)

**Request:**
```json
POST /api/transactions/receive
{
  "itemId": 3,
  "quantity": 10
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { /* same as send */ },
  "item": { "item_id": 3, "current_quantity": 55 }
}
```

#### Receive Items (New Item)

**Request:**
```json
POST /api/transactions/receive
{
  "categoryId": 1,
  "itemName": "Drone",
  "quantity": 5
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { /* transaction record */ },
  "item": {
    "item_id": 50,
    "name": "Drone",
    "category_id": 1,
    "max_quantity": 100,
    "current_quantity": 5
  }
}
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x ([Download](https://nodejs.org/))
- **PostgreSQL** ≥ 13 ([Download](https://www.postgresql.org/) or use [Docker](https://hub.docker.com/_/postgres))
- **npm** (bundled with Node.js)
- **Git** (for cloning the repository)

---

## 📥 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/RishiWaghmare12/DBMS-Warehouse-System.git
cd DBMS-Warehouse-System
```

---

### 2️⃣ Backend Setup

#### Install Dependencies

```bash
cd Backend
npm install
```

#### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
# PostgreSQL connection string
POSTGRES_URI=postgres://username:password@localhost:5432/warehouse

# Express server port
PORT=3000

# Node environment
NODE_ENV=development
```

**PostgreSQL URI Format:**
```
postgres://[user]:[password]@[host]:[port]/[database]
```

#### Start the Backend

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

**What happens on startup:**
1. ✅ Connects to PostgreSQL
2. ✅ Runs `setup.sql` (creates tables if they don't exist)
3. ✅ Seeds 5 compartments with 25 items if database is empty

#### Verify Backend Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "dbConnection": "connected",
  "timestamp": "2025-06-01T10:00:00.000Z"
}
```

---

### 3️⃣ Frontend Setup

#### Install Dependencies

```bash
cd ../FrontEnd
npm install
```

#### Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

#### Start Development Server

```bash
npm run dev
```

The app will be available at **`http://localhost:5173`** 🎉

#### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

---

## 📖 Usage Guide

### 🏭 Warehouse View

Navigate to the **Warehouse** page to see all compartments:

- 📊 Real-time capacity bar showing utilization percentage
- 🟢 Green (0-60%), 🟡 Amber (60-85%), 🔴 Red (85-100%)
- Click any compartment card to expand and view individual items
- See item name, current quantity, and max quantity

### 📥 Receiving Items

#### Option 1: Receive to Existing Item

1. Go to **Send/Receive** page
2. Click **Receive Items** tab
3. Select an existing item from dropdown
4. Enter quantity
5. Click **Receive**

#### Option 2: Create New Item

1. Go to **Receiving** dedicated page (if available)
2. Select compartment
3. Enter new item name
4. Enter initial quantity
5. Click **Create & Receive**

### 📤 Sending Items

1. Go to **Send/Receive** page
2. Click **Send Items** tab
3. Select item from dropdown
4. Enter quantity to send
5. Click **Send** (will fail if insufficient stock)

### 📋 Transaction History

Navigate to **Transactions** page to see all operations:

- 🟢 Green cards = RECEIVE operations
- 🔴 Red cards = SEND operations
- Sorted by most recent first
- Shows item name, quantity, category, timestamp
- Click **Refresh** to fetch latest transactions

---

## Pages at a Glance

| Page | Route | Description |
|---|---|---|
| Home | `/` | Feature overview with navigation links |
| Warehouse | `/warehouse` | Live compartment grid with expandable item detail |
| Send / Receive | `/send-receive` | Item selection and quantity form for both operations |
| Transactions | `/transactions` | Full audit log with type-coded cards |

---

## Default Seed Data

On first run the system populates the following compartments and items:

| Compartment | Items (initial qty) |
|---|---|
| Electronics | Laptop (45), Smartphone (75), Tablet (30), Headphones (50), Smartwatch (40) |
| Appliances | Refrigerator (15), Microwave (25), Washing Machine (10), Air Conditioner (20), Vacuum Cleaner (30) |
| Furniture | Office Chair (20), Desk (15), Bookshelf (10), Sofa (12), Coffee Table (18) |
| Clothing | T-Shirts (60), Jeans (40), Jackets (25), Dresses (35), Sweaters (45) |
| Books | Fiction (80), Non-Fiction (65), Technical (50), Children (70), Educational (55) |

All compartments have a max capacity of 500; all items have a max quantity of 100.

---

## Deployment

The backend includes a `vercel.json` that routes all requests through `index.js`, making it deployable to Vercel with zero additional configuration.

```json
{
  "version": 2,
  "builds": [{ "src": "index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/index.js" }]
}
```

Set `POSTGRES_URI` and `PORT` as environment variables in your Vercel project settings. For production, the DB config automatically enables `ssl: { rejectUnauthorized: false }` when `NODE_ENV=production`.

The frontend can be deployed to Vercel, Netlify, or any static host after running `npm run build`. Set `VITE_API_URL` to your deployed backend URL before building.

---

## Future Improvements

- **Authentication** — Add JWT-based login so different operators can be tracked per transaction
- **Role-based access** — Read-only viewers vs. operators who can send/receive
- **Barcode/QR scanning** — Camera-based item lookup on the send/receive page
- **Pagination** — The transactions list will grow unbounded; add cursor-based pagination to the API and UI
- **Search and filtering** — Filter transactions by date range, item, or category
- **Export to CSV** — Allow operators to download transaction history for reporting
- **Alerts** — Email or in-app notification when a compartment exceeds a configurable threshold (e.g., 90% full)
- **Multi-warehouse support** — Add a warehouse tier above categories for multi-site operations
- **Connection pool tuning** — The pool is currently capped at `max: 1`; increase for production load

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with a clear message: `git commit -m "feat: add barcode scanning support"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request describing what you changed and why

Please make sure the backend starts without errors (`npm run dev`) and the frontend builds cleanly (`npm run build`) before submitting.

---

## License

This project is open source. Add a `LICENSE` file to the repository root if you wish to specify terms (MIT is recommended for open-source projects).

---

<div align="center">
Built with Node.js, Express, PostgreSQL, and React
</div>
