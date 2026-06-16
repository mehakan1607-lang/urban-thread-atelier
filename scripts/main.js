/* ============================================
   MAIN JAVASCRIPT FILE
   Urban Thread Atelier - Luxury Fashion
   ============================================ */

// ============================================
// DOM ELEMENTS
// ============================================

const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const buttons = document.querySelectorAll('.btn');
const productCards = document.querySelectorAll('.product-card');
const addToCartButtons = document.querySelectorAll('.btn-small');
const wishlistButtons = document.querySelectorAll('.btn-icon');
const newsletterForm = document.querySelector('.newsletter-form');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadProductData();
    setupAOS();
    console.log('🎩 Urban Thread Atelier initialized successfully!');
});

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => handleAddToCart(e, index));
    });

    wishlistButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => handleWishlist(e, index));
    });

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    const heroButton = document.querySelector('.hero-content .btn');
    if (heroButton) {
        heroButton.addEventListener('click', scrollToCollections);
    }

    window.addEventListener('scroll', handleScroll);
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function handleNavClick(e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    const section = document.querySelector(target);
    
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToCollections() {
    const collectionsSection = document.querySelector('#collections');
    if (collectionsSection) {
        collectionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// SHOPPING CART FUNCTIONS
// ============================================

class ShoppingCart {
    constructor() {
        this.items = this.loadFromLocalStorage() || [];
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveToLocalStorage();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToLocalStorage();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(quantity, 1);
            this.saveToLocalStorage();
        }
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadFromLocalStorage() {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : null;
    }

    showNotification(message) {
        const notification = createNotification(message, 'success');
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

const cart = new ShoppingCart();

function handleAddToCart(e, index) {
    e.preventDefault();
    
    const productCard = productCards[index];
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', '').split(' ')[0]);
    
    const product = {
        id: `product-${index}`,
        name: productName,
        price: productPrice,
        image: productCard.querySelector('img').src
    };

    cart.addItem(product);
    
    e.target.style.backgroundColor = '#4caf50';
    e.target.textContent = '✓ Added';
    
    setTimeout(() => {
        e.target.style.backgroundColor = '';
        e.target.textContent = 'Add to Cart';
    }, 2000);
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================

class Wishlist {
    constructor() {
        this.items = this.loadFromLocalStorage() || [];
    }

    addItem(product) {
        if (!this.items.find(item => item.id === product.id)) {
            this.items.push(product);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToLocalStorage();
    }

    isInWishlist(productId) {
        return this.items.some(item => item.id === productId);
    }

    saveToLocalStorage() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }

    loadFromLocalStorage() {
        const wishlistData = localStorage.getItem('wishlist');
        return wishlistData ? JSON.parse(wishlistData) : null;
    }
}

const wishlist = new Wishlist();

function handleWishlist(e, index) {
    e.preventDefault();
    
    const productCard = productCards[index];
    const product = {
        id: `product-${index}`,
        name: productCard.querySelector('h3').textContent,
        price: productCard.querySelector('.price').textContent
    };

    const button = e.target;
    
    if (wishlist.isInWishlist(product.id)) {
        wishlist.removeItem(product.id);
        button.style.opacity = '0.6';
        button.title = 'Add to Wishlist';
    } else {
        wishlist.addItem(product);
        button.style.opacity = '1';
        button.style.color = '#f44336';
        button.title = 'Remove from Wishlist';
    }
}

// ============================================
// NEWSLETTER FUNCTIONS
// ============================================

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value;

    if (validateEmail(email)) {
        let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        }

        const notification = createNotification('✓ Thank you for subscribing!', 'success');
        document.body.appendChild(notification);

        emailInput.value = '';

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    } else {
        const notification = createNotification('Please enter a valid email address', 'error');
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============================================
// PRODUCT DATA
// ============================================

function loadProductData() {
    const products = [
        {
            id: 'product-0',
            name: 'Premium Silk Jacket',
            designer: 'By Elegance & Co.',
            price: 2499,
            category: 'outerwear',
            isNew: true
        },
        {
            id: 'product-1',
            name: 'Evening Gown',
            designer: 'By Haute Couture',
            price: 2999,
            originalPrice: 3999,
            category: 'dresses',
            isSale: true
        },
        {
            id: 'product-2',
            name: 'Italian Leather Shoes',
            designer: 'By Luxe Footwear',
            price: 1299,
            category: 'footwear',
            isExclusive: true
        },
        {
            id: 'product-3',
            name: 'Leather Handbag',
            designer: 'By Prestige Accessories',
            price: 1899,
            category: 'accessories',
            isPremium: true
        }
    ];

    localStorage.setItem('products', JSON.stringify(products));
    return products;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function createNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        background-color: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    return notification;
}

function handleScroll() {
    const scrollPosition = window.scrollY;
    
    productCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect();
        if (cardPosition.top < window.innerHeight * 0.8) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// ============================================
// ANIMATION ON SCROLL (AOS)
// ============================================

function setupAOS() {
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
    });
}

// ============================================
// ADDITIONAL FEATURES
// ============================================

function toggleDarkMode() {
    const isDarkMode = document.documentElement.style.colorScheme === 'dark';
    document.documentElement.style.colorScheme = isDarkMode ? 'light' : 'dark';
    localStorage.setItem('darkMode', !isDarkMode);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .notification.fade-out {
        animation: slideOut 0.3s ease-out forwards;
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .product-card {
        transition: all 0.3s ease-out;
    }
`;

document.head.appendChild(style);

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c🎩 Urban Thread Atelier', 'font-size: 24px; font-weight: bold; color: #d4af37;');
console.log('%cWelcome to the luxury fashion e-commerce platform!', 'font-size: 14px; color: #666;');
console.log('%cCart Items:', cart.getTotalItems());
console.log('%cWishlist Items:', wishlist.items.length);