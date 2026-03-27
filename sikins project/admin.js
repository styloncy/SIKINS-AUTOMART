// ============================================
// ADMIN PANEL - Complete Management System
// ============================================

// Admin password
let ADMIN_PASSWORD = "STAYWOKE100";

// Data stores
let cars = [];
let discounts = [];
let reviews = [];
let settings = {};

// Load all data
function loadData() {
    // Load cars
    const savedCars = localStorage.getItem('sikins_cars');
    if (savedCars) {
        cars = JSON.parse(savedCars);
    } else {
        // Default cars
        cars = [
            {
                id: 1,
                name: "2023 Mercedes-Benz E-Class",
                price: 45990000,
                year: 2023,
                mileage: "8,500 mi",
                fuel: "Petrol",
                transmission: "Automatic",
                image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Executive saloon with AMG Line, panoramic roof, and full leather.",
                features: ["Leather seats", "Panoramic roof", "Navigation"],
                status: "available"
            },
            {
                id: 2,
                name: "2022 BMW X5 M Sport",
                price: 52500000,
                year: 2022,
                mileage: "12,300 mi",
                fuel: "Diesel",
                transmission: "Automatic",
                image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Luxury SUV with Harman Kardon, heads-up display, and 360 camera.",
                features: ["Harman Kardon", "360 camera", "Heads-up display"],
                status: "available"
            }
        ];
        saveCars();
    }
    
    // Load discounts
    const savedDiscounts = localStorage.getItem('sikins_discounts');
    if (savedDiscounts) {
        discounts = JSON.parse(savedDiscounts);
    } else {
        discounts = [];
        saveDiscounts();
    }
    
    // Load reviews
    const savedReviews = localStorage.getItem('sikins_reviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    } else {
        reviews = [];
        saveReviews();
    }
    
    // Load settings
    const savedSettings = localStorage.getItem('sikins_settings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        if (settings.password) ADMIN_PASSWORD = settings.password;
    } else {
        settings = {
            phone: "07068845177",
            whatsapp: "07068845177",
            instagram: "sikins.automart",
            email: "sikins.automart@gmail.com",
            hours: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed"
        };
        saveSettings();
    }
}

// Save functions
function saveCars() {
    localStorage.setItem('sikins_cars', JSON.stringify(cars));
    updateWebsiteData();
}

function saveDiscounts() {
    localStorage.setItem('sikins_discounts', JSON.stringify(discounts));
    updateWebsiteData();
}

function saveReviews() {
    localStorage.setItem('sikins_reviews', JSON.stringify(reviews));
}

function saveSettings() {
    localStorage.setItem('sikins_settings', JSON.stringify(settings));
}

// Update main website data
function updateWebsiteData() {
    const websiteData = {
        cars: cars.map(car => ({
            id: car.id,
            name: car.name,
            price: getFinalPrice(car.id),
            year: car.year,
            mileage: car.mileage,
            fuel: car.fuel,
            transmission: car.transmission,
            image: car.image,
            description: car.description,
            discount: getCarDiscount(car.id)
        })),
        settings: settings
    };
    localStorage.setItem('sikins_website_data', JSON.stringify(websiteData));
}

// Get discount for a car
function getCarDiscount(carId) {
    const discount = discounts.find(d => d.carId === carId && (!d.validUntil || new Date(d.validUntil) > new Date()));
    return discount;
}

// Get final price with discount
function getFinalPrice(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return 0;
    
    const discount = getCarDiscount(carId);
    if (!discount) return car.price;
    
    if (discount.type === 'percentage') {
        return car.price * (1 - discount.value / 100);
    } else {
        return car.price - discount.value;
    }
}

// Display cars in table
function displayCarsTable() {
    const tbody = document.getElementById('cars-table-body');
    if (!tbody) return;
    
    if (cars.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No cars added yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = cars.map(car => {
        const discount = getCarDiscount(car.id);
        const finalPrice = getFinalPrice(car.id);
        
        return `
            <tr>
                <td><img src="${car.image}" class="car-thumb" onerror="this.src='https://via.placeholder.com/60x40'"></td>
                <td><strong>${car.name}</strong></td>
                <td>₦${car.price.toLocaleString()}</td>
                <td>${discount ? `<span class="discount-badge">${discount.type === 'percentage' ? discount.value + '% OFF' : '₦' + discount.value.toLocaleString() + ' OFF'}</span>` : '-'}</td>
                <td class="final-price">₦${finalPrice.toLocaleString()}</td>
                <td>${car.year}</td>
                <td><span class="status-badge status-${car.status}">${car.status}</span></td>
                <td class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editCar(${car.id})">Edit</button>
                    <button class="action-btn discount-btn" onclick="openDiscountModal(${car.id})">Discount</button>
                    <button class="action-btn delete-btn" onclick="deleteCar(${car.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Update stats
    document.getElementById('total-cars').textContent = cars.length;
    const totalValue = cars.reduce((sum, car) => sum + car.price, 0);
    document.getElementById('total-value').textContent = `₦${totalValue.toLocaleString()}`;
    document.getElementById('active-discounts').textContent = discounts.filter(d => !d.validUntil || new Date(d.validUntil) > new Date()).length;
}

// Display discounts
function displayDiscounts() {
    const grid = document.getElementById('discounts-grid');
    if (!grid) return;
    
    const activeDiscounts = discounts.filter(d => !d.validUntil || new Date(d.validUntil) > new Date());
    
    if (activeDiscounts.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999;">No active discounts. Click "Create Discount" to add one.</p>';
        return;
    }
    
    grid.innerHTML = activeDiscounts.map(discount => {
        const car = cars.find(c => c.id === discount.carId);
        return `
            <div class="discount-card">
                <button class="remove-discount" onclick="removeDiscount(${discount.id})">✕</button>
                <h4>${car ? car.name : 'Unknown Car'}</h4>
                <div class="discount-value">${discount.type === 'percentage' ? discount.value + '% OFF' : '₦' + discount.value.toLocaleString() + ' OFF'}</div>
                ${discount.label ? `<div class="discount-label">🏷️ ${discount.label}</div>` : ''}
                ${discount.validUntil ? `<div class="discount-valid">Valid until: ${new Date(discount.validUntil).toLocaleDateString()}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Display reviews
function displayReviews() {
    const tbody = document.getElementById('reviews-table-body');
    if (!tbody) return;
    
    if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No reviews yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = reviews.map(review => `
        <tr>
            <td>${review.name}</td>
            <td class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</td>
            <td>${review.review.substring(0, 50)}${review.review.length > 50 ? '...' : ''}</td>
            <td>${review.car || '-'}</td>
            <td>${review.date}</td>
            <td><span class="status-badge ${review.approved ? 'status-available' : ''}" style="${!review.approved ? 'background:#ff9800;color:#fff' : ''}">${review.approved ? 'Approved' : 'Pending'}</span></td>
            <td class="action-buttons">
                ${!review.approved ? `<button class="action-btn approve-btn" onclick="approveReview(${review.id})">Approve</button>` : ''}
                <button class="action-btn delete-btn" onclick="deleteReview(${review.id})">Delete</button>
             </td>
         </>
    `).join('');
}

// Display statistics
function displayStatistics() {
    document.getElementById('stats-total-cars').textContent = cars.length;
    const totalValue = cars.reduce((sum, car) => sum + car.price, 0);
    document.getElementById('stats-total-value').textContent = `₦${totalValue.toLocaleString()}`;
    
    const approvedReviews = reviews.filter(r => r.approved);
    const avgRating = approvedReviews.length > 0 
        ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
        : 0;
    document.getElementById('stats-avg-rating').textContent = avgRating;
    document.getElementById('stats-total-reviews').textContent = approvedReviews.length;
    
    // Year chart
    const yearCount = {};
    cars.forEach(car => {
        yearCount[car.year] = (yearCount[car.year] || 0) + 1;
    });
    
    const chartDiv = document.getElementById('year-chart');
    const maxCount = Math.max(...Object.values(yearCount), 1);
    chartDiv.innerHTML = Object.entries(yearCount).sort().map(([year, count]) => `
        <div class="bar" style="height: ${(count / maxCount) * 150}px;">
            ${count}
            <div style="font-size: 12px;">${year}</div>
        </div>
    `).join('');
}

// Add car
function addCar(carData) {
    const newId = cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1;
    
    const newCar = {
        id: newId,
        name: carData.name,
        price: parseFloat(carData.price),
        year: parseInt(carData.year),
        mileage: carData.mileage,
        fuel: carData.fuel,
        transmission: carData.transmission,
        image: carData.image,
        description: carData.description || "",
        features: carData.features ? carData.features.split(',').map(f => f.trim()) : [],
        status: "available"
    };
    
    cars.push(newCar);
    saveCars();
    displayCarsTable();
    displayStatistics();
    showSection('cars');
    alert('Car added successfully!');
}

// Edit car
function editCar(id) {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-price').value = car.price;
    document.getElementById('car-year').value = car.year;
    document.getElementById('car-mileage').value = car.mileage;
    document.getElementById('car-fuel').value = car.fuel;
    document.getElementById('car-transmission').value = car.transmission;
    document.getElementById('car-image').value = car.image;
    document.getElementById('car-description').value = car.description;
    document.getElementById('car-features').value = car.features.join(', ');
    
    const form = document.getElementById('add-car-form');
    form.dataset.editId = id;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Car';
    
    showSection('add-car');
}

function updateCar(id, carData) {
    const index = cars.findIndex(c => c.id === id);
    if (index === -1) return;
    
    cars[index] = {
        ...cars[index],
        name: carData.name,
        price: parseFloat(carData.price),
        year: parseInt(carData.year),
        mileage: carData.mileage,
        fuel: carData.fuel,
        transmission: carData.transmission,
        image: carData.image,
        description: carData.description || cars[index].description,
        features: carData.features ? carData.features.split(',').map(f => f.trim()) : cars[index].features
    };
    
    saveCars();
    displayCarsTable();
    displayStatistics();
    showSection('cars');
    alert('Car updated successfully!');
}

// Delete car
function deleteCar(id) {
    if (confirm('Are you sure you want to delete this car?')) {
        cars = cars.filter(car => car.id !== id);
        discounts = discounts.filter(d => d.carId !== id);
        saveCars();
        saveDiscounts();
        displayCarsTable();
        displayDiscounts();
        displayStatistics();
        alert('Car deleted successfully!');
    }
}

// Discount functions
function openDiscountModal(carId = null) {
    const modal = document.getElementById('discountModal');
    const select = document.getElementById('discount-car-id');
    
    select.innerHTML = '<option value="">-- Select Car --</option>' + 
        cars.map(car => `<option value="${car.id}" ${carId === car.id ? 'selected' : ''}>${car.name}</option>`).join('');
    
    document.getElementById('discount-form').reset();
    modal.style.display = 'flex';
}

function closeDiscountModal() {
    document.getElementById('discountModal').style.display = 'none';
}

function addDiscount(discountData) {
    const newId = discounts.length > 0 ? Math.max(...discounts.map(d => d.id)) + 1 : 1;
    
    const newDiscount = {
        id: newId,
        carId: parseInt(discountData.carId),
        type: discountData.type,
        value: parseFloat(discountData.value),
        label: discountData.label || '',
        validUntil: discountData.validUntil || null
    };
    
    discounts.push(newDiscount);
    saveDiscounts();
    displayDiscounts();
    displayCarsTable();
    closeDiscountModal();
    alert('Discount applied successfully!');
}

function removeDiscount(id) {
    if (confirm('Remove this discount?')) {
        discounts = discounts.filter(d => d.id !== id);
        saveDiscounts();
        displayDiscounts();
        displayCarsTable();
        alert('Discount removed!');
    }
}

// Review functions
function approveReview(id) {
    const review = reviews.find(r => r.id === id);
    if (review) {
        review.approved = true;
        saveReviews();
        displayReviews();
        alert('Review approved!');
    }
}

function deleteReview(id) {
    if (confirm('Delete this review?')) {
        reviews = reviews.filter(r => r.id !== id);
        saveReviews();
        displayReviews();
        alert('Review deleted!');
    }
}

// Settings
function saveSettings() {
    settings.phone = document.getElementById('settings-phone').value;
    settings.whatsapp = document.getElementById('settings-whatsapp').value;
    settings.instagram = document.getElementById('settings-instagram').value;
    settings.email = document.getElementById('settings-email').value;
    settings.hours = document.getElementById('settings-hours').value;
    
    const newPassword = document.getElementById('settings-password').value;
    if (newPassword) {
        settings.password = newPassword;
        ADMIN_PASSWORD = newPassword;
        alert('Password changed! Please login again.');
        logout();
        return;
    }
    
    saveSettings();
    alert('Settings saved!');
}

// Section navigation
function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (sectionName === 'discounts') displayDiscounts();
    if (sectionName === 'reviews') displayReviews();
    if (sectionName === 'stats') displayStatistics();
}

// Login/Logout
function login(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_logged_in', 'true');
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadData();
        displayCarsTable();
        displayDiscounts();
        displayReviews();
        displayStatistics();
        
        // Populate settings form
        document.getElementById('settings-phone').value = settings.phone || '';
        document.getElementById('settings-whatsapp').value = settings.whatsapp || '';
        document.getElementById('settings-instagram').value = settings.instagram || '';
        document.getElementById('settings-email').value = settings.email || '';
        document.getElementById('settings-hours').value = settings.hours || '';
        return true;
    } else {
        alert('Incorrect password!');
        return false;
    }
}

function logout() {
    localStorage.removeItem('admin_logged_in');
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-form').reset();
}

// Form submissions
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (localStorage.getItem('admin_logged_in') === 'true') {
        login(ADMIN_PASSWORD);
    }
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        login(password);
    });
    
    // Add/Edit car form
    document.getElementById('add-car-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const carData = {
            name: document.getElementById('car-name').value,
            price: document.getElementById('car-price').value,
            year: document.getElementById('car-year').value,
            mileage: document.getElementById('car-mileage').value,
            fuel: document.getElementById('car-fuel').value,
            transmission: document.getElementById('car-transmission').value,
            image: document.getElementById('car-image').value,
            description: document.getElementById('car-description').value,
            features: document.getElementById('car-features').value
        };
        
        const form = document.getElementById('add-car-form');
        if (form.dataset.editId) {
            updateCar(parseInt(form.dataset.editId), carData);
            delete form.dataset.editId;
            form.querySelector('button[type="submit"]').textContent = 'Save Car';
        } else {
            addCar(carData);
        }
        
        form.reset();
    });
    
    // Discount form
    document.getElementById('discount-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addDiscount({
            carId: document.getElementById('discount-car-id').value,
            type: document.getElementById('discount-type').value,
            value: document.getElementById('discount-value').value,
            label: document.getElementById('discount-label').value,
            validUntil: document.getElementById('discount-valid-until').value
        });
    });
});