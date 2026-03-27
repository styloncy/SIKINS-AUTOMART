// ============================================
// REVIEWS SYSTEM - Store and Display Reviews
// ============================================

// Initialize reviews array (empty - no default reviews)
let reviews = [];

// Load reviews from localStorage
function loadReviews() {
    const savedReviews = localStorage.getItem('sikins_reviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    } else {
        reviews = []; // Empty - no sample reviews
        saveReviews();
    }
    displayReviews();
}

// Save reviews to localStorage
function saveReviews() {
    localStorage.setItem('sikins_reviews', JSON.stringify(reviews));
}

// Display reviews
function displayReviews() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;
    
    if (reviews.length === 0) {
        grid.innerHTML = `
            <div class="empty-reviews">
                <div class="icon">⭐</div>
                <h3>No Reviews Yet</h3>
                <p>Be the first to share your experience with SIKINS AUTOMART!</p>
            </div>
        `;
        return;
    }
    
    // Sort reviews by date (newest first)
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    grid.innerHTML = sortedReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="reviewer-name">${escapeHtml(review.name)}</span>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <div class="review-stars">
                ${generateStars(review.rating)}
            </div>
            ${review.car ? `<div class="review-car">🚗 ${escapeHtml(review.car)}</div>` : ''}
            <div class="review-text">${escapeHtml(review.review)}</div>
            ${review.verified ? '<div class="review-verified">✓ Verified Purchase</div>' : ''}
        </div>
    `).join('');
}

// Generate star rating display
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star-filled">★</span>';
        } else {
            stars += '<span class="star-empty">★</span>';
        }
    }
    return stars;
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open review modal
function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close review modal
function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetReviewForm();
}

// Reset review form
function resetReviewForm() {
    document.getElementById('reviewer-name').value = '';
    document.getElementById('review-car').value = '';
    document.getElementById('review-text').value = '';
    document.getElementById('review-rating').value = '5';
    
    // Reset star highlighting
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
        if (parseInt(star.dataset.rating) <= 5) {
            star.classList.add('active');
        }
    });
}

// Submit review
function submitReview(event) {
    event.preventDefault();
    
    const name = document.getElementById('reviewer-name').value.trim();
    const rating = parseInt(document.getElementById('review-rating').value);
    const car = document.getElementById('review-car').value.trim();
    const review = document.getElementById('review-text').value.trim();
    
    if (!name || !review) {
        alert('Please fill in your name and review.');
        return;
    }
    
    if (rating < 1 || rating > 5) {
        alert('Please select a rating.');
        return;
    }
    
    // Create new review
    const newReview = {
        id: Date.now(),
        name: name,
        rating: rating,
        car: car || '',
        review: review,
        date: new Date().toISOString().split('T')[0],
        verified: false
    };
    
    reviews.push(newReview);
    saveReviews();
    displayReviews();
    
    // Close modal and show success
    closeReviewModal();
    alert('Thank you for your review! It will help other customers.');
}

// Star rating functionality
function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('review-rating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            
            // Highlight stars
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.style.color = '#d4af37';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingInput.value);
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= currentRating) {
                    s.style.color = '#d4af37';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    
    // Setup review form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', submitReview);
    }
    
    // Setup star rating
    setupStarRating();
    
    // Close modal when clicking outside
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeReviewModal();
            }
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && href.startsWith('#') && !href.startsWith('#!')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});