# BookClub Application - Setup Instructions

## Prerequisites
- Python 3.8+ installed
- Node.js 16+ and npm installed
- Git (optional)

## Installation Steps

### 1. Extract the Project
Extract the zip file to your desired location.

### 2. Backend Setup

Open a terminal and navigate to the backend folder:

```powershell
cd bookclub/backend
```

Install Python dependencies:
```powershell
pip install django djangorestframework django-cors-headers
```

The database (`db.sqlite3`) is already included with all data. Just run:
```powershell
python manage.py runserver
```

Backend will start at: **http://127.0.0.1:8000/**

### 3. Frontend Setup

Open a **NEW terminal** and navigate to the frontend folder:

```powershell
cd bookclub/frontend
```

Install Node.js dependencies (this may take a few minutes):
```powershell
npm install
```

Start the development server:
```powershell
npm run dev
```

Frontend will start at: **http://localhost:5173/** (or 5174, 5175 if ports are busy)

### 4. Access the Application

Open your browser and go to the frontend URL (shown in terminal).

## Login Credentials

The database includes these test users:
- **Username**: `rahul` (and others like john, emily, sarah, mike, lisa, tom)
- **Password**: Ask the person who shared this with you

Or register a new account!

## Troubleshooting

### Backend Issues:
- **Port 8000 already in use**: Kill the process or change port
  ```powershell
  python manage.py runserver 8001
  ```
- **Module not found**: Install missing packages
  ```powershell
  pip install [package-name]
  ```

### Frontend Issues:
- **Port already in use**: Vite will automatically try next port (5174, 5175, etc.)
- **npm install fails**: Try:
  ```powershell
  npm cache clean --force
  npm install
  ```
- **API connection error**: Ensure backend is running on port 8000

## Features Included

✅ 6 Pre-loaded Books with Cover Images
✅ User Registration & Authentication
✅ Create/Join Reading Groups
✅ Personal Chapter Schedules
✅ Reading Progress Tracking
✅ Discussion Forums
✅ Group Statistics & Progress
✅ Smart Notifications

## Database

The `db.sqlite3` file contains:
- All books and chapters
- User accounts (passwords are securely hashed)
- Groups and memberships
- Reading progress
- Discussion posts
- Chapter schedules

**Note**: All data from the original setup is preserved!

## Need Help?

Check the console logs in both terminals for error messages.
Press F12 in browser to see frontend errors in Console tab.
