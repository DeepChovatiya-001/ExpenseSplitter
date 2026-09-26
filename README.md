# Expense Splitter — Production-Ready MERN Stack Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for group trips, vacations, college events, parties, roommates, and shared living expenses. The core feature is to calculate member shares and generate an optimal settlement plan using the **minimum possible number of transactions**.

---

## 📖 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Minimum Transaction Algorithm](#-minimum-transaction-algorithm)
  - [Algorithm Explanation](#algorithm-explanation)
  - [Time & Space Complexity](#time--space-complexity)
- [Database Schemas](#-database-schemas)
- [API Documentation](#-api-documentation)
- [Environment Setup & Installation](#-environment-setup--installation)
- [Testing](#-testing)
- [Future Improvements](#-future-improvements)

---

## ✨ Features

- **JWT Mobile Authentication**: Simple & clean registration/login with Mobile Number and Password (hashed with `bcryptjs`).
- **Trip & Event Management**: Create, view, update, and manage trips (e.g. Goa Trip, Roommate Bills, College Party).
- **Flexible Participant System**: Add participants by Name and optional Mobile Number without requiring every member to register an account.
- **Expense Tracking**: Log group expenses specifying description, amount, who paid, and who participated.
- **Equal Split Calculation**: Automatically computes per-person share and net balance for all trip participants.
- **Greedy Minimum Transaction Settlement**: Calculates net balances and generates the minimum number of transactions to resolve all debts.
- **Paise Precision Rounding**: Prevents floating-point errors (e.g. ₹499.99999) by using minor currency unit integer math internally.
- **Modern Responsive UI**: Built with React, Vite, React-Bootstrap, custom CSS glassmorphism, gradient cards, and Lucide icons.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM (v6)
- **UI Components & Styling**: Bootstrap 5, React-Bootstrap, Custom Vanilla CSS Glassmorphism
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context API (`AuthContext`)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas via Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Environment Handling**: dotenv
- **Orchestration**: Concurrently & Nodemon

---

## 📂 Project Structure

```text
expense-splitter/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TripCard.jsx
│   │   │   ├── ExpenseCard.jsx
│   │   │   ├── MemberList.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── MemberForm.jsx
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── SettlementList.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateTrip.jsx
│   │   │   ├── TripDetails.jsx
│   │   │   ├── AddExpense.jsx
│   │   │   ├── Settlement.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── memberController.js
│   │   └── expenseController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── memberRoutes.js
│   │   └── expenseRoutes.js
│   ├── services/
│   │   └── settlementService.js
│   ├── utils/
│   │   └── settlementAlgorithm.js
│   ├── tests/
│   │   └── settlement.test.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── package.json
├── .gitignore
└── README.md
```

---

## 🧮 Minimum Transaction Algorithm

### Algorithm Explanation

Instead of creating pairwise transactions whenever an expense is added, the application collects all trip expenses, computes net balances, and applies a **Greedy Debt-Settlement Strategy**:

```text
Original Expenses
       ↓
Calculate Each Person's Total Paid & Total Share
       ↓
Net Balance = Total Paid - Total Share
       ↓
Separate Creditors (+ Balance) & Debtors (- Balance)
       ↓
Greedy Matching: Largest Creditor ⟷ Largest Debtor
       ↓
Transfer Min(Creditor_Balance, Abs(Debtor_Balance))
       ↓
Update Balances & Repeat until all balances reach 0
       ↓
Optimal Minimum Transactions
```

#### Example Output:
Suppose 4 people split a ₹2000 total expense:
- **A paid ₹1000** (Net: +₹500)
- **B paid ₹500** (Net: ₹0)
- **C paid ₹0** (Net: -₹500)
- **D paid ₹500** (Net: ₹0)

Generates **1 transaction**:
```text
C → A : ₹500
```
instead of 4 pairwise payment loops!

### Time & Space Complexity

- **Time Complexity**: $\mathcal{O}(N \log N)$ where $N$ is the number of participants.
  - Initial sorting of creditors and debtors takes $\mathcal{O}(N \log N)$.
  - Each settlement transaction reduces at least one person's balance to zero, requiring at most $N-1$ iterations.
- **Space Complexity**: $\mathcal{O}(N)$ auxiliary space for creditor/debtor arrays and transaction output.

---

## 🗄️ Database Schemas

### User Model (`server/models/User.js`)
```javascript
{
  mobileNumber: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Trip Model (`server/models/Trip.js`)
```javascript
{
  name: { type: String, required: true },
  description: { type: String },
  currency: { type: String, default: 'INR' },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  members: [
    { name: String, mobileNumber: String }
  ],
  createdAt: { type: Date, default: Date.now }
}
```

### Expense Model (`server/models/Expense.js`)
```javascript
{
  tripId: { type: ObjectId, ref: 'Trip', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  paidBy: { type: String, required: true },
  participants: [ String ],
  splitType: { type: String, enum: ['equal'], default: 'equal' },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 📡 API Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with Mobile & Password | No |
| `POST` | `/api/auth/login` | Login user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Yes |

### Trip Routes (`/api/trips`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/trips` | Create a new trip/event | Yes |
| `GET` | `/api/trips` | Get all trips for current user | Yes |
| `GET` | `/api/trips/:id` | Get trip details, members & expenses | Yes |
| `PUT` | `/api/trips/:id` | Update trip title/description/currency | Yes |
| `DELETE` | `/api/trips/:id` | Delete trip and all expenses (owner) | Yes |
| `GET` | `/api/trips/:id/settlement` | Calculate and return minimum settlement plan | Yes |

### Member Sub-Routes (`/api/trips/:id/members`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/trips/:id/members` | Add a member to trip | Yes |
| `DELETE` | `/api/trips/:id/members/:memberId` | Remove member from trip | Yes |

### Expense Routes (`/api/trips/:id/expenses` & `/api/expenses/:id`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/trips/:id/expenses` | Log a new expense | Yes |
| `GET` | `/api/trips/:id/expenses` | Get all expenses for a trip | Yes |
| `PUT` | `/api/expenses/:id` | Update an existing expense | Yes |
| `DELETE` | `/api/expenses/:id` | Delete an expense | Yes |

---

## 🚀 Environment Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB instance

### 1. Environment Variables Configuration

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_splitter
JWT_SECRET=your_jwt_secret_key_here
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

From root directory:
```bash
npm run install-all
```

### 3. Run Development Server

To start both server and client concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`

---

## 🧪 Testing

Run backend algorithm unit tests:
```bash
npm test
```

Test suite covers:
1. One creditor and one debtor
2. Multiple creditors and one debtor
3. One creditor and multiple debtors
4. Multiple creditors and multiple debtors
5. Everyone already settled
6. Large group (50+ members)
7. Decimal amounts
8. Rounding edge cases (e.g. ₹100 split 3 ways)

---

## 🔮 Future Improvements

- [ ] Unequal, percentage, and exact amount splits
- [ ] Expense categories (Food, Travel, Accommodation, Entertainment)
- [ ] PDF & CSV export for settlement reports
- [ ] Payment status toggles ("Mark as Paid")
- [ ] Multi-currency real-time exchange rates
