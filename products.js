// ===========================
// Products Page Functionality
// ===========================

let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [...products];

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    renderProducts();
    setupFilters();
    setupSearch();
    setupSorting();
    setupViewToggle();
    updateCartCount();
});

// ===========================
// Render Products
// ===========================

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    const productCount = document.getElementById('productCount');

    productCount.textContent = filteredProducts.length;

    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    grid.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    attachProductCardListeners();
    renderPagination();
}

// ===========================
// Filters Setup
// ===========================

function setupFilters() {
    const filterInputs = document.querySelectorAll('input[name="category"], input[name="size"], input[name="material"], input[name="color"], input[name="rating"]');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const minPriceDisplay = document.getElementById('minPrice');
    const maxPriceDisplay = document.getElementById('maxPrice');
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');

    // Category filter with "all" logic
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allCheckbox = document.querySelector('input[name="category"][value="all"]');
            const otherCheckboxes = document.querySelectorAll('input[name="category"]:not([value="all"])');

            if (allCheckbox.checked) {
                otherCheckboxes.forEach(cb => cb.checked = false);
            } else {
                otherCheckboxes.forEach(cb => cb.checked = false);
            }
        });
    });

    // Price range input
    priceMin.addEventListener('input', () => {
        const min = parseInt(priceMin.value);
        const max = parseInt(priceMax.value);
        if (min > max) priceMin.value = max;
        minPriceDisplay.textContent = priceMin.value;
    });

    priceMax.addEventListener('input', () => {
        const min = parseInt(priceMin.value);
        const max = parseInt(priceMax.value);
        if (max < min) priceMax.value = min;
        maxPriceDisplay.textContent = priceMax.value;
    });

    // Apply filters
    applyBtn.addEventListener('click', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
}

function applyFilters() {
    currentPage = 1;
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
    const materialCheckboxes = document.querySelectorAll('input[name="material"]:checked');
    const colorCheckboxes = document.querySelectorAll('input[name="color"]:checked');
    const ratingCheckboxes = document.querySelectorAll('input[name="rating"]:checked');

    const minPrice = parseInt(document.getElementById('priceMin').value);
    const maxPrice = parseInt(document.getElementById('priceMax').value);

    const categories = Array.from(categoryCheckboxes).map(cb => cb.value).filter(v => v !== 'all');
    const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);
    const materials = Array.from(materialCheckboxes).map(cb => cb.value);
    const colors = Array.from(colorCheckboxes).map(cb => cb.value);
    const ratings = Array.from(ratingCheckboxes).map(cb => parseInt(cb.value));

    filteredProducts = products.filter(product => {
        // Category filter
        if (categories.length > 0 && !categories.includes(product.category)) return false;

        // Price filter
        if (product.price < minPrice || product.price > maxPrice) return false;

        // Size filter (would need to add sizes to products data)
        // Material filter (would need to add materials to products data)
        // Color filter (would need to add colors to products data)
        // Rating filter (would need to add ratings to products data)

        return true;
    });

    renderProducts();
    closeFiltersPanel();
}

function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.value === 'all') cb.checked = true;
        else cb.checked = false;
    });
    document.getElementById('priceMin').value = 0;
    document.getElementById('priceMax').value = 1000;
    document.getElementById('minPrice').textContent = '0';
    document.getElementById('maxPrice').textContent = '1000';

    currentPage = 1;
    filteredProducts = [...products];
    renderProducts();
    closeFiltersPanel();
}

// ===========================
// Sorting
// ===========================

function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        currentPage = 1;

        switch (sortValue) {
            case 'newest':
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'bestseller':
                filteredProducts.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
                break;
            case 'rating':
                // Would need rating data
                break;
        }

        renderProducts();
    });
}

// ===========================
// View Toggle
// ===========================

function setupViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            const grid = document.getElementById('productsGrid');

            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
}

// ===========================
// Search
// ===========================

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            currentPage = 1;

            if (query.length > 0) {
                filteredProducts = products.filter(p =>
                    p.name.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
                );
            } else {
                filteredProducts = [...products];
            }

            renderProducts();
        });
    }
}

// ===========================
// Pagination
// ===========================

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    if (currentPage > 1) {
        html += `<button onclick="goToPage(${currentPage - 1})" class="prev-btn">← Previous</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<button class="active">${i}</button>`;
        } else if (i <= 3 || i >= totalPages - 2 || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button onclick="goToPage(${i})">${i}</button>`;
        } else if (i === 4 || i === totalPages - 3) {
            html += '<span>...</span>';
        }
    }

    // Next button
    if (currentPage < totalPages) {
        html += `<button onclick="goToPage(${currentPage + 1})" class="next-btn">Next →</button>`;
    }

    pagination.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================
// Filters Panel Mobile
// ===========================

const toggleFiltersBtn = document.getElementById('toggleFilters');
const closeFiltersBtn = document.getElementById('closeFilters');
const filtersSidebar = document.getElementById('filtersSidebar');

if (toggleFiltersBtn) {
    toggleFiltersBtn.addEventListener('click', () => {
        filtersSidebar.classList.add('active');
    });
}

if (closeFiltersBtn) {
    closeFiltersBtn.addEventListener('click', () => {
        filtersSidebar.classList.remove('active');
    });
}

function closeFiltersPanel() {
    filtersSidebar.classList.remove('active');
}

// Close filters when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.filters-sidebar') && !e.target.closest('.toggle-filters')) {
        closeFiltersPanel();
    }
});
