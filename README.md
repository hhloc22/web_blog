# Blog Website

Đây là một trang web blog được xây dựng bằng Node.js, Express.js và MySQL, với giao diện được thiết kế bằng Tailwind CSS.

## Yêu cầu hệ thống

- Node.js (phiên bản 14.0.0 trở lên)
- MySQL Server
- npm (Node Package Manager)

## Cài đặt

1. **Clone repository**

```bash
git clone <repository-url>
cd blog_0
```

2. **Cài đặt các dependencies**

```bash
npm install
```

3. **Cấu hình MySQL**

- Đảm bảo MySQL Server đã được cài đặt và đang chạy
- Tạo một database mới với script SQL sau:

```sql
create database webblog;

use webblog;

create table user (
    id int auto_increment primary key,
    username varchar(255) not null unique,
    email varchar(255) not null unique,
    password varchar(255) not null
);

create table blog (
    id_blog int auto_increment primary key,
    blog_name varchar(255) not null,
    blog_content text not null,
    author_name varchar(100) not null,
    post_time datetime default current_timestamp
);

/*
Lệnh dưới là để thay đổi Plugin xác thực:
Thay thế 'h0huul0c' thành mật khẩu của server
*/
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'h0huul0c';
FLUSH PRIVILEGES;
```

- Cập nhật thông tin kết nối database trong file cấu hình của ứng dụng

4. **Build CSS với Tailwind**

```bash
npm run tailwind
```

## Khởi chạy ứng dụng

1. **Khởi động server**

```bash
npm start
```

2. Mở trình duyệt và truy cập địa chỉ: `http://localhost:3000`

## Cấu trúc thư mục

- `/bin` - Chứa file khởi động server
- `/helpers` - Các hàm tiện ích
- `/public` - Assets tĩnh (CSS, JavaScript, hình ảnh)
- `/routes` - Định nghĩa các routes của ứng dụng
- `/views` - Templates Handlebars (hbs)

## Dependencies chính

- `express`: Web framework
- `hbs`: Template engine
- `mysql`: MySQL client cho Node.js
- `bcrypt`: Mã hóa mật khẩu
- `express-session`: Quản lý phiên đăng nhập
- `tailwindcss`: Framework CSS

## Scripts npm

- `npm start`: Khởi động server
- `npm run tailwind`: Build CSS với Tailwind

## Lưu ý

- Đảm bảo MySQL Server đang chạy trước khi khởi động ứng dụng
- Kiểm tra các thông số kết nối database trong file cấu hình
- Nếu có lỗi trong quá trình cài đặt, hãy kiểm tra logs để debug

## Phiên bản

Phiên bản hiện tại: 1.1

## License

Private
