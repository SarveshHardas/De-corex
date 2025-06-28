// Store user selections
let userDetails = {
    name: '',
    contact: '',
    email: '',
    place: '',
    eventType: '',
    services: [],
    totalAmount: 0
};

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const loginForm = document.getElementById('login-form');
const screens = document.querySelectorAll('.screen');

// Event Listeners
loginBtn.addEventListener('click', () => {
    switchScreen('login-screen');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Save user details
    userDetails.name = document.getElementById('name').value;
    userDetails.contact = document.getElementById('contact').value;
    userDetails.email = document.getElementById('email').value;
    userDetails.place = document.getElementById('place').value;
    
    switchScreen('event-type-screen');
});

// Functions
function switchScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function goBack(previousScreen) {
    switchScreen(previousScreen);
}

function selectEventType(eventType) {
    userDetails.eventType = eventType;
    document.getElementById('service-screen-title').textContent = `Services for ${eventType}`;
    switchScreen('service-screen');
}

function showServiceOptions(serviceType) {
    switchScreen(`${serviceType}-screen`);
}

function selectService(type, name, description, price) {
    // Check if service is already selected
    const existingServiceIndex = userDetails.services.findIndex(service => service.type === type);
    
    const service = {
        type: type,
        name: name,
        description: description,
        price: price
    };
    
    if (existingServiceIndex !== -1) {
        // Update existing service selection
        userDetails.services[existingServiceIndex] = service;
    } else {
        // Add new service selection
        userDetails.services.push(service);
    }
    
    // Recalculate total
    calculateTotal();
    
    // Go back to services screen
    switchScreen('service-screen');
    
    // Show confirmation
    alert(`${name} has been selected for ${type} service`);
}

function calculateTotal() {
    userDetails.totalAmount = userDetails.services.reduce((total, service) => total + service.price, 0);
}

function showBillingScreen() {
    if (userDetails.services.length === 0) {
        alert('Please select at least one service');
        return;
    }
    
    // Display user details
    document.getElementById('bill-name').textContent = `Name: ${userDetails.name}`;
    document.getElementById('bill-contact').textContent = `Contact: ${userDetails.contact}`;
    document.getElementById('bill-email').textContent = `Email: ${userDetails.email}`;
    document.getElementById('bill-place').textContent = `Location: ${userDetails.place}`;
    
    // Display event type
    document.getElementById('bill-event-type').textContent = `Event Type: ${userDetails.eventType}`;
    
    // Display selected services
    const servicesContainer = document.getElementById('selected-services');
    servicesContainer.innerHTML = '';
    
    userDetails.services.forEach(service => {
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service-item';
        serviceDiv.innerHTML = `
            <div>
                <strong>${service.type}</strong><br>
                ${service.name}<br>
                <small>${service.description}</small>
            </div>
            <span>$${service.price}</span>
        `;
        servicesContainer.appendChild(serviceDiv);
    });
    
    // Display total
    document.getElementById('total-amount').textContent = `$${userDetails.totalAmount}`;
    
    switchScreen('billing-screen');
}

function showPaymentScreen() {
    document.getElementById('payment-total').textContent = `$${userDetails.totalAmount}`;
    const advanceAmount = userDetails.totalAmount * 0.4;
    document.getElementById('advance-amount').textContent = `$${advanceAmount.toFixed(2)}`;
    switchScreen('payment-screen');
}

function showSuccessScreen() {
    // Validate payment form
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('card-name').value;
    
    if (!cardNumber || !expiry || !cvv || !cardName) {
        alert('Please fill all payment details');
        return;
    }
    
    switchScreen('success-screen');
}

function resetApp() {
    // Reset user details
    userDetails = {
        name: userDetails.name,
        contact: userDetails.contact,
        email: userDetails.email,
        place: userDetails.place,
        eventType: '',
        services: [],
        totalAmount: 0
    };
    
    // Reset form
    document.getElementById('login-form').reset();
    
    // Go back to event type selection
    switchScreen('event-type-screen');
}