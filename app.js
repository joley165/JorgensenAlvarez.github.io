/* ==========================================================================
   PORTFOLIO WEB PREMIUM - LÓGICA DE INTERACTIVIDAD (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. CANVAS DE PARTÍCULAS INTERACTIVAS (Fondo Dinámico)
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 55;

        // Mouse interaction state
        const mouse = {
            x: null,
            y: null,
            radius: 130
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Resize Canvas to fit screen
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle Class definition
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.6;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                // Soft blue and cyan HSL matching the new theme
                this.color = Math.random() > 0.5 ? 'rgba(30, 88, 164, 0.3)' : 'rgba(72, 202, 228, 0.3)';
            }

            update() {
                // Mouse pull effect
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx*dx + dy*dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        this.x += (dx / distance) * force * 0.9;
                        this.y += (dy / distance) * force * 0.9;
                    }
                }

                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // Connect nearby particles with thin blue lines
        function drawLines() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx*dx + dy*dy);

                    if (distance < 110) {
                        let opacity = (110 - distance) / 110 * 0.15;
                        ctx.strokeStyle = `rgba(30, 88, 164, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Initialize particles
        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        init();

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            drawLines();
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* --------------------------------------------------------------------------
       2. EFECTO DE SCROLL EN CABECERA (Header Solid/Transparent)
       -------------------------------------------------------------------------- */
    const header = document.getElementById('main-header');
    
    function checkHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Check immediately on load

    /* --------------------------------------------------------------------------
       3. MENÚ MÓVIL DESPLEGABLE (Mobile Drawer Menu)
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        // Toggle Active States
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* --------------------------------------------------------------------------
       4. SCROLLSPY (Resaltado del enlace del menú según el scroll actual)
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section');
    
    function scrollSpy() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Offset for better timing detection

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', scrollSpy);

    /* --------------------------------------------------------------------------
       5. SIMULADOR DE APLICACIONES MÓVILES INTERACTIVO
       -------------------------------------------------------------------------- */
    const appOptions = document.querySelectorAll('.app-option');
    const phoneScreenImg = document.getElementById('phone-screen-img');
    const phoneGlow = document.querySelector('.phone-glow');

    // Mapping apps to asset paths and glowing box-shadow colors
    const appData = {
        draco: {
            img: 'assets/draco.jpg',
            glowColor: 'radial-gradient(circle, hsla(270, 100%, 65%, 0.25) 0%, transparent 70%)'
        },
        fitness: {
            img: 'assets/fitness.jpg',
            glowColor: 'radial-gradient(circle, hsla(340, 100%, 60%, 0.25) 0%, transparent 70%)'
        },
        smarthome: {
            img: 'assets/smart_home.jpg',
            glowColor: 'radial-gradient(circle, hsla(180, 100%, 48%, 0.25) 0%, transparent 70%)'
        }
    };

    appOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active classes from all options
            appOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Get selected app ID
            const appId = option.getAttribute('data-app');
            const selectedApp = appData[appId];

            if (selectedApp && phoneScreenImg) {
                // Crossfade animation by fading out first
                phoneScreenImg.style.opacity = '0';
                phoneScreenImg.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    // Update Image Source
                    phoneScreenImg.src = selectedApp.img;
                    phoneScreenImg.alt = `Simulador de App - ${option.querySelector('h3').innerText}`;
                    
                    // Fade in new screen
                    phoneScreenImg.style.opacity = '1';
                    phoneScreenImg.style.transform = 'scale(1)';
                    
                    // Update backglow shadow color matches app theme color
                    if (phoneGlow) {
                        phoneGlow.style.background = selectedApp.glowColor;
                    }
                }, 200);
            }
        });
    });

    /* --------------------------------------------------------------------------
       6. FORMULARIO DE CONTACTO PREMUM E INTERACTIVO
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('portfolio-contact-form');
    const formSpinner = document.getElementById('form-spinner');
    const formSubmitBtn = document.getElementById('btn-submit-form');
    const successBanner = document.getElementById('form-success-banner');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset validation states
            let isValid = true;
            const groups = contactForm.querySelectorAll('.form-group');
            groups.forEach(g => g.classList.remove('error'));

            // Name validation
            const nameInput = document.getElementById('form-name');
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Email validation
            const emailInput = document.getElementById('form-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Message validation
            const msgInput = document.getElementById('form-message');
            if (!msgInput.value.trim()) {
                msgInput.parentElement.classList.add('error');
                isValid = false;
            }

            // If form is valid, simulate network request
            if (isValid) {
                // Disable button and show spinner
                formSubmitBtn.disabled = true;
                if (formSpinner) formSpinner.style.display = 'inline-block';
                const submitText = formSubmitBtn.querySelector('.btn-text');
                if (submitText) submitText.innerText = 'Enviando...';

                // Simulate API POST request
                setTimeout(() => {
                    // Hide spinner
                    if (formSpinner) formSpinner.style.display = 'none';
                    if (submitText) submitText.innerText = 'Enviar Mensaje';
                    
                    // Show success banner state
                    if (successBanner) {
                        successBanner.classList.add('active');
                    }
                    
                    // Reset form fields
                    contactForm.reset();
                    formSubmitBtn.disabled = false;

                    // Automatically hide success banner after 6 seconds
                    setTimeout(() => {
                        if (successBanner) successBanner.classList.remove('active');
                    }, 6000);

                }, 1500);
            }
        });
    }

    /* --------------------------------------------------------------------------
       7. INDICADOR DE PROGRESO DE SCROLL (Scroll Progress Bar)
       -------------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    /* --------------------------------------------------------------------------
       8. ANIMACIÓN REVEAL ON SCROLL (Intersection Observer)
       -------------------------------------------------------------------------- */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    }
});
