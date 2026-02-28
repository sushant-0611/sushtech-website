// script.js - SushTech Main JavaScript (Optimized Version)

// ========== UTILITY FUNCTIONS ==========
// Batch DOM reads/writes to prevent layout thrashing
const DOMHandler = {
    reads: [],
    writes: [],
    scheduled: false,
    
    // Schedule a batch operation
    schedule() {
        if (this.scheduled) return;
        this.scheduled = true;
        
        requestAnimationFrame(() => {
            // Perform all reads first
            const reads = [...this.reads];
            this.reads = [];
            
            const readResults = reads.map(fn => {
                try { return fn(); } 
                catch (e) { console.error('DOM read error:', e); return null; }
            });
            
            // Then perform all writes with read results
            const writes = [...this.writes];
            this.writes = [];
            
            writes.forEach((fn, index) => {
                try { 
                    // Pass corresponding read result if available
                    fn(readResults[index]); 
                } catch (e) { 
                    console.error('DOM write error:', e); 
                }
            });
            
            this.scheduled = false;
            
            // Reschedule if new tasks were added during this cycle
            if (this.reads.length > 0 || this.writes.length > 0) {
                this.schedule();
            }
        });
    },
    
    // Queue a read operation
    read(fn) {
        this.reads.push(fn);
        this.schedule();
    },
    
    // Queue a write operation
    write(fn) {
        this.writes.push(fn);
        this.schedule();
    }
};

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

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
        // Use DOMHandler for batch operations
        DOMHandler.write(() => {
            sidePanel.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            menuToggle.style.opacity = '0';
        });
    }
    
    // Function to close panel
    function closePanelMenu() {
        DOMHandler.write(() => {
            sidePanel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.style.opacity = '1';
        });
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
    
    // Optimized resize handler - using throttle
    window.addEventListener('resize', throttle(function() {
        if (window.innerWidth > 767 && sidePanel.classList.contains('active')) {
            closePanelMenu();
        }
    }, 100));
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
    
    // Single DOM write operation
    DOMHandler.write(() => {
        pricingGrid.innerHTML = html;
    });
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
    
    DOMHandler.write(() => {
        featuresGrid.innerHTML = html;
    });
}

// ========== POPULATE FOUNDER CARD FROM CONFIG ==========
function populateFounder() {
    const founderCard = document.querySelector('.founder-card');
    if (!founderCard || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    const founder = config.founder;
    
    DOMHandler.write(() => {
        founderCard.innerHTML = `
            <div class="founder-img">
                <img src="${founder.imageUrl}" alt="${founder.fullName || founder.name}" loading="lazy">
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
    });
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
        DOMHandler.write(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        DOMHandler.write(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
};

function closeAllModals() {
    const modals = document.querySelectorAll('.demo-modal');
    DOMHandler.write(() => {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    });
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
    
    // Create document fragment to batch DOM operations
    const fragment = document.createDocumentFragment();
    
    // Create social links from config
    if (social.linkedin) {
        const link = document.createElement('a');
        link.href = social.linkedin;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = '<i class="fab fa-linkedin"></i>';
        link.title = 'LinkedIn';
        link.setAttribute('aria-label', 'LinkedIn');
        fragment.appendChild(link);
    }
    
    if (social.instagram) {
        const link = document.createElement('a');
        link.href = social.instagram;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = '<i class="fab fa-instagram"></i>';
        link.title = 'Instagram';
        link.setAttribute('aria-label', 'Instagram');
        fragment.appendChild(link);
    }
    
    if (social.github) {
        const link = document.createElement('a');
        link.href = social.github;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = '<i class="fab fa-github"></i>';
        link.title = 'GitHub';
        link.setAttribute('aria-label', 'GitHub');
        fragment.appendChild(link);
    }
    
    if (social.twitter) {
        const link = document.createElement('a');
        link.href = social.twitter;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = '<i class="fab fa-twitter"></i>';
        link.title = 'Twitter';
        link.setAttribute('aria-label', 'Twitter');
        fragment.appendChild(link);
    }
    
    // Single DOM write operation
    DOMHandler.write(() => {
        socialLinksContainer.innerHTML = '';
        socialLinksContainer.appendChild(fragment);
    });
    
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
    
    DOMHandler.write(() => {
        contactInfo.innerHTML = `
            <p><i class="fas fa-phone-alt"></i> <span>${company.phone}</span></p>
            <p><i class="fab fa-whatsapp"></i> <span>${company.whatsapp} (WhatsApp)</span></p>
            <p><i class="far fa-clock"></i> <span>${company.hours}</span></p>
            <a href="https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}" 
               target="_blank" class="chat-btn">
                <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>
        `;
    });
    
    const businessEmail = document.querySelector('.business-email');
    if (businessEmail) {
        DOMHandler.write(() => {
            businessEmail.innerHTML = `<i class="fas fa-envelope"></i> ${company.email}`;
            businessEmail.href = `mailto:${company.email}`;
        });
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
    
    DOMHandler.write(() => {
        whatsappFloat.href = `https://wa.me/${cleanWhatsapp}?text=${message}`;
    });
}

// ========== UPDATE FOOTER WITH COMPANY INFO ==========
function updateFooter() {
    const footer = document.querySelector('footer p');
    if (!footer || typeof SUSHITECH_CONFIG === 'undefined') return;
    
    const config = SUSHITECH_CONFIG;
    const year = new Date().getFullYear();
    
    DOMHandler.write(() => {
        footer.innerHTML = `© ${year} ${config.company.name}. All rights reserved.`;
    });
}

// ========== FORM SUBMISSION ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formStatus = document.getElementById('formStatus');
        if (formStatus) {
            DOMHandler.write(() => {
                formStatus.innerHTML = '<span style="color: #22D3EE; font-weight: 500;">✓ Message sent successfully! We\'ll contact you soon.</span>';
                formStatus.style.display = 'block';
            });
        }
        
        contactForm.reset();
        
        setTimeout(() => {
            if (formStatus) {
                DOMHandler.write(() => {
                    formStatus.style.display = 'none';
                });
            }
        }, 5000);
    });
}

