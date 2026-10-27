# Expenses Management System (MERN Stack)

A clean, full-stack Expense Management application built with **Express**, **MongoDB (Mongoose)**, **Vite React**, **jsonwebtoken (JWT)**, **React Router**, and **raw CSS** (no Tailwind CSS, no extra complex frameworks).

---

## 📁 Project Structure

```
├── server/                 # Express + MongoDB Backend
│   ├── models/             # Mongoose Models (User & Expense)
│   │   ├── User.js
│   │   └── Expense.js
│   ├── middleware/         # JWT Authentication Middleware
│   │   └── auth.js
│   ├── routes/             # Express API Routes
│   │   ├── authRoutes.js   # Register, Login, Me
│   │   └── expenseRoutes.js # Expenses CRUD & Summary
│   ├── server.js           # Server entry point & MongoDB connection
│   ├── .env                # Environment configuration (PORT, JWT_SECRET, MONGO_URI)
│   └── package.json
│
└── client/                 # Vite + React Frontend
    ├── src/
    │   ├── components/     # UI Components (Navbar, SummaryCards, ExpenseModal, ProtectedRoute)
    │   ├── context/        # AuthContext for JWT authentication & state
    │   ├── pages/          # React Router pages (Dashboard, Login, Register)
    │   ├── App.jsx         # App router setup
    │   ├── App.css         # Page raw CSS styles
    │   ├── index.css       # Global raw CSS variables & reset
    │   └── main.jsx        # React DOM root
    ├── index.html
    ├── vite.config.js      # Vite configuration with proxy to server
    └── package.json
```

---

## ⚙️ Configuration (`server/.env`)

In `server/.env`:
```env
PORT=5000
JWT_SECRET=expenses_jwt_secret_key_2026
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
```
> **Note**: If you are using **MongoDB Atlas** (cloud), replace `MONGO_URI` with your connection string:
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority`

---

## 🚀 How to Run the Project

### 1. Start the Backend Server

Make sure your MongoDB server is running locally (or MongoDB Atlas URI is added to `server/.env`).

Open a terminal window:

```bash
cd server
npm start
```
The backend server will connect to MongoDB and start on **http://localhost:5000**.

### 2. Start the Frontend Application

Open a second terminal window:

```bash
cd client
npm run dev
```
The Vite development server will run on **http://localhost:3000**.

Open your browser and navigate to **http://localhost:3000**.

---

## 🛠️ Features Included

1. **MongoDB Models**:
   - `User`: Full name, unique email, hashed password, timestamps.
   - `Expense`: ObjectId referencing User, title, amount, category, date, notes, timestamps.

2. **Authentication (JWT & bcryptjs)**:
   - User Registration (hashed passwords with bcrypt)
   - User Login with JWT token issuance
   - Secure Protected Routes in React Router
   - Automatic session restore via `localStorage`
   - Logout functionality

3. **Expenses Management (CRUD)**:
   - **Add Expense**: Title, Amount, Category, Date, and Notes.
   - **Edit Expense**: Update existing expense details in MongoDB.
   - **Delete Expense**: Delete expense from MongoDB.
   - **Summary Stats**: Total expenses amount, total transaction count, and top spending category.

4. **Filtering & Sorting**:
   - Real-time search by keyword (title/notes) using MongoDB regex
   - Filter by category
   - Sort by Date (newest/oldest) or Amount (highest/lowest)

5. **Pure Raw CSS Styling**:
   - Modern, clean, and responsive design
   - No Tailwind CSS or external component libraries used
   - Category badges with distinct color schemes
   - Interactive modals, responsive tables, and stats cards
