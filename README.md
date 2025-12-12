# Presentation Youtube Link
https://www.youtube.com/watch?v=RSVRigj2JOg

# Team Members/Roles

Brady - Backend and DB
Jared - Frontend setup and pages
Aimee - Frontend styling and pet/shop page
David - Frontend and user auth

# Task Buddy / Study Buddy

A full-stack productivity web app that turns your to-do list into a virtual pet game.

- Track tasks with deadlines, completion state, and a calendar view  
- Keep a streak and see weekly progress  
- Earn and spend coins in a shop  
- Feed and play with a virtual pet whose stats are stored in MongoDB  

This project was built for **CS_2830 Web Development** as a MERN-stack final project.

---

## Tech Stack

**Frontend**
- React + Vite  
- React Router  
- Axios
- Tailwind-style utility classes + custom CSS  
- Context API for authentication  

**Backend**
- Node.js  
- Express  
- JSON Web Tokens (JWT) for auth  
- Input validation & secure routing  

**Database**
- MongoDB Atlas  
- Mongoose (models & validation)  
- Bcrypt for password hashing  
- Timestamp tracking for streak logic  

---

## Core Features

### 1. Authentication & Protected Routes
- Register and login with email + password  
- Passwords hashed with **bcrypt** before saving  
- JWT-based authentication with `Authorization: Bearer <token>`  
- Protected routes (`/home`, `/calendar`, `/shop`, `/pet`) using a custom `ProtectedRoute` component  
- Auth state stored in `localStorage` and verified with `/api/auth/me` on app load  

---

### 2. Task Management
- Create, read, update, delete tasks:
  - Title  
  - Description  
  - Deadline  
  - Completion state  
- Completing a task awards **+10 coins**  
- Home page:
  - To-do list with pagination  
  - Weekly view of upcoming tasks  
  - Streak and “tasks completed this week” stats  
- Calendar page:
  - Monthly calendar view  
  - Click on a day to see tasks for that date in a modal  
  - Tasks visually coded by urgency (overdue, due soon, etc.)  

---

### 3. Pet System
- Each user can create a virtual pet (cat, dog, or penguin)  
- Pet stats stored in MongoDB:
  - Level  
  - Experience  
  - Happiness  
  - Last time played  
- Experience & leveling:
  - Model method `checkLevelUp()` handles leveling and exp rollover  
- Happiness and “study happiness”:
  - Time-based happiness derived from task streaks and completions (frontend)  
  - Backend-stored happiness updated when feeding/playing  
- Actions:
  - **Play with pet** (XP + happiness, can level up)  
  - **Feed pet** using inventory items (consumes an item, boosts stats)  

---

### 4. Inventory & Shop
- Each user has an `Inventory`:
  - Coins (starting with 100)  
  - Items array (food, accessories, backgrounds, etc.)  
- Shop:
  - Shows available items by category and rarity  
  - Enforces coin balance and ownership checks  
  - Buying an item:
    - Deducts coins via `/api/user/inventory/coins`  
    - Adds item via `/api/user/inventory/item`  
- Pet page shows:
  - Current coins  
  - Food items in inventory (with quantity)  
  - Ability to feed pet from these items  

---

## Seed Script (Demo Data)

A seed script is included to quickly populate the database with test data.

**Run using:**
```bash
cd server
node seed.js
```
- This will:
    - Create a demo user
    - Add a pet
    - Generate example tasks
    - Populate coins & inventory
- Demo Login:
    - Email: demo@example.com
    - Password: password123

## Project Structure
```
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CalendarPage.jsx
│   │   │   ├── PetPage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── petStats.js
│   └── ...
├── server/                  # Express backend
│   ├── server.js
│   ├── seed.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Inventory.js
│   │   └── Pet.js
│   └── routes/
│       ├── authRoutes.js
│       ├── taskRoutes.js
│       └── userRoutes.js
└── README.md
```
---
## Environemt Variables
- Create a .env file in the server folder:
    - MONGO_URI=your_mongodb_connection_string
    - JWT_SECRET=your_secret_key
    - JWT_EXPIRE=7d
    - PORT=5001 | Match this to your API Port! Found within client/src/services/api.js

## Package installations

**client**
npm install bcryptjs jsonwebtoken express-validator cookie-parser

**server**
npm install axios

