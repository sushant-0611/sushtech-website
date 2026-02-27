// script.js - SushTech Main JavaScript

// ========== RIGHT SIDE PANEL MENU ==========
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidePanel = document.getElementById('sidePanel');
    const closePanel = document.getElementById('closePanel');
    const overlay = document.getElementById('overlay');
    const panelLinks = document.querySelectorAll('.panel-link');
    
    // Check if elements exist
    if (!menuToggle || !sidePanel || !closePanel || !overlay) return;
    
    // Function to open panel
    function openPanel() {
        sidePanel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuToggle.style.opacity = '0';
    }
    
    // Function to close panel
    function closePanelMenu() {
        sidePanel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.style.opacity = '1';
    }
    
    menuToggle.addEventListener('click', openPanel);
    closePanel.addEventListener('click', closePanelMenu);
    overlay.addEventListener('click', closePanelMenu);
    
    panelLinks.forEach(link => {
        link.addEventListener('click', function() {
            closePanelMenu();
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidePanel.classList.contains('active')) {
            closePanelMenu();
        }
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && sidePanel.classList.contains('active')) {
            closePanelMenu();
        }
    });
});

// ========== USE CONFIG FROM GLOBAL SCOPE ==========
// config is already available from config.js as SUSHITECH_CONFIG

// ========== POPULATE PRICING CARDS FROM CONFIG ==========
function populatePricingCards() {
    const pricingGrid = document.querySelector('.pricing-grid');
    if (!pricingGrid || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    const plans = config.pricing;
    let html = '';
    
    // Loop through pricing plans from config
    Object.keys(plans).forEach((key) => {
        const plan = plans[key];
        const popularClass = plan.popular ? 'popular' : '';
        const popularBadge = plan.popular ? '<div class="popular-badge">Most Popular</div>' : '';
        
        html += `
            <div class="price-card card-scroll-highlight ${popularClass}">
                ${popularBadge}
                <div class="price-badge" style="border-color: ${plan.badgeColor}; color: ${plan.badgeColor};">${plan.badge}</div>
                <h4>${plan.name}</h4>
                <div class="price-amount">${plan.price}<small> ${plan.priceSuffix}</small></div>
                <ul class="feature-list">
                    ${plan.features.map(f => `
                        <li><i class="fas fa-check-circle"></i> <span>${f}</span></li>
                    `).join('')}
                </ul>
                <a href="#contact" class="btn-plan">Get Started</a>
                <div class="price-footer-note">${plan.note}</div>
            </div>
        `;
    });
    
    pricingGrid.innerHTML = html;
}

// ========== POPULATE FEATURES FROM CONFIG ==========
function populateFeatures() {
    const featuresGrid = document.querySelector('.choose-grid');
    if (!featuresGrid || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    let html = '';
    
    config.features.forEach(feature => {
        html += `
            <div class="choose-item card-scroll-highlight">
                <i class="fas ${feature.icon}"></i>
                <h4>${feature.title}</h4>
                <p>${feature.description}</p>
            </div>
        `;
    });
    
    featuresGrid.innerHTML = html;
}

// ========== POPULATE FOUNDER CARD FROM CONFIG ==========
function populateFounder() {
    const founderCard = document.querySelector('.founder-card');
    if (!founderCard || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    const founder = config.founder;
    
    // Check if founder card exists in HTML
    if (!founderCard) return;
    
    founderCard.innerHTML = `
        <div class="founder-img">
            <img src="${founder.imageUrl}" alt="${founder.fullName || founder.name}">
        </div>
        <div class="founder-info">
            <h4>${founder.name}</h4>
            <div class="founder-tagline">${founder.tagline}</div>
            <div class="founder-age">${founder.age}</div>
            <p class="founder-bio">${founder.bio}</p>
            <div class="founder-skills">
                ${founder.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `;
}

// ========== DEMO MODAL FUNCTIONS ==========
// Make functions global
window.openDemoModal = function(category) {
    // Close any open modals first
    closeAllModals();
    
    // Open the specific category modal
    const modalId = category + 'DemoModal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

function closeAllModals() {
    const modals = document.querySelectorAll('.demo-modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

window.openDemoLink = function(demoKey) {
    if (typeof SUSHITECH_CONFIG === 'undefined') {
        console.error('❌ config.js not loaded!');
        alert('Demo links not available. Please try again later.');
        return;
    }
    
    // Determine which category the demo belongs to
    let demoLink = null;
    
    // Check in wedding demos
    if (SUSHITECH_CONFIG.weddingDemos && SUSHITECH_CONFIG.weddingDemos[demoKey]) {
        demoLink = SUSHITECH_CONFIG.weddingDemos[demoKey];
    }
    // Check in business demos
    else if (SUSHITECH_CONFIG.businessDemos && SUSHITECH_CONFIG.businessDemos[demoKey]) {
        demoLink = SUSHITECH_CONFIG.businessDemos[demoKey];
    }
    // Check in ecommerce demos
    else if (SUSHITECH_CONFIG.ecommerceDemos && SUSHITECH_CONFIG.ecommerceDemos[demoKey]) {
        demoLink = SUSHITECH_CONFIG.ecommerceDemos[demoKey];
    }
    
    if (demoLink) {
        window.open(demoLink, '_blank');
        closeAllModals(); // Close modal after opening link
    } else {
        console.error(`❌ No link found for demo: ${demoKey}`);
        alert('Demo link not available. Please try again later.');
    }
};

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('demo-modal')) {
        closeAllModals();
    }
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// ========== POPULATE SOCIAL LINKS IN FOOTER ==========
function populateSocialLinks() {
    const socialLinksContainer = document.querySelector('.social-links');
    if (!socialLinksContainer || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    const social = config.social;
    
    // Clear existing links
    socialLinksContainer.innerHTML = '';
    
    // Create social links from config
    if (social.linkedin) {
        const link = document.createElement('a');
        link.href = social.linkedin;
        link.target = '_blank';
        link.rel = 'noopener noreferrer'; // Security best practice
        link.innerHTML = '<i class="fab fa-linkedin"></i>';
        link.title = 'LinkedIn';
        link.setAttribute('aria-label', 'LinkedIn');
        socialLinksContainer.appendChild(link);
    }
    
    if (social.instagram) {
        const link = document.createElement('a');
        link.href = social.instagram;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = '<i class="fab fa-instagram"></i>';
        link.title = 'Instagram';
        link.setAttribute('aria-label', 'Instagram');
        socialLinksContainer.appendChild(link);
    }
    
    if (social.github) {
        const link = document.createElement('a');
        link.href = social.github;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = '<i class="fab fa-github"></i>';
        link.title = 'GitHub';
        link.setAttribute('aria-label', 'GitHub');
        socialLinksContainer.appendChild(link);
    }
    
    // Optional: Twitter if exists
    if (social.twitter) {
        const link = document.createElement('a');
        link.href = social.twitter;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = '<i class="fab fa-twitter"></i>';
        link.title = 'Twitter';
        link.setAttribute('aria-label', 'Twitter');
        socialLinksContainer.appendChild(link);
    }
    
    console.log('✅ Social links populated from config:', social);
}

// ========== POPULATE CONTACT INFO FROM CONFIG ==========
function populateContactInfo() {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    const company = config.company;
    
    // Format WhatsApp number
    const cleanWhatsapp = company.whatsapp.replace(/[^0-9]/g, '');
    const whatsappMessage = encodeURIComponent(`Hello ${company.name}, I'm interested in your services`);
    
    contactInfo.innerHTML = `
        <p><i class="fas fa-phone-alt"></i> <span>${company.phone}</span></p>
        <p><i class="fab fa-whatsapp"></i> <span>${company.whatsapp} (WhatsApp)</span></p>
        <p><i class="far fa-clock"></i> <span>${company.hours}</span></p>
        <a href="https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}" 
           target="_blank" class="chat-btn">
            <i class="fab fa-whatsapp"></i> Chat on WhatsApp
        </a>
    `;
    
    const businessEmail = document.querySelector('.business-email');
    if (businessEmail) {
        businessEmail.innerHTML = `<i class="fas fa-envelope"></i> ${company.email}`;
        businessEmail.href = `mailto:${company.email}`;
    }
}

// ========== UPDATE WHATSAPP FLOAT LINK ==========
function updateWhatsAppFloat() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (!whatsappFloat || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    const company = config.company;
    const cleanWhatsapp = company.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${company.name}, I'm interested in your services`);
    
    whatsappFloat.href = `https://wa.me/${cleanWhatsapp}?text=${message}`;
}

// ========== UPDATE FOOTER WITH COMPANY INFO ==========
function updateFooter() {
    const footer = document.querySelector('footer p');
    if (!footer || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    const year = new Date().getFullYear();
    footer.innerHTML = `© ${year} ${config.company.name}. All rights reserved.`;
}

// ========== FORM SUBMISSION ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formStatus = document.getElementById('formStatus');
        if (formStatus) {
            formStatus.innerHTML = '<span style="color: #22D3EE; font-weight: 500;">✓ Message sent successfully! We\'ll contact you soon.</span>';
            formStatus.style.display = 'block';
        }
        
        contactForm.reset();
        
        setTimeout(() => {
            if (formStatus) formStatus.style.display = 'none';
        }, 5000);
    });
}

// ========== SMOOTH SCROLL FOR NAVIGATION ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== ACTIVE NAVIGATION HIGHLIGHT ==========
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const panelLinks = document.querySelectorAll('.panel-link');
    
    if (sections.length === 0 || panelLinks.length === 0) return;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    panelLinks.forEach(link => {
        link.classList.remove('active');
        link.style.borderLeftColor = 'transparent';
        link.style.color = '#F8FAFC';
        
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            link.style.borderLeftColor = '#22D3EE';
            link.style.color = '#22D3EE';
        }
    });
});

// ========== BACK TO TOP BUTTON ==========
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== HORIZONTAL SCROLL INDICATOR ==========
function initHorizontalScrollIndicator() {
    const demoGrid = document.getElementById('demoGrid');
    const dots = document.querySelectorAll('.dot');
    const scrollIndicator = document.querySelector('.scroll-indicator-horizontal');
    
    if (!demoGrid || dots.length === 0) return;
    
    // Update dots on scroll
    demoGrid.addEventListener('scroll', function() {
        const scrollLeft = demoGrid.scrollLeft;
        const maxScroll = demoGrid.scrollWidth - demoGrid.clientWidth;
        const scrollPercentage = (scrollLeft / maxScroll) * 100;
        
        // Update active dot based on scroll position
        if (scrollPercentage < 33) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === 0);
            });
        } else if (scrollPercentage < 66) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === 1);
            });
        } else {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === 2);
            });
        }
        
        // Hide gradient when scrolled to end
        const gradient = demoGrid.querySelector('::after');
        if (demoGrid.scrollLeft + demoGrid.clientWidth >= demoGrid.scrollWidth - 10) {
            demoGrid.style.setProperty('--gradient-opacity', '0');
        } else {
            demoGrid.style.setProperty('--gradient-opacity', '1');
        }
    });
    
    // Click on dots to scroll
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const cardWidth = demoGrid.querySelector('.demo-card')?.offsetWidth || 300;
            const gap = 25;
            const scrollTo = index * (cardWidth + gap);
            
            demoGrid.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        });
    });
    
    // Hide indicator after user scrolls once
    if (scrollIndicator) {
        let hasScrolled = false;
        
        demoGrid.addEventListener('scroll', function() {
            if (!hasScrolled) {
                hasScrolled = true;
                setTimeout(() => {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.transition = 'opacity 0.5s ease';
                }, 2000);
            }
        });
    }
}

