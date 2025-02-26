var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const moment = require('moment');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'h0huul0c',
    database: 'webblog'
});

// Helper function to get paginated blogs
async function getPaginatedBlogs(page = 1, limit = 6, author = null) {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;
        
        // Base query
        let countQuery = 'SELECT COUNT(*) as total FROM blog';
        let blogsQuery = 'SELECT * FROM blog';
        
        // Add author filter if specified
        const queryParams = [];
        if (author) {
            countQuery += ' WHERE author_name = ?';
            blogsQuery += ' WHERE author_name = ?';
            queryParams.push(author);
        }
        
        // Add ordering and pagination
        blogsQuery += ' ORDER BY post_time DESC LIMIT ? OFFSET ?';
        queryParams.push(limit, offset);
        
        // Get total count of blogs
        db.query(countQuery, author ? [author] : [], (err, countResult) => {
            if (err) return reject(err);
            
            const totalBlogs = countResult[0].total;
            const totalPages = Math.ceil(totalBlogs / limit);
            
            // Get blogs for current page
            db.query(blogsQuery, queryParams, (err, blogs) => {
                if (err) return reject(err);
                
                // Process blog content
                blogs = blogs.map(blog => ({
                    ...blog,
                    truncatedContent: blog.blog_content.length > 80 
                        ? blog.blog_content.substring(0, 74) + '. . .' 
                        : blog.blog_content
                }));
                
                // Generate pagination data
                const pages = [];
                for (let i = 1; i <= totalPages; i++) {
                    pages.push({
                        pageNumber: i,
                        isCurrentPage: i === page
                    });
                }
                
                resolve({
                    blogs,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        hasPreviousPage: page > 1,
                        hasNextPage: page < totalPages,
                        previousPage: page - 1,
                        nextPage: page + 1,
                        pages
                    }
                });
            });
        });
    });
}

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const { blogs, pagination } = await getPaginatedBlogs(page);
        
        if (req.session.user) {
            res.render('home', { 
                user: req.session.user,
                blogs,
                ...pagination
            });
        } else {
            res.render('index', { 
                blogs,
                ...pagination
            });
        }
    } catch (error) {
        next(error);
    }
});

/* GET my blogs page */
router.get('/myblogs', async function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const { blogs, pagination } = await getPaginatedBlogs(page, 6, req.session.user.username);
        
        res.render('myblogs', { 
            user: req.session.user,
            blogs,
            pagination: {
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                hasPreviousPage: pagination.hasPreviousPage,
                hasNextPage: pagination.hasNextPage,
                previousPage: pagination.previousPage,
                nextPage: pagination.nextPage,
                pages: pagination.pages
            }
        });
    } catch (error) {
        next(error);
    }
});

// Create new blog post
router.post('/create-blog', async function(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const { blog_name, blog_content } = req.body;
    const author_name = req.session.user.username;

    const query = 'INSERT INTO blog (blog_name, blog_content, author_name) VALUES (?, ?, ?)';
    db.query(query, [blog_name, blog_content, author_name], (err, result) => {
        if (err) {
            console.error('Error creating blog:', err);
            return res.status(500).send('Error creating blog post');
        }
        res.redirect('/');
    });
});

// Get single blog by ID
router.get('/blog/:id', async function(req, res) {
    const blogId = req.params.id;
    const query = 'SELECT * FROM blog WHERE id_blog = ?';
    
    try {
        const blog = await new Promise((resolve, reject) => {
            db.query(query, [blogId], (err, result) => {
                if (err) reject(err);
                resolve(result[0]);
            });
        });
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        res.json(blog);
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
