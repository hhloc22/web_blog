var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const hbs = require('hbs');
const hbsHelpers = require('./helpers/hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Register handlebars helpers
Object.keys(hbsHelpers).forEach(key => {
    hbs.registerHelper(key, hbsHelpers[key]);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Session middleware setup - MUST BE BEFORE ROUTES
app.use(session({
    secret: 'furfly-blog-secret-key-2024',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Debug middleware to check session
app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('User in session:', req.session.user);
    next();
});

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/users/login');
    }
};

app.use('/', indexRouter);
app.use('/users', usersRouter);

const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'h0huul0c',
    database: 'webblog'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const query = 'SELECT * FROM user WHERE username = ? OR email = ?';
    db.query(query, [username, email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            if (results[0].username === username) {
                return res.render('signup', { errorMessage: 'Tên đăng nhập đã tồn tại. Vui lòng nhập lại!' });
            }
            if (results[0].email === email) {
                return res.render('signup', { errorMessage: 'Email đã tồn tại. Vui lòng nhập lại!' });
            }
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const insertQuery = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
            if (err) throw err;
            res.redirect('/users/login');
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);

    const query = 'SELECT * FROM user WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.render('login', { errorMessage: 'Tên đăng nhập không tồn tại. Vui lòng nhập lại!' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (!isMatch) {
                return res.render('login', { errorMessage: 'Mật khẩu không đúng. Vui lòng nhập lại!' });
            }

            // Set user session after successful login
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };
            console.log('Session after login:', req.session);
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).send('Error saving session');
                }
                res.redirect('/');
            });
        });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Error during logout');
        }
        res.redirect('/');
    });
});

// Route to delete blog
app.delete('/delete-blog/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const blogId = req.params.id;
    const username = req.session.user.username;

    try {
        // Check if the blog belongs to the current user
        const blog = await db.query('SELECT * FROM blog WHERE id_blog = ? AND author_name = ?', [blogId, username]);
        
        if (blog.length === 0) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // delete blog
        await db.query('DELETE FROM blog WHERE id_blog = ?', [blogId]);
        
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
