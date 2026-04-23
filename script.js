// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.querySelector('i').classList.toggle('fa-bars');
        mobileMenu.querySelector('i').classList.toggle('fa-times');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileMenu) {
            mobileMenu.querySelector('i').classList.add('fa-bars');
            mobileMenu.querySelector('i').classList.remove('fa-times');
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
});

// Animate Skill Bars on Scroll
const skillBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (barPosition < screenPosition) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }
    });
}

window.addEventListener('scroll', animateSkillBars);

// Initialize skill bars with 0 width
window.addEventListener('load', () => {
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
});

// CONTACT FORM - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    emailjs.init("kX37tXhyL6sM_J_h6");
    
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    console.log('Contact form loaded successfully');
    
    // Create message element
    let formMessage = document.getElementById('form-message');
    if (!formMessage) {
        formMessage = document.createElement('div');
        formMessage.id = 'form-message';
        formMessage.style.marginTop = '15px';
        contactForm.appendChild(formMessage);
    }

    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        console.log('Form submitted');
        
        // Get form elements safely
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        
        // Check if elements exist
        if (!nameInput || !emailInput || !messageInput) {
            console.error('Form elements not found');
            showMessage('Form configuration error. Please refresh the page.', 'error');
            return;
        }
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        console.log('Form values:', { name, email, message });

        // Validation
        if (!name || !email || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Get submit button
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            console.log('Sending email...');
            
            // Prepare template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                message: message,
                reply_to: email,
                date: new Date().toLocaleString()
            };

            console.log('Template params:', templateParams);

            // Send email using EmailJS - using sendForm instead of send
            const response = await emailjs.send(
                'service_lfosvqw',    // Your EmailJS Service ID
                'template_2ymw2qe',    // Your EmailJS Template ID
                templateParams           // Pass the form element directly
            );

            console.log('Email sent successfully:', response);
            showMessage('✅ Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Email sending failed:', error);
            
            // More specific error handling
            if (error.status === 400) {
                showMessage('❌ Email configuration error. Please check your EmailJS setup.', 'error');
            } else if (error.text && error.text.includes('Invalid template')) {
                showMessage('❌ Email template not found. Please check your template ID.', 'error');
            } else if (error.text && error.text.includes('Invalid service')) {
                showMessage('❌ Email service not configured properly.', 'error');
            } else {
                showMessage('❌ Sorry, there was an error sending your message. Please try again later.', 'error');
            }
        } finally {
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    function showMessage(message, type) {
        const messageElement = document.getElementById('form-message');
        if (!messageElement) return;
        
        messageElement.textContent = message;
        messageElement.style.color = type === 'success' ? 'green' : 'red';
        messageElement.style.padding = '10px 15px';
        messageElement.style.borderRadius = '5px';
        messageElement.style.marginTop = '15px';
        messageElement.style.fontWeight = '500';
        messageElement.style.textAlign = 'center';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
            messageElement.style.border = '1px solid green';
        } else {
            messageElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            messageElement.style.border = '1px solid red';
        }

        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.style.backgroundColor = 'transparent';
                messageElement.style.border = 'none';
            }, 5000);
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});


// Test EmailJS configuration
function testEmailJS() {
    console.log('Testing EmailJS configuration...');
    
    // Test with simple data
    const testParams = {
        from_name: 'Test User',
        from_email: 'test@example.com',
        message: 'This is a test message from your portfolio',
        date: new Date().toLocaleString()
    };
    
    emailjs.send('service_6aoe4m6', 'template_2ymw2q', testParams)
        .then(function(response) {
            console.log('✅ EmailJS Test SUCCESS:', response);
            alert('EmailJS is working correctly!');
        })
        .catch(function(error) {
            console.error('❌ EmailJS Test FAILED:', error);
            alert('EmailJS configuration error: ' + error.text);
        });
}

// Run this in browser console to test
// testEmailJS();