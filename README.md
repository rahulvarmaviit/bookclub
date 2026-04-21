# 📚 BookClub - Group Reading Application..

A full-stack web application for managing group book reading sessions with chapter schedules, progress tracking, and discussion forums................


## 🚀 Quick Start Guide.
### Prerequisites>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>....

Before running this application, make sure you have installed:

- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation & Setup

#### Step 1: Extract the Project

Extract the zip file to your preferred location (e.g., `C:\Projects\bookclub` or `~/bookclub`)

#### Step 2: Backend Setup

1. Open a terminal/command prompt
2. Navigate to the backend folder:

```bash
cd bookclub/backend
```

3. Install Python dependencies:

```bash
pip install django djangorestframework django-cors-headers
```

4. Start the Django server:

```bash
python manage.py runserver
```

✅ Backend is now running at **http://127.0.0.1:8000/**

**Keep this terminal window open!**

#### Step 3: Frontend Setup

1. Open a **NEW** terminal/command prompt window
2. Navigate to the frontend folder:

```bash
cd bookclub/frontend
```

3. Install Node.js dependencies (this may take 2-3 minutes):

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

✅ Frontend is now running at **http://localhost:5173/** (or 5174/5175 if port is busy)

**Keep this terminal window open too!**

#### Step 4: Access the Application

1. Open your web browser
2. Go to the URL shown in the frontend terminal (usually `http://localhost:5173/`)
3. You'll see the beautiful landing page!

## 🔐 Login Information

The database includes pre-configured test users:

- **Username:** `rahul` / **Password:** `Test@123`
- **Username:** `john` / **Password:** `Test@123`
- **Username:** `emily` / **Password:** `Test@123`
- **Username:** `sarah` / **Password:** `Test@123`

Or **register a new account** by clicking "Sign Up"!

## ✨ Features

### 📖 Core Features
- **6 Popular Books** pre-loaded with cover images:
  - Atomic Habits (James Clear)
  - It Ends with Us (Colleen Hoover)
  - The Silent Patient (Alex Michaelides)
  - The Alchemist (Paulo Coelho)
  - Half Girlfriend (Chetan Bhagat)
  - The Book Thief (Markus Zusak)

### 👥 Group Features
- Create reading groups for any book
- Join existing groups (max 10 members)
- Set reading schedules with start/end dates
- View group progress statistics
- Exit groups (if not the creator)

### 📅 Personal Features
- **Chapter Schedules**: Set personal completion dates for each chapter
- **Progress Tracking**: Track your reading progress
- **Status Indicators**: See if you're on track, behind, or ahead
- Color-coded status chips (Completed, Overdue, Due Soon, On Track)

### 💬 Social Features
- Discussion forums for each group
- Post comments and engage with members
- Real-time notifications (5 unread indicator)

### 📊 Dashboard
- View all your groups
- See group statistics
- Quick access to reading, discussions, and schedules

## 🗂️ Project Structure

```
bookclub/
├── backend/                 # Django REST API
│   ├── bookclub/           # Project settings
│   ├── bookclub_app/       # Main application
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API endpoints
│   │   ├── serializers.py  # Data serialization
│   │   └── urls.py         # URL routing
│   ├── db.sqlite3          # SQLite database (includes all data!)
│   └── manage.py           # Django management script
│
└── frontend/               # React + Vite
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── context/        # Auth context
    │   └── api/            # API configuration
    ├── package.json        # Node dependencies
    └── vite.config.js      # Vite configuration
```

## 🛠️ Troubleshooting

### Backend Issues

**Problem:** "Port 8000 is already in use"
```bash
# Solution: Run on a different port
python manage.py runserver 8001
# Then update frontend API URL in src/api/axiosConfig.js
```

**Problem:** "Module not found"
```bash
# Solution: Install the missing package
pip install <package-name>
```

**Problem:** "No module named django"
```bash
# Solution: Install Django
pip install django djangorestframework django-cors-headers
```

### Frontend Issues

**Problem:** "npm: command not found"
- **Solution:** Install Node.js from https://nodejs.org/

**Problem:** "Port 5173 is already in use"
- **Solution:** Vite will automatically try ports 5174, 5175, etc. Just use the URL shown in terminal.

**Problem:** "Failed to fetch" or API errors
- **Solution:** Make sure the backend server is running on port 8000

**Problem:** "npm install" fails
```bash
# Solution: Clear cache and retry
npm cache clean --force
npm install
```

### Browser Issues

**Problem:** Blank page or errors
- **Solution:** Press F12 to open Developer Console and check for errors
- Make sure both backend (port 8000) and frontend (port 5173) are running

**Problem:** "CORS error"
- **Solution:** Backend should already be configured. Restart both servers.

## 💾 Database Information

The `db.sqlite3` file contains:
- ✅ All 6 books with chapters and cover images
- ✅ User accounts (passwords are securely hashed)
- ✅ Reading groups and memberships
- ✅ Reading progress records
- ✅ Chapter schedules
- ✅ Discussion posts and comments

**Important:** Don't delete `db.sqlite3` - it contains all your data!

## 🔧 Development Commands

### Backend Commands
```bash
# Run migrations (if needed)
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Access admin panel
# Go to http://127.0.0.1:8000/admin/
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 How to Use the Application

1. **Landing Page:** Click "Login" or "Sign Up"
2. **Register:** Create a new account or use existing credentials
3. **Dashboard:** View your groups or search for books
4. **Search Books:** Browse available books with cover images
5. **Book Details:** View book info and available groups
6. **Create Group:** Set a group name and reading schedule
7. **Join Group:** Click JOIN on any available group
8. **Group Page:** 
   - Click "Start Reading" to begin
   - Click "My Chapter Schedule" to set personal deadlines
   - View group members and progress
9. **Chapter Schedule:** Set target dates for each chapter
10. **Discussion:** Engage with group members

## 🌐 Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework
- SQLite Database
- CORS Headers

### Frontend
- React 18
- Material-UI (MUI)
- Vite
- React Router
- Axios

## 📄 License

This project is for educational purposes.

## 🤝 Support

If you encounter any issues:
1. Check both terminal windows for error messages
2. Press F12 in browser to see console errors
3. Make sure both servers are running
4. Verify you're using the correct ports (8000 for backend, 5173 for frontend)

---

## ⚡ Quick Command Reference

**Start Backend:**
```bash
cd bookclub/backend
python manage.py runserver
```

**Start Frontend (in new terminal):**
```bash
cd bookclub/frontend
npm install  # First time only
npm run dev
```

**Access Application:**
- Frontend: http://localhost:5173/
- Backend API: http://127.0.0.1:8000/
- Admin Panel: http://127.0.0.1:8000/admin/

---

Happy Reading! 📚✨




