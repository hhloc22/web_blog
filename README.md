# Web Blog Application

Ứng dụng blog đơn giản được xây dựng bằng React (Frontend) và Node.js + Express (Backend) với MySQL làm cơ sở dữ liệu.

## Công nghệ sử dụng

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js + Express.js
- MySQL
- bcrypt (mã hóa mật khẩu)
- dotenv (quản lý biến môi trường)

## Yêu cầu hệ thống

1. Node.js (phiên bản 14.0.0 trở lên)
2. MySQL (phiên bản 8.0 trở lên)
3. npm (Node Package Manager)

### Cài đặt Node.js và npm

1. Tải Node.js từ [trang chủ Node.js](https://nodejs.org/)
2. Chọn phiên bản LTS (Long Term Support)
3. Chạy file cài đặt và làm theo hướng dẫn
4. Kiểm tra cài đặt bằng lệnh:
```bash
node --version
npm --version
```

### Cài đặt MySQL

1. Tải MySQL từ [trang chủ MySQL](https://dev.mysql.com/downloads/mysql/)
2. Chọn phiên bản phù hợp với hệ điều hành
3. Trong quá trình cài đặt:
   - Ghi nhớ password cho tài khoản root
   - Chọn port cho MySQL (mặc định là 3306)
4. Kiểm tra MySQL đã chạy bằng MySQL Workbench hoặc command line

## Cài đặt và Chạy ứng dụng

### 1. Clone repository

```bash
git clone <repository-url>
cd web_blog
```

### 2. Cài đặt Database

1. Đảm bảo MySQL đã được cài đặt và đang chạy
2. Tạo database và bảng:

```sql
CREATE DATABASE webblog;
USE webblog;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE blog (
    id_blog INT AUTO_INCREMENT PRIMARY KEY,
    blog_name VARCHAR(255) NOT NULL UNIQUE,
    blog_content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    post_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_name) REFERENCES user(username)
);
```

### 3. Backend

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Tạo file môi trường từ file mẫu
```bash
cp .env.example .env
```

4. Chỉnh sửa file `.env` với thông tin database của bạn:
```env
DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=3307
```

5. Chạy server:
```bash
npm start
```
Server sẽ chạy tại http://localhost:5000

### 4. Frontend

1. Mở terminal mới và di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
npm start
```
Frontend sẽ chạy tại http://localhost:3000

## Cấu trúc thư mục

```
web_blog/
├── backend/                # Backend server
│   ├── node_modules/
│   ├── .env              # File chứa biến môi trường (tạo từ .env.example)
│   ├── .env.example      # File mẫu cho biến môi trường
│   └── server.js         # File server chính
│
├── frontend/              # React frontend
│   ├── node_modules/
│   ├── public/
│   └── src/
│       ├── components/   # Components có thể tái sử dụng
│       ├── pages/       # Components trang
│       ├── hooks/       # Custom hooks
│       └── assets/      # Hình ảnh và files tĩnh
│
└── README.md
```

## Biến môi trường

Các biến môi trường cần được cấu hình trong file `.env` ở thư mục backend:

- `DB_HOST` - Địa chỉ host của MySQL database
- `DB_USER` - Tên người dùng MySQL
- `DB_PASSWORD` - Mật khẩu MySQL
- `DB_NAME` - Tên database
- `PORT` - Port cho backend server (mặc định: 5000)

## Xử lý lỗi thường gặp

Nếu gặp lỗi, hãy kiểm tra:

1. Đã cài đặt đầy đủ các dependencies chưa
2. MySQL server đã được khởi động chưa
3. File `.env` đã được cấu hình đúng chưa
4. Kiểm tra console để xem log lỗi
5. Đảm bảo cả frontend và backend server đều đang chạy

## Tính năng chính

- Xác thực người dùng (Đăng ký, Đăng nhập)
- Tạo, đọc, cập nhật, xóa bài viết
- Xem tất cả bài viết
- Xem bài viết cá nhân
- Giao diện responsive
