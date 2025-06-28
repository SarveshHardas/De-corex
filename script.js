let bookingData = {
    services: [],
    total: 0,
    advance: 0,
    selectedPackages: {}
};

function showScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`screen${screenNumber}`).classList.add('active');
    
    if (screenNumber === 9) {
        updateBookingSummary();
    }
}

function filterEvents(type) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function toggleService(element, serviceName, price) {
    element.classList.toggle('selected');
    
    const existingIndex = bookingData.services.findIndex(s => s.name === serviceName);
    if (existingIndex > -1) {
        bookingData.services.splice(existingIndex, 1);
    } else {
        bookingData.services.push({ name: serviceName, price: price });
    }
    
    updateTotal();
}

function selectPackage(packageName, price) {
    bookingData.selectedPackages.lawn = { name: packageName, price: price };
    document.getElementById('packageDetails').innerHTML = `
        <h4>${packageName}</h4>
        <p>Price: ₹${price}</p>
        <p>Includes: Professional lawn setup, seating arrangements, and basic decorations</p>
    `;
    updateTotal();
}

function selectCatering(menuName, pricePerPerson) {
    bookingData.selectedPackages.catering = { name: menuName, pricePerPerson: pricePerPerson };
    updateCateringTotal();
}

function updateCateringTotal() {
    const guests = document.getElementById('guestCount').value || 0;
    const catering = bookingData.selectedPackages.catering;
    if (catering && guests > 0) {
        const total = catering.pricePerPerson * guests;
        catering.totalPrice = total;
        document.getElementById('cateringTotal').innerHTML = `
            <strong>Total Catering Cost: ₹${total}</strong>
            <br><small>${catering.name} for ${guests} guests</small>
        `;
        updateTotal();
    }
}

function selectDecoration(themeName, price) {
    bookingData.selectedPackages.decoration = { name: themeName, price: price };
    updateTotal();
}

function selectDJ(packageName, price) {
    bookingData.selectedPackages.dj = { name: packageName, price: price };
    updateTotal();
}

function toggleGenre(element) {
    element.classList.toggle('active');
}

function updateTotal() {
    let total = 0;
    bookingData.services.forEach(service => {
        total += service.price;
    });
    
    Object.values(bookingData.selectedPackages).forEach(package => {
        total += package.totalPrice || package.price || 0;
    });
    
    bookingData.total = total;
    bookingData.advance = Math.round(total * 0.3);
    const advanceElement = document.getElementById('advanceAmount');
    if (advanceElement) {
        advanceElement.textContent = `₹${bookingData.advance}`;
    }
}

// Update booking summary
function updateBookingSummary() {
    const summaryElement = document.getElementById('bookingSummary');
    let summaryHTML = '';
    bookingData.services.forEach(service => {
        summaryHTML += `
            <div class="summary-item">
                <span>${service.name}</span>
                <span>₹${service.price}</span>
            </div>
        `;
    });
    Object.values(bookingData.selectedPackages).forEach(package => {
        summaryHTML += `
            <div class="summary-item">
                <span>${package.name}</span>
                <span>₹${package.totalPrice || package.price}</span>
            </div>
        `;
    });
    
    summaryElement.innerHTML = summaryHTML;
    document.getElementById('totalAmount').textContent = `₹${bookingData.total}`;
}

function processPayment() {
    const name = document.getElementById('paymentName').value;
    const contact = document.getElementById('paymentContact').value;
    const paymentMode = document.getElementById('paymentMode').value;
    
    if (!name || !contact || !paymentMode) {
        alert('Please fill all payment details');
        return;
    }
    const bookingId = 'LVE' + Date.now().toString().slice(-6);
    
    document.getElementById('bookingId').textContent = bookingId;
    document.getElementById('confirmedDate').textContent = document.getElementById('searchDate').value || 'To be confirmed';
    document.getElementById('confirmedAmount').textContent = `₹${bookingData.total}`;
    document.getElementById('confirmedAdvance').textContent = `₹${bookingData.advance}`;
    
    setTimeout(() => {
        showScreen(11);
    }, 1000);
}

// Start over
function startOver() {
    bookingData = {
        services: [],
        total: 0,
        advance: 0,
        selectedPackages: {}
    };
    
    // Reset all forms
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.value = '';
    });
    
    // Reset all selections
    document.querySelectorAll('.selected, .active').forEach(element => {
        if (!element.classList.contains('screen')) {
            element.classList.remove('selected', 'active');
        }
    });
    
    showScreen(1);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.category-btn')[0].classList.add('active');
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active') && target.classList.contains('screen')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
    
    document.querySelectorAll('.screen').forEach(screen => {
        observer.observe(screen, { attributes: true });
    });
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

setInterval(() => {
    document.querySelectorAll('.card').forEach((card, index) => {
        if (card.closest('.screen.active')) {
            card.style.transform = `translateY(${Math.sin(Date.now() * 0.001 + index) * 2}px)`;
        }
    });
}, 50);