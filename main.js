/* ==========================================================================
   Main Application Script - Bhavya Rose Augustin Portfolio
   Handles Navigation, Scroll Events, Skill Filtering, Form Handling, & Modals.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initSkillFilters();
    initContactForm();
});

// --------------------------------------------------------------------------
// 1. Navigation & Mobile Menu Toggle
// --------------------------------------------------------------------------
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }
}

// --------------------------------------------------------------------------
// 2. Scroll Effects (Navbar Shadow, Active Section Link, Back-To-Top)
// --------------------------------------------------------------------------
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky navbar background
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back-to-top button
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Active Section Highlight
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// --------------------------------------------------------------------------
// 3. Skill Filters Logic
// --------------------------------------------------------------------------
function initSkillFilters() {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// --------------------------------------------------------------------------
// 4. Email Copy Utility
// --------------------------------------------------------------------------
function copyEmail() {
    const emailText = document.getElementById('email-address').textContent;
    const copyIcon = document.getElementById('copy-icon');

    navigator.clipboard.writeText(emailText).then(() => {
        if (copyIcon) {
            copyIcon.className = 'fa-solid fa-check';
            setTimeout(() => {
                copyIcon.className = 'fa-regular fa-copy';
            }, 2000);
        }
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// --------------------------------------------------------------------------
// 5. Contact Form Submission Handler
// --------------------------------------------------------------------------
function initContactForm() {
    // Form submission logic is tied to handleFormSubmit(event)
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const toast = document.getElementById('form-toast');

    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;

    if (!name || !email || !message) {
        showToast('Please fill out all required fields.', 'error');
        return;
    }

    // Button loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

    // Simulate smooth API response
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-regular fa-paper-plane"></i> Send Message`;
        showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        form.reset();
    }, 1200);
}

function showToast(message, type) {
    const toast = document.getElementById('form-toast');
    if (toast) {
        toast.className = `form-toast ${type}`;
        toast.textContent = message;
        setTimeout(() => {
            toast.className = 'form-toast';
        }, 4000);
    }
}

// --------------------------------------------------------------------------
// 6. Interactive Add Certification Helper Modal
// --------------------------------------------------------------------------
function openAddCertModal() {
    const modal = document.getElementById('add-cert-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAddCertModal() {
    const modal = document.getElementById('add-cert-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function handleAddCertSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('cert-title').value;
    const issuer = document.getElementById('cert-issuer').value;
    const date = document.getElementById('cert-date').value;
    const desc = document.getElementById('cert-desc').value || 'Certification / workshop achievement.';

    if (!title || !issuer || !date) return;

    const certGrid = document.getElementById('cert-grid');
    if (certGrid) {
        const certCard = document.createElement('div');
        certCard.className = 'cert-card';
        certCard.innerHTML = `
            <div class="cert-badge-icon pink-icon">
                <i class="fa-solid fa-certificate"></i>
            </div>
            <div class="cert-details">
                <span class="cert-date"><i class="fa-regular fa-calendar-check"></i> ${escapeHTML(date)}</span>
                <h3>${escapeHTML(title)}</h3>
                <p class="cert-issuer">${escapeHTML(issuer)}</p>
                <p class="cert-summary">${escapeHTML(desc)}</p>
            </div>
        `;
        certGrid.appendChild(certCard);
    }

    closeAddCertModal();
    document.getElementById('add-cert-form').reset();
}
