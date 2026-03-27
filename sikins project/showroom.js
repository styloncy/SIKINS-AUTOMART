// ============================================
// SHOWROOM PAGE - Car Inventory
// ============================================

// Your car inventory
const carsForSale = [
    {
        id: 1,
        name: "2023 Mercedes-Benz E-Class",
        price: 45990,
        year: 2023,
        mileage: "8,500 mi",
        fuel: "Petrol",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Executive saloon with AMG Line, panoramic roof, and full leather."
    },
    {
        id: 2,
        name: "2022 BMW X5 M Sport",
        price: 52500,
        year: 2022,
        mileage: "12,300 mi",
        fuel: "Diesel",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Luxury SUV with Harman Kardon, heads-up display, and 360 camera."
    },
    {
        id: 3,
        name: "2021 Audi RS5",
        price: 58995,
        year: 2021,
        mileage: "18,200 mi",
        fuel: "Petrol",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "High-performance coupe, Quattro, V6 biturbo, in stunning Nardo Grey."
    },
    {
        id: 4,
        name: "2023 Tesla Model 3",
        price: 49990,
        year: 2023,
        mileage: "5,200 mi",
        fuel: "Electric",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Long Range, Autopilot, premium interior, and glass roof."
    },
    {
        id: 5,
        name: "2022 Range Rover Sport",
        price: 78995,
        year: 2022,
        mileage: "9,800 mi",
        fuel: "Diesel",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Luxury SUV with off-road capabilities, panoramic roof, and premium sound."
    }
];

let currentCars = [...carsForSale];

// Display cars
function displayCars() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    
    if (currentCars.length === 0) {
        grid.innerHTML = '<div class="loading">No cars match your filters. Try different options!</div>';
        return;
    }
    
    grid.innerHTML = currentCars.map(car => `
        <div class="car-card">
            <div class="car-badge ${car.status === 'sold' ? 'sold' : 'available'}">
                ${car.status === 'sold' ? 'SOLD' : 'AVAILABLE'}
            </div>
            <img src="${car.image}" alt="${car.name}" onerror="this.src='https://via.placeholder.com/800x600?text=Image+Not+Found'">
            <div class="car-info">
                <div class="car-title">${car.name}</div>
                <div class="car-price">$${car.price.toLocaleString()}</div>
                <div class="car-details">
                    <span>📅 ${car.year}</span>
                    <span>📊 ${car.mileage}</span>
                    <span>⛽ ${car.fuel}</span>
                    <span>⚙️ ${car.transmission}</span>
                </div>
                <button class="btn-details" onclick="viewCarDetails(${car.id})">View Details</button>
                <button class="btn-payment" onclick="enquireAboutCar('${car.name.replace(/'/g, "\\'")}', ${car.price})">
                    💬 Enquire Now
                </button>
            </div>
        </div>
    `).join('');
}

// Apply filters
function applyFilters() {
    const fuel = document.getElementById('fuelFilter').value;
    const price = document.getElementById('priceFilter').value;
    const year = document.getElementById('yearFilter').value;
    
    currentCars = carsForSale.filter(car => {
        // Fuel filter
        if (fuel && car.fuel !== fuel) return false;
        
        // Price filter
        if (price) {
            if (price === '0-20000' && car.price > 20000) return false;
            if (price === '20000-40000' && (car.price <= 20000 || car.price > 40000)) return false;
            if (price === '40000-60000' && (car.price <= 40000 || car.price > 60000)) return false;
            if (price === '60000+' && car.price <= 60000) return false;
        }
        
        // Year filter
        if (year) {
            const carYear = parseInt(car.year);
            const filterYear = parseInt(year);
            if (carYear < filterYear) return false;
        }
        
        return true;
    });
    
    displayCars();
    
    // Update count
    const countElement = document.getElementById('result-count');
    if (countElement) {
        countElement.textContent = `${currentCars.length} cars found`;
    }
}

// Reset filters
function resetFilters() {
    document.getElementById('fuelFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('yearFilter').value = '';
    currentCars = [...carsForSale];
    displayCars();
}

// View car details (modal)
function viewCarDetails(carId) {
    const car = carsForSale.find(c => c.id === carId);
    if (!car) return;
    
    const modalHtml = `
        <div id="carModal" class="car-modal">
            <div class="car-modal-content">
                <span class="close-modal" onclick="closeCarModal()">&times;</span>
                <div class="car-modal-grid">
                    <div class="car-modal-image">
                        <img src="${car.image}" alt="${car.name}">
                    </div>
                    <div class="car-modal-info">
                        <h2>${car.name}</h2>
                        <div class="car-modal-price">£${car.price.toLocaleString()}</div>
                        
                        <div class="car-specs">
                            <div class="spec-item">
                                <strong>Year:</strong> ${car.year}
                            </div>
                            <div class="spec-item">
                                <strong>Mileage:</strong> ${car.mileage}
                            </div>
                            <div class="spec-item">
                                <strong>Fuel:</strong> ${car.fuel}
                            </div>
                            <div class="spec-item">
                                <strong>Transmission:</strong> ${car.transmission}
                            </div>
                        </div>
                        
                        <div class="car-description">
                            <h4>Description</h4>
                            <p>${car.description}</p>
                        </div>
                        
                        <div class="car-actions">
                            <button class="btn-primary" onclick="enquireAboutCar('${car.name.replace(/'/g, "\\'")}', ${car.price})">
                                Enquire Now
                            </button>
                            <button class="btn-secondary" onclick="scheduleTestDrive('${car.name.replace(/'/g, "\\'")}')">
                                Test Drive
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeCarModal() {
    const modal = document.getElementById('carModal');
    if (modal) modal.remove();
}

// Enquire about car
function enquireAboutCar(carName, price) {
    const phone = "07068845177";
    const message = `Hello, I'm interested in the ${carName} (Price: £${price.toLocaleString()}). Is it still available?`;
    window.open(`https://wa.me/44${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Schedule test drive
function scheduleTestDrive(carName) {
    const phone = "07068845177";
    const message = `Hello, I'd like to schedule a test drive for the ${carName}. Please let me know available times.`;
    window.open(`https://wa.me/44${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayCars();
});