# Digital Menu Platform

A full-stack platform where restaurant and café owners can create, manage, and display digital menus with custom branding.

## 🚀 Features

- **Application System**: Businesses can apply for their own menu profile
- **Admin Panel**: Approve/reject applications and manage users
- **Restaurant Dashboard**: 
  - Upload logo and customize brand colors
  - Manage menu categories and items
  - Upload product images
  - Real-time menu preview
- **Public Menu Display**: Beautiful, responsive menus with custom theming
- **Secure Authentication**: JWT-based auth with bcrypt password hashing

## 🛠️ Tech Stack

### Backend
- Node.js & Express
- PostgreSQL with native SQL queries (pg)
- JWT Authentication
- Multer for file uploads
- Express Validator

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### 1. Clone the repository
```bash
cd digital-menu-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=digital_menu_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

MAX_FILE_SIZE=5242880
```

### 3. Database Setup

Create the database:
```bash
psql -U postgres
CREATE DATABASE digital_menu_db;
\q
```

Run migrations:
```bash
psql -U postgres -d digital_menu_db -f src/db/migrations.sql
```

Seed admin account:
```bash
node src/seedAdmin.js
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

## 🚀 Running the Application

### Option 1: Run Both Servers Concurrently (Recommended)
```bash
npm run dev
```
This will start both backend (port 5000) and frontend (port 5173) simultaneously.

### Option 2: Run Servers Separately

**Start Backend (Terminal 1)**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Start Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@menuplatform.com`
- Password: `Admin123!`

⚠️ **Important**: Change these credentials in production!

## 📁 Project Structure

```
digital-menu-platform/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js
│   │   │   ├── migrations.sql
│   │   │   └── seed.sql
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── server.js
│   │   └── seedAdmin.js
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── dashboard/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🎯 Usage Guide

### For Restaurant Owners

1. **Apply**: Visit the landing page and click "Apply for Your Menu"
2. **Fill Form**: Complete the application with business details
3. **Wait for Approval**: Admin will review your application
4. **Login**: Once approved, login with your credentials
5. **Setup Menu**:
   - Upload your logo
   - Customize brand colors
   - Create categories
   - Add menu items with images and prices
6. **Share**: Share your menu URL (`/menu/your-slug`) with customers

### For Admins

1. **Login**: Access admin panel at `/admin/login`
2. **Review Applications**: View pending applications
3. **Approve/Reject**: Approve or reject applications
4. **Manage Users**: Enable/disable or delete user accounts

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/user-login` - User login

### Applications
- `POST /api/applications/apply` - Submit application

### Admin (Protected)
- `GET /api/admin/applications` - List applications
- `POST /api/admin/applications/:id/approve` - Approve application
- `POST /api/admin/applications/:id/reject` - Reject application
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/toggle` - Toggle user status
- `DELETE /api/admin/users/:id` - Delete user

### User Dashboard (Protected)
- `GET /api/user/settings` - Get settings
- `PUT /api/user/settings` - Update settings
- `POST /api/user/upload-logo` - Upload logo
- `GET /api/user/categories` - List categories
- `POST /api/user/categories` - Create category
- `PUT /api/user/categories/:id` - Update category
- `DELETE /api/user/categories/:id` - Delete category
- `GET /api/user/menu-items` - List menu items
- `POST /api/user/menu-items` - Create menu item
- `PUT /api/user/menu-items/:id` - Update menu item
- `DELETE /api/user/menu-items/:id` - Delete menu item
- `POST /api/user/upload-item-image` - Upload item image

### Public
- `GET /api/public/menu/:slug` - Get public menu

## 🔒 Security Features

- JWT token-based authentication
- Bcrypt password hashing
- Parameterized SQL queries (SQL injection prevention)
- Input validation with express-validator
- File upload restrictions (type and size)
- Protected routes with role-based access control

## 📝 License

MIT

## 👥 Support

For issues or questions, please open an issue on GitHub.