// ========== SMOOTH SCROLL FOR NAVIGATION ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Use requestAnimationFrame for smooth scroll
            requestAnimationFrame(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });
});

// ========== INTERSECTION OBSERVER FOR ACTIVE NAVIGATION ==========
// Replaces scroll-based highlight with efficient IntersectionObserver
function initNavigationObserver() {
    const sections = document.querySelectorAll('section');
    const panelLinks = document.querySelectorAll('.panel-link');
    
    if (sections.length === 0 || panelLinks.length === 0) return;
    
    // Cache section IDs and their corresponding links
    const sectionMap = new Map();
    sections.forEach(section => {
        const id = section.getAttribute('id');
        const link = Array.from(panelLinks).find(link => link.getAttribute('href') === `#${id}`);
        if (link) {
            sectionMap.set(section, { id, link });
        }
    });
    
    // Intersection Observer options
    const options = {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '-50px 0px -50px 0px' // Adjust visible area
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const sectionData = sectionMap.get(section);
            
            if (!sectionData) return;
            
            const { link } = sectionData;
            
            // Batch DOM writes
            DOMHandler.write(() => {
                if (entry.isIntersecting) {
                    // Remove active class from all links
                    panelLinks.forEach(l => {
                        l.classList.remove('active');
                        l.style.borderLeftColor = 'transparent';
                        l.style.color = '#F8FAFC';
                    });
                    
                    // Add active class to current link
                    link.classList.add('active');
                    link.style.borderLeftColor = '#22D3EE';
                    link.style.color = '#22D3EE';
                }
            });
        });
    }, options);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    console.log('✅ Navigation observer initialized');
}

// ========== BACK TO TOP BUTTON ==========
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        // Use requestAnimationFrame for scroll handling
        requestAnimationFrame(() => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }, 100));
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// ========== HORIZONTAL SCROLL INDICATOR ==========
function initHorizontalScrollIndicator() {
    const demoGrid = document.getElementById('demoGrid');
    const dots = document.querySelectorAll('.dot');
    const scrollIndicator = document.querySelector('.scroll-indicator-horizontal');
    
    if (!demoGrid || dots.length === 0) return;
    
    // Cache DOM reads to avoid forced reflow
    let cardWidth = 300; // Default
    let gap = 25; // Default
    
    // Read dimensions once
    const firstCard = demoGrid.querySelector('.demo-card');
    if (firstCard) {
        DOMHandler.read(() => {
            cardWidth = firstCard.offsetWidth;
            gap = parseInt(window.getComputedStyle(demoGrid).gap) || 25;
        });
    }
    
    // Update dots on scroll - throttled and using requestAnimationFrame
    demoGrid.addEventListener('scroll', throttle(function() {
        requestAnimationFrame(() => {
            const scrollLeft = demoGrid.scrollLeft;
            const maxScroll = demoGrid.scrollWidth - demoGrid.clientWidth;
            const scrollPercentage = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
            
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
            if (demoGrid.scrollLeft + demoGrid.clientWidth >= demoGrid.scrollWidth - 10) {
                demoGrid.style.setProperty('--gradient-opacity', '0');
            } else {
                demoGrid.style.setProperty('--gradient-opacity', '1');
            }
        });
    }, 50));
    
    // Click on dots to scroll
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Use cached values or read fresh in a batch
            DOMHandler.read(() => {
                const currentCardWidth = demoGrid.querySelector('.demo-card')?.offsetWidth || cardWidth;
                const currentGap = parseInt(window.getComputedStyle(demoGrid).gap) || gap;
                const scrollTo = index * (currentCardWidth + currentGap);
                
                requestAnimationFrame(() => {
                    demoGrid.scrollTo({
                        left: scrollTo,
                        behavior: 'smooth'
                    });
                });
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
                    requestAnimationFrame(() => {
                        scrollIndicator.style.opacity = '0';
                        scrollIndicator.style.transition = 'opacity 0.5s ease';
                    });
                }, 2000);
            }
        }, { once: true }); // Use once option for efficiency
    }
}

// ========== CARD SCROLL HIGHLIGHT ANIMATION ==========
function initCardHighlight() {
    const cards = document.querySelectorAll('.card-scroll-highlight');
    
    if (cards.length === 0) return;
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Batch DOM operations
            requestAnimationFrame(() => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('card-visible');
                } else {
                    entry.target.classList.remove('card-visible');
                }
            });
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
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
            requestAnimationFrame(() => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('card-visible');
                } else {
                    const rect = entry.target.getBoundingClientRect();
                    const containerRect = demoGrid.getBoundingClientRect();
                    
                    if (rect.right > containerRect.left && rect.left < containerRect.right) {
                        entry.target.classList.add('card-visible');
                    } else {
                        entry.target.classList.remove('card-visible');
                    }
                }
            });
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
    
    // Initialize navigation observer (replaces scroll-based highlight)
    initNavigationObserver();
    
    // Initialize card highlight after content is populated
    setTimeout(() => {
        initCardHighlight();
        initHorizontalCardsObserver();
    }, 500);
    
    console.log('✅ SushTech website initialized with config data and new features');
    console.log('✅ Social links loaded from config:', SUSHITECH_CONFIG.social);
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
