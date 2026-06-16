// ===========================
// Global Variables
// ===========================

let cart = JSON.parse(localStorage.getItem('urbanThreadCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('urbanThreadWishlist')) || [];

const products = [
    {
        id: 1,
        name: 'Urban Essentials T-Shirt',
        category: "Men's Collection",
        price: 89,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        badge: 'NEW',
        bestseller: true
    },
    {
        id: 2,
        name: 'Signature Luxury Jacket',
        category: "Men's Collection",
        price: 499,
        originalPrice: 599,
        image: 'https://images.unsplash.com/photo-1539533057460-b960b8056b8b?w=400&h=500&fit=crop',
        badge: 'SALE',
        bestseller: true
    },
    {
        id: 3,
        name: 'Premium Denim Collection',
        category: "Women's Collection",
        price: 249,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=500&fit=crop',
        badge: 'TRENDING',
        bestseller: false
    },
    {
        id: 4,
        name: 'Elegant Wool Sweater',
        category: "Women's Collection",
        price: 329,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=500&fit=crop',
        badge: '',
        bestseller: true
    },
    {
        id: 5,
        name: 'Limited Edition Hoodie',
        category: 'Limited Edition',
        price: 199,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1556821552-5f63fe9c0f3d?w=400&h=500&fit=crop',
        badge: 'LIMITED',
        bestseller: true
    },
    {
        id: 6,
        name: 'Street Luxury Tracksuit',
        category: 'Street Luxury',
        price: 449,
        originalPrice: 549,
        image: 'https://images.unsplash.com/photo-1535738066026-25250f2882df?w=400&h=500&fit=crop',
        badge: 'HOT',
        bestseller: false
    },
    {
        id: 7,
        name: 'Minimalist Accessories Set',
        category: 'Accessories',
        price: 149,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop',
        badge: 'NEW',
        bestseller: false
    },
    {
        id: 8,
        name: 'Urban Classic Cap',
        category: 'Essentials',
        price: 59,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1519749497674-611481863552?w=400&h=500&fit=crop',
        badge: '',
        bestseller: false
    }
];

const testimonials = [
    {
        name: 'Emma Johnson',
        role: 'Fashion Influencer',
        text: 'Urban Thread truly redefines luxury. The quality and design are unmatched. I\'ve never felt more confident.',
        rating: 5,
        initial: 'E'
    },
    {
        name: 'Michael Chen',
        role: 'Creative Director',
        text: 'Every piece is a masterpiece. The attention to detail is extraordinary. This is luxury reimagined.',
        rating: 5,
        initial: 'M'
    },
    {
        name: 'Sofia Martinez',
        role: 'Style Curator',
        text: 'Urban Thread captures the essence of modern elegance. Their collections are timeless and sophisticated.',
        rating: 5,
        initial: 'S'
    },
    {
        name: 'James Wilson',
        role: 'Designer',
        text: 'As a designer myself, I appreciate Urban Thread\'s commitment to craftsmanship and innovation.',
        rating: 5,
        initial: 'J'
    }
];

// ===========================
// Initialization
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    renderFeaturedProducts();
    renderBestSellers();
    renderTestimonials();
    renderInstagramGallery();
    setupNewsletterForm();
    updateCartCount();
    fadeOutLoadingScreen();
});

// ===========================
// Loading Screen
// ===========================

function fadeOutLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 2400);
    }
}

// ===========================
// Navigation
// ===========================

function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const searchBtn = document.getElementById('searchBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const cartBtn = document.getElementById('cartBtn');

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });

        // Set active link based on current page
        if (window.location.pathname.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    // Search button
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showSearchModal();
        });
    }

    // Wishlist button
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            showWishlistModal();
        });
    }

    // Cart button
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            showCartModal();
        });
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===========================
// Products Rendering
// ===========================

function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const newProducts = products.slice(0, 4);
    container.innerHTML = newProducts.map(product => createProductCard(product)).join('');
    attachProductCardListeners();
}

function renderBestSellers() {
    const container = document.getElementById('bestSellersProducts');
    if (!container) return;

    const bestSellers = products.filter(p => p.bestseller);
    container.innerHTML = bestSellers.map(product => createProductCard(product)).join('');
    attachProductCardListeners();
}

function createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    const isWishlisted = wishlist.some(item => item.id === product.id);
    
    return `
        <div class="product-card" data-product-id="${product.id}" data-aos="fade-up">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-overlay">
                <div class="product-overlay-content">
                    <button class="add-to-cart" title="Add to Cart">Add to Cart</button>
                    <button class="wishlist-toggle ${isWishlisted ? 'active' : ''}" title="Add to Wishlist">♥</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="product-price-current">$${product.price}</span>
                    ${product.originalPrice ? `<span class="product-price-original">$${product.originalPrice}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function attachProductCardListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const addToCartBtn = card.querySelector('.add-to-cart');
        const wishlistBtn = card.querySelector('.wishlist-toggle');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(productId);
            });
        }

        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWishlist(productId);
            });
        }

        card.addEventListener('click', () => {
            // Navigate to product detail page
            window.location.href = `products.html?id=${productId}`;
        });
    });
}

// ===========================
// Cart Management
// ===========================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('urbanThreadCart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('urbanThreadCart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem('urbanThreadCart', JSON.stringify(cart));
        updateCartCount();
        renderCartModal();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// ===========================
// Wishlist Management
// ===========================

function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.findIndex(item => item.id === productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`Removed from wishlist`);
    } else {
        wishlist.push(product);
        showNotification(`Added to wishlist`);
    }

    localStorage.setItem('urbanThreadWishlist', JSON.stringify(wishlist));
    
    // Update UI
    document.querySelectorAll('.product-card').forEach(card => {
        if (parseInt(card.dataset.productId) === productId) {
            const btn = card.querySelector('.wishlist-toggle');
            if (btn) {
                btn.classList.toggle('active');
            }
        }
    });
}

// ===========================
// Testimonials
// ===========================

function renderTestimonials() {
    const container = document.getElementById('testimonialsList');
    if (!container) return;

    container.innerHTML = testimonials.map((testimonial, index) => `
        <div class="testimonial-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="testimonial-stars">${'★'.repeat(testimonial.rating)}</div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${testimonial.initial}</div>
                <div class="testimonial-info">
                    <h4>${testimonial.name}</h4>
                    <p>${testimonial.role}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ===========================
// Instagram Gallery
// ===========================

function renderInstagramGallery() {
    const container = document.getElementById('instagramGallery');
    if (!container) return;

    const images = [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1556821552-5f63fe9c0f3d?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1539533057460-b960b8056b8b?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1535738066026-25250f2882df?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1519749497674-611481863552?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop'
    ];

    container.innerHTML = images.map((img, index) => `
        <div class="instagram-item" data-aos="fade-up" data-aos-delay="${index * 50}">
            <img src="${img}" alt="Instagram post ${index + 1}">
            <div class="instagram-overlay">
                <div class="instagram-icon">📷</div>
            </div>
        </div>
    `).join('');
}

// ===========================
// Newsletter
// ===========================

function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Save to localStorage (in real app, would send to server)
        let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
        }

        showNotification('Thank you for subscribing! Check your email for exclusive offers.');
        form.reset();
    });
}

// ===========================
// Modals
// ===========================

function showSearchModal() {
    const modal = createModal('Search Products', `
        <div style="padding: 20px;">
            <input type="text" placeholder="Search for products..." id="searchInput" style="width: 100%; padding: 12px; border: 1px solid #d4af37; background: #1a1a1a; color: white; border-radius: 2px; margin-bottom: 20px;">
            <div id="searchResults"></div>
        </div>
    `);

    const searchInput = modal.querySelector('#searchInput');
    const resultsContainer = modal.querySelector('#searchResults');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        const results = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        );

        resultsContainer.innerHTML = results.length > 0 
            ? results.map(p => `
                <div style="padding: 12px; border-bottom: 1px solid #333; cursor: pointer; display: flex; align-items: center; gap: 12px;" onclick="window.location.href='products.html?id=${p.id}'">
                    <img src="${p.image}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 2px;">
                    <div>
                        <div style="font-weight: 600;">${p.name}</div>
                        <div style="color: #b0b0b0; font-size: 12px;">$${p.price}</div>
                    </div>
                </div>
            `).join('')
            : '<div style="padding: 20px; text-align: center; color: #b0b0b0;">No products found</div>';
    });

    searchInput.focus();
}

function showWishlistModal() {
    if (wishlist.length === 0) {
        createModal('Wishlist', '<div style="padding: 40px; text-align: center; color: #b0b0b0;">Your wishlist is empty</div>');
        return;
    }

    const content = wishlist.map(item => `
        <div style="padding: 12px; border-bottom: 1px solid #333; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 2px;">
                <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="color: #d4af37; font-size: 14px;">$${item.price}</div>
                </div>
            </div>
            <button onclick="toggleWishlist(${item.id}); updateWishlistDisplay();" style="background: #ef4444; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 2px;">Remove</button>
        </div>
    `).join('');

    createModal('Wishlist', `<div style="padding: 20px;">${content}</div>`);
}

function updateWishlistDisplay() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
        showWishlistModal();
    }
}

function showCartModal() {
    if (cart.length === 0) {
        createModal('Shopping Cart', '<div style="padding: 40px; text-align: center; color: #b0b0b0;">Your cart is empty. <a href="products.html" style="color: #d4af37; text-decoration: none;">Start shopping</a></div>');
        return;
    }

    renderCartModal();
}

function renderCartModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = total;
    const shipping = total > 200 ? 0 : 15;
    const tax = (subtotal + shipping) * 0.08;
    const grandTotal = subtotal + shipping + tax;

    const content = `
        <div style="padding: 20px;">
            <div style="margin-bottom: 20px;">
                ${cart.map(item => `
                    <div style="padding: 12px; border-bottom: 1px solid #333; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 2px;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
                                <div style="color: #b0b0b0; font-size: 12px;">$${item.price} each</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" style="background: #333; color: white; border: none; padding: 4px 8px; cursor: pointer; border-radius: 2px;">−</button>
                            <span style="width: 30px; text-align: center;">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" style="background: #333; color: white; border: none; padding: 4px 8px; cursor: pointer; border-radius: 2px;">+</button>
                        </div>
                        <div style="width: 80px; text-align: right;">
                            <div style="color: #d4af37; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</div>
                            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 12px; margin-top: 5px;">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="border-top: 1px solid #333; padding-top: 15px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #b0b0b0;">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #b0b0b0;">
                    <span>Shipping:</span>
                    <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #b0b0b0;">
                    <span>Tax:</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 10px; margin-top: 10px;">
                    <span style="font-weight: 600;">Total:</span>
                    <span style="color: #d4af37; font-weight: 700; font-size: 16px;">$${grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <button onclick="proceedToCheckout()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #d4af37 0%, #e8c547 100%); color: #0a0a0a; border: none; font-weight: 600; cursor: pointer; border-radius: 2px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Checkout</button>
            <button onclick="closeModal()" style="width: 100%; padding: 14px; background: transparent; color: #d4af37; border: 2px solid #d4af37; font-weight: 600; cursor: pointer; border-radius: 2px; text-transform: uppercase; letter-spacing: 1px;">Continue Shopping</button>
        </div>
    `;

    const modal = createModal('Shopping Cart', content);
}

function createModal(title, content) {
    // Remove existing modal
    closeModal();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: modalFadeIn 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: #1a1a1a;
        border: 1px solid #333;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        border-radius: 4px;
        animation: modalSlideUp 0.3s ease;
    `;

    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #333; position: sticky; top: 0; background: #1a1a1a; z-index: 10;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; margin: 0;">${title}</h2>
            <button onclick="closeModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
        </div>
        ${content}
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes modalSlideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.animation = 'modalFadeIn 0.3s ease reverse';
        setTimeout(() => modal.remove(), 300);
    }
}

function proceedToCheckout() {
    closeModal();
    showNotification('Redirecting to checkout...', 'success');
    setTimeout(() => {
        alert('In a production environment, this would redirect to a secure payment gateway.');
    }, 1000);
}

// ===========================
// Notifications
// ===========================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 16px 24px;
        border-radius: 2px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===========================
// Scroll Animations (AOS)
// ===========================

function initializeAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Initialize AOS on page load
document.addEventListener('DOMContentLoaded', initializeAOS);

// ===========================
// Scroll Effects
// ===========================

let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    // Update navbar styling on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollY > 100) {
            navbar.style.boxShadow = '0 10px 40px rgba(212, 175, 55, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }
});

// ===========================
// Keyboard Shortcuts
// ===========================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showSearchModal();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===========================
// Performance Optimization
// ===========================

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console message
console.log('%c🌟 Urban Thread - Redefining Modern Luxury 🌟', 'font-size: 20px; font-weight: bold; color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);');
console.log('%cWelcome to the luxury fashion experience', 'font-size: 14px; color: #b0b0b0;');
