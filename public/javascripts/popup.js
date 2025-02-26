function showBlogPopup(blogId) {
    fetch(`/blog/${blogId}`)
        .then(response => response.json())
        .then(blog => {
            const popup = document.getElementById('blogPopup');
            const overlay = document.getElementById('blogPopupOverlay');
            const title = document.getElementById('blogPopupTitle');
            const author = document.getElementById('blogPopupAuthor');
            const date = document.getElementById('blogPopupDate');
            const content = document.getElementById('blogPopupContent');

            title.textContent = blog.blog_name;
            author.textContent = `👤 ${blog.author_name}`;
            date.textContent = new Date(blog.post_time).toLocaleDateString('vi-VN');
            content.textContent = blog.blog_content;

            popup.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        })
        .catch(error => {
            console.error('Error fetching blog:', error);
            alert('Có lỗi xảy ra khi tải nội dung blog!');
        });
}

function closeBlogPopup() {
    const popup = document.getElementById('blogPopup');
    const overlay = document.getElementById('blogPopupOverlay');
    
    popup.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close popup when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('blogPopupOverlay');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeBlogPopup();
        }
    });

    // Close popup when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBlogPopup();
        }
    });
});
