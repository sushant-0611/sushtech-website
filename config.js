// config.js - All SushTech configuration data
const SUSHITECH_CONFIG = {
    // Company Information
    company: {
        name: "SushTech",
        founder: "Sushant Kakade",
        email: "contact@sushtech.in",
        phone: "+91 9021496257",
        whatsapp: "+91 9021496257",
        hours: "Mon - Sat, 10:00 - 19:00",
        address: "Pune, Maharashtra, India",
        founded: "2025",
        founderAge: "21"
    },

    // Pricing Plans - Premium Packages
    pricing: {
        starter: {
            name: "Starter Kit",
            price: "₹6,999",
            priceSuffix: "onwards",
            features: [
                "Up to 5 Pages Website",
                "Mobile Responsive Design",
                "WhatsApp Chat Integration",    
                "Basic SEO Setup",
                "1 Month Free Support"
            ],
            note: "Perfect for startups & small businesses",
            badge: "🌱", // Plant icon for starter
            badgeColor: "#22D3EE", // Cyan
            popular: false
        },

        premium: {
            name: "Premium Plus",
            price: "₹14,999",
            priceSuffix: "onwards",
            features: [
                "Up to 10 Pages Website",
                "Custom UI/UX Design",
                "Advanced Animations",
                "Photo/Video Gallery",
                "SEO Optimization",
                "Google Maps Integration",
                "Blog/News Section",
                "3 Months Priority Support"
            ],
            note: "Most Popular - Best for growing businesses",
            badge: "⭐", // Star for premium
            badgeColor: "#F59E0B", // Gold/Amber
            popular: true
        },

        enterprise: {
            name: "Enterprise Pro",
            price: "₹29,999",
            priceSuffix: "+",
            features: [
                "Unlimited Pages",
                "Custom Admin Dashboard",
                "Product Management System",
                "Payment Gateway Integration",
                "User Login/Signup System",
                "Database Management",
                "Advanced Security",
                "6 Months Premium Support",
                "Free SSL Certificate"
            ],
            note: "For e-commerce & large businesses",
            badge: "👑", // Crown for enterprise
            badgeColor: "#8B5CF6", // Purple
            popular: false
        }
    },

    // Features for Why Choose Us section
    features: [
        {
            icon: "fa-rocket",
            title: "Fast Delivery",
            description: "Get your website live in 5-7 days. We value your time."
        },
        {
            icon: "fa-tag",
            title: "Affordable Pricing",
            description: "Premium quality at budget-friendly prices. No hidden costs."
        },
        {
            icon: "fa-shield-alt",
            title: "Secure & Safe",
            description: "Free SSL certificates and daily backups for peace of mind."
        },
        {
            icon: "fa-headset",
            title: "24/7 Support",
            description: "We're always here to help you with any questions."
        }
    ],

    //Demo links
    // Wedding Demo Links
    weddingDemos: {
        wedding1: "https://sushant-0611.github.io/sushtech-website/wedding-demo/Template_1.html",  // Traditional
        wedding2: "https://sushant-0611.github.io/sushtech-website/wedding-demo/Template_2.html",  // Modern
        wedding3: "https://sushant-0611.github.io/sushtech-website/wedding-demo/Template_3.html",  // Garden
        wedding4: "https://sushant-0611.github.io/sushtech-website/wedding-demo/Template_4.html"   // Premium
    },
    
    // Business Demo Links
    businessDemos: {
        business1: "https://your-business-demo1.com", // Startup
        business2: "https://your-business-demo2.com", // Corporate
        business3: "https://your-business-demo3.com", // Portfolio
        business4: "https://your-business-demo4.com"  // Restaurant
    },
    
    // E-Commerce Demo Links
    ecommerceDemos: {
        ecommerce1: "https://your-ecommerce-demo1.com", // Fashion
        ecommerce2: "https://your-ecommerce-demo2.com", // Electronics
        ecommerce3: "https://your-ecommerce-demo3.com", // Furniture
        ecommerce4: "https://your-ecommerce-demo4.com"  // Jewelry
    },
    
    // Social Links
    social: {
        github: "https://github.com/sushant-0611",
        linkedin: "https://www.linkedin.com/in/sushant-kakade",
        instagram: "https://instagram.com/sushtech",
        twitter: "https://twitter.com/sushtech"
    },

    // SEO Defaults
    seo: {
    title: "SushTech | Website Developer in Pune | Web Design, SEO & E-Commerce Solutions",
    description: "SushTech provides affordable website development, SEO optimization, business websites, wedding websites and e-commerce solutions in Pune, India. Grow your business online with fast, secure and modern digital solutions.",
    keywords: "website developer in Pune, web design Pune, affordable website India, SEO services Pune, e-commerce website developer India, business website design, startup website development, wedding invitation website, digital agency Pune, SushTech India",
    author: "Sushant Kakade",
    robots: "index, follow",
    language: "English",
    revisitAfter: "7 days",
    ogTitle: "SushTech - Professional Website & Digital Solutions",
    ogDescription: "We build fast, secure and affordable websites for startups, businesses and e-commerce brands in Pune & across India.",
    ogType: "website"
}

};