// ========== CARD SCROLL HIGHLIGHT ANIMATION ==========
function initCardHighlight() {
    const cards = document.querySelectorAll('.card-scroll-highlight');
    
    if (cards.length === 0) return;
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add highlight class when card enters viewport
                entry.target.classList.add('card-visible');
                
                // Optional: Remove highlight after animation
                // Uncomment if you want the highlight to fade after appearing
                // setTimeout(() => {
                //     entry.target.classList.remove('card-visible');
                // }, 1500);
            } else {
                // Remove highlight when card leaves viewport
                entry.target.classList.remove('card-visible');
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of card is visible
        rootMargin: '0px 0px -50px 0px' // Slight offset for better UX
    });
    
    // Observe each card
    cards.forEach(card => {
        observer.observe(card);
    });
    
    console.log(`✅ Card highlight initialized for ${cards.length} cards`);
}

// ========== HORIZONTAL CARDS OBSERVER ==========
function initHorizontalCardsObserver() {
    const demoGrid = document.getElementById('demoGrid');
    const cards = document.querySelectorAll('.demo-card');
    
    if (!demoGrid || cards.length === 0) return;
    
    // Create observer for horizontal cards with custom threshold
    const horizontalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
            } else {
                // Check if card is still partially visible in horizontal scroll
                const rect = entry.target.getBoundingClientRect();
                const containerRect = demoGrid.getBoundingClientRect();
                
                // Keep highlight if card is within horizontal viewport
                if (rect.right > containerRect.left && rect.left < containerRect.right) {
                    entry.target.classList.add('card-visible');
                } else {
                    entry.target.classList.remove('card-visible');
                }
            }
        });
    }, {
        threshold: [0, 0.3, 0.6, 1],
        root: demoGrid,
        rootMargin: '0px'
    });
    
    cards.forEach(card => {
        horizontalObserver.observe(card);
    });
}

// ========== INITIALIZE PAGE ==========
function init() {
    // Check if config is loaded
    if (typeof SUSHITECH_CONFIG === 'undefined') {
        console.error('❌ config.js not loaded! Make sure config.js is included before script.js');
        return;
    }
    
    // Populate all dynamic content from config
    populatePricingCards();
    populateFeatures();
    populateFounder();
    populateContactInfo();
    populateSocialLinks();
    updateWhatsAppFloat();
    updateFooter();
    
    // Initialize new features
    initBackToTop();
    initHorizontalScrollIndicator();
    
    // Initialize card highlight after content is populated
    setTimeout(() => {
        initCardHighlight();
        initHorizontalCardsObserver();
    }, 500); // Small delay to ensure DOM is ready
    
    console.log('✅ SushTech website initialized with config data and new features');
    console.log('✅ Social links loaded from config:', SUSHITECH_CONFIG.social);
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
