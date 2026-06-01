# Warehouse Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A full-stack warehouse inventory management system for tracking stock across categorized compartments, processing send/receive transactions, and monitoring inventory movement history.

</div>

---

## Overview

This Warehouse Management System (WMS) provides a web-based interface for managing physical warehouse inventory organized into compartments (categories). Each compartment holds multiple item types, each with configurable quantity limits. Operators can receive new stock, send existing stock out, and review a full audit trail of every transaction.

The backend exposes a REST API backed by PostgreSQL with connection pooling and retry logic. The React frontend communicates with the API via Axios and supports light/dark theming.

**Who it's for:** Small-to-medium warehouse teams that need a straightforward, self-hosted inventory tool without the overhead of enterprise WMS software.

---

## Key Features

- **Compartment overview** — View all storage compartments with current capacity, available space, and utilization percentage
- **Per-item tracking** — Each item has its own quantity limit and live stock count within its compartment
- **Send & Receive workflow** — Process outbound sends and inbound receipts for existing items, or create new items on the fly during a receive operation
- **Capacity enforcement** — Both compartment-level and item-level capacity checks prevent overfilling; the API returns descriptive errors when limits are breached
- **Transaction history** — Every send/receive operation is logged with timestamp, item, category, quantity, and type
- **Auto-seeding** — On first startup the database initializes five default compartments (Electronics, Appliances, Furniture, Clothing, Books) with pre-populated items
- **Dark/light theme** — System preference detection with manual toggle, persisted to `localStorage`
- **Health check endpoint** — `/health` route confirms live DB connectivity for deployment monitoring

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v6, Axios, Vite 6 |
| **Backend** | Node.js, Express 4 |
| **Database** | PostgreSQL (via `pg` connection pool) |
| **Styling** | Custom CSS with CSS variables, Lora font (Google Fonts) |
| **Dev tooling** | Nodemon, ESLint, `@vitejs/plugin-react` |
| **Deployment** | Vercel (backend `vercel.json` config included) |

---

## Repository Structure

```
warehouse-management-system/
├── Backend/
│   ├── config/
│   │   └── db.js               # PostgreSQL pool setup, retry logic
│   ├── db/
│   │   ├── init.js             # DB seeding on startup
│   │   └── setup.sql           # DDL: categories, items, transactions tables + indexes
│   ├── models/
│   │   ├── Category.js         # getAll, getById, updateCapacity, checkAvailableSpace
│   │   ├── Item.js             # CRUD, quantity checks, space checks
│   │   └── Transaction.js      # create, getAll, getByItemId, getByCategoryId, getByType
│   ├── routes/
│   │   ├── compartments.js     # GET /api/compartments, GET /api/compartments/:id
│   │   ├── items.js            # GET /api/items, /api/items/:id, /api/items/category/:id
│   │   └── transactions.js     # GET/POST /api/transactions (send + receive)
│   ├── index.js                # Express app entry point
│   ├── vercel.json             # Vercel deployment config
│   ├── .env.example
│   └── package.json
│
└── FrontEnd/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ThemeToggle.jsx
    │   │   ├── Reports/
    │   │   │   ├── ReceivingForm.jsx
    │   │   │   ├── SendingForm.jsx
    │   │   │   ├── WarehouseReport.jsx
    │   │   │   ├── Receiving/          # SpaceReport, ReceivingReport
    │   │   │   └── Sending/            # InventoryReport, SendingReport
    │   │   └── Warehouse/
    │   │       ├── Compartment.jsx     # Expandable compartment card
    │   │       └── CompartmentList.jsx # Fetches and renders all compartments
    │   ├── context/
    │   │   └── ThemeContext.jsx        # Dark/light mode context + localStorage
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── WarehousePage.jsx
    │   │   ├── SendReceivePage.jsx
    │   │   └── TransactionsPage.jsx
    │   ├── services/
    │   │   └── api.js                  # Axios client, all API calls
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── .env.example
    ├── vite.config.js
    └── package.json
```

---

## System Architecture

```mermaid
flowchart TD
    Browser["Browser (React 19 + Vite)"]

    subgraph Frontend
        Pages["Pages\n(Warehouse / Send-Receive / Transactions)"]
        API_SVC["api.js\n(Axios client)"]
        CTX["ThemeContext"]
    end

    subgraph Backend ["Backend (Express on Node.js)"]
        Routes["Routes\n/compartments  /items  /transactions"]
        Models["Models\nCategory  Item  Transaction"]
        Pool["pg Connection Pool\n(max 1, retry logic)"]
    end

    DB[(PostgreSQL\ncategories / items / transactions)]

    Browser --> Pages
    Pages --> API_SVC
    API_SVC -->|HTTP REST| Routes
    Routes --> Models
    Models --> Pool
    Pool --> DB
```

### Request Flow — Receive New Item

```
POST /api/transactions/receive  { categoryId, itemName, quantity }
  → Check category exists
  → Check compartment has available space
  → Validate quantity ≤ item max (100)
  → Item.create()  →  Item.updateQuantity()  →  Transaction.create('RECEIVE')
  → Update categories.current_capacity
  ← 200 { transaction, item }
```

### Request Flow — Send Existing Item

```
POST /api/transactions/send  { itemId, quantity }
  → Item.checkQuantityForSend()
  → Item.updateQuantity(-quantity)  [wrapped in BEGIN/COMMIT]
  → Transaction.create('SEND')
  → categories.current_capacity decremented
  ← 200 { transaction, item }
```

---

## Database Schema

```sql
categories  (category_id PK, name UNIQUE, max_capacity, current_capacity)
items       (item_id PK, name, category_id FK → categories, max_quantity, current_quantity)
            UNIQUE (name, category_id)
transactions (transaction_id PK, item_id FK → items, quantity,
              transaction_type CHECK('SEND','RECEIVE'), transaction_date)
```

Indexes are created on `items.category_id`, `transactions.item_id`, `transactions.transaction_type`, and `transactions.transaction_date`.

---

## API Reference

### Compartments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/compartments` | All compartments with items and utilization % |
| GET | `/api/compartments/:id` | Single compartment with its items |
| GET | `/api/compartments/available/space` | Available space per compartment |

### Items

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/items` | All items with category info |
| GET | `/api/items/:id` | Single item |
| GET | `/api/items/category/:categoryId` | Items filtered by category |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | All transactions (newest first) |
| GET | `/api/transactions/item/:itemId` | Transactions for a specific item |
| GET | `/api/transactions/type/:type` | Filter by `SEND` or `RECEIVE` |
| POST | `/api/transactions/send` | Send items out of warehouse |
| POST | `/api/transactions/receive` | Receive items into warehouse |

**POST `/api/transactions/send` body:**
```json
{ "itemId": 3, "quantity": 10 }
```

**POST `/api/transactions/receive` body (existing item):**
```json
{ "itemId": 3, "quantity": 10 }
```

**POST `/api/transactions/receive` body (new item):**
```json
{ "categoryId": 1, "itemName": "Drone", "quantity": 5 }
```

---

## Installation & Setup

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 13 (running locally or a hosted instance)
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/warehouse-management-system.git
cd warehouse-management-system
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Copy the example environment file and fill in your PostgreSQL credentials:

```bash
cp .env.example .env
```

`.env` contents:

```env
POSTGRES_URI=postgres://username:password@localhost:5432/warehouse
PORT=3000
```

Start the backend (with hot reload via Nodemon):

```bash
npm run dev
```

Or for production:

```bash
npm start
```

On first startup the server will:
1. Connect to PostgreSQL
2. Run `setup.sql` to create tables and indexes (idempotent — uses `IF NOT EXISTS`)
3. Seed five default compartments and 25 items if the `categories` table is empty

Verify the server is healthy:

```
GET http://localhost:3000/health
```

Expected response:

```json
{
  "status": "healthy",
  "dbConnection": "connected",
  "timestamp": "2025-06-01T00:00:00.000Z"
}
```

---

### 3. Frontend Setup

```bash
cd ../FrontEnd
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

`.env` contents:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

To build for production:

```bash
npm run build
```

---

## Usage Guide

### Viewing the Warehouse

Navigate to **Warehouse** in the top nav. Each compartment card shows:

- Total capacity and current usage
- A visual occupancy bar (green → amber → red as capacity fills)
- Click any card to expand it and see individual item details

### Sending Items

Go to **Send/Receive**, select an item from the dropdown, enter a quantity, and click **Send Items**. The API will reject the request if quantity exceeds current stock, returning an error message in the UI.

### Receiving Items

On the same **Send/Receive** page, select an existing item and click **Receive Items** to restock it, or use `ReceivingForm` (accessible from the reports components) to create a brand-new item in a chosen compartment.

### Transaction History

Navigate to **Transactions** to see a reverse-chronological list of all SEND and RECEIVE operations. SEND cards render with a red left border; RECEIVE cards render green. Click **Refresh Data** to pull the latest records.

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
