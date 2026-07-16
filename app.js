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
    const phoneGlow = document.querySelector('.phone-glow');
    const appMockScreens = document.querySelectorAll('.app-mock-screen');

    // Mapping apps to glowing box-shadow colors
    const appData = {
        draco: {
            glowColor: 'radial-gradient(circle, hsla(270, 100%, 65%, 0.25) 0%, transparent 70%)'
        },
        fitness: {
            glowColor: 'radial-gradient(circle, hsla(340, 100%, 60%, 0.25) 0%, transparent 70%)'
        },
        smarthome: {
            glowColor: 'radial-gradient(circle, hsla(180, 100%, 48%, 0.25) 0%, transparent 70%)'
        },
        store: {
            glowColor: 'radial-gradient(circle, hsla(150, 100%, 48%, 0.25) 0%, transparent 70%)'
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

            // Hide all screen contents
            appMockScreens.forEach(screen => {
                screen.classList.remove('active');
            });

            // Show active screen content with scale animation
            const activeScreen = document.getElementById(`screen-${appId}`);
            if (activeScreen) {
                activeScreen.classList.add('active');
            }
            
            // Update backglow shadow color matches app theme color
            if (selectedApp && phoneGlow) {
                phoneGlow.style.background = selectedApp.glowColor;
            }
        });
    });

    // 5b. INTERACTION LOGIC FOR PHONE MOCK SCREENS
    // Draco Chat screen functions
    window.openMockChat = function(type) {
        const chatView = document.getElementById('draco-chat-view');
        const chatTitle = document.getElementById('chat-title');
        const msgContainer = document.getElementById('chat-messages-container');
        
        chatView.style.display = 'flex';
        msgContainer.innerHTML = '';
        
        if (type === 'bot') {
            chatTitle.innerText = "Draco Assistant 🤖";
            msgContainer.innerHTML = `
                <div class="chat-msg received">¡Hola! Soy el asistente virtual de Draco. ¿Deseas ver una simulación de entrega con mapa o hacer una pregunta?</div>
            `;
        } else {
            chatTitle.innerText = "Pizzería Plaza 🍕";
            msgContainer.innerHTML = `
                <div class="chat-msg received">Hola Jorgensen, tu pedido de Pizza Familiar ya fue preparado y está en camino con el motorizado.</div>
            `;
        }
    };

    window.closeMockChat = function() {
        document.getElementById('draco-chat-view').style.display = 'none';
    };

    window.sendQuickReply = function(id) {
        const msgContainer = document.getElementById('chat-messages-container');
        if (id === 1) {
            msgContainer.innerHTML += `
                <div class="chat-msg sent">¿Dónde está mi pedido?</div>
                <div class="chat-msg received">El motorizado se encuentra en Av. Larco 410, estimamos la entrega en 3 minutos. 🗺️</div>
            `;
        } else {
            msgContainer.innerHTML += `
                <div class="chat-msg sent">Ver Mapa 🗺️</div>
                <div class="chat-msg received">
                    <div class="mock-map">
                        <div class="mock-map-marker">📍</div>
                    </div>
                </div>
            `;
        }
        msgContainer.scrollTop = msgContainer.scrollHeight;
    };

    // Fitness Timer state
    let workoutInterval = null;
    let kcalVal = 340;
    let stepsVal = 6420;
    window.toggleWorkoutTimer = function() {
        const btn = document.getElementById('btn-start-workout');
        const kcalEl = document.getElementById('kcal-val');
        const stepsEl = document.getElementById('steps-val');
        
        if (workoutInterval) {
            clearInterval(workoutInterval);
            workoutInterval = null;
            btn.innerText = "Iniciar Cardio";
            btn.style.background = "var(--grad-primary)";
        } else {
            btn.innerText = "Detener Cardio";
            btn.style.background = "#d90429";
            workoutInterval = setInterval(() => {
                kcalVal += 1;
                stepsVal += Math.floor(Math.random() * 4) + 1;
                kcalEl.innerText = kcalVal;
                stepsEl.innerText = stepsVal.toLocaleString();
            }, 1000);
        }
    };

    // Smart Home state
    let currentTemp = 22;
    window.changeAC = function(val) {
        currentTemp += val;
        if (currentTemp < 16) currentTemp = 16;
        if (currentTemp > 30) currentTemp = 30;
        document.getElementById('temp-val').innerText = currentTemp;
    };

    window.toggleSwitch = function(name) {
        const card = document.getElementById(`sw-${name}`);
        const status = card.querySelector('.sw-status');
        if (status.classList.contains('on')) {
            status.classList.remove('on');
            status.classList.add('off');
            status.innerText = "OFF";
            if (name === 'light') {
                card.style.background = "hsla(215, 10%, 8%, 0.6)";
            }
        } else {
            status.classList.remove('off');
            status.classList.add('on');
            status.innerText = "ON";
            if (name === 'light') {
                card.style.background = "hsla(50, 100%, 50%, 0.12)";
            }
        }
    };

    // Vibe Store Cart State
    let mockCart = [];
    window.addToMockCart = function(name, price) {
        mockCart.push({ name, price });
        document.getElementById('cart-count').innerText = mockCart.length;
        
        const badge = document.querySelector('.mock-cart-badge');
        badge.classList.add('bounce');
        setTimeout(() => badge.classList.remove('bounce'), 300);
        
        updateCartPopup();
    };

    window.toggleCartPopup = function() {
        const popup = document.getElementById('mock-cart-popup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    };

    function updateCartPopup() {
        const list = document.getElementById('cart-items-list');
        const totalVal = document.getElementById('cart-total-val');
        
        if (mockCart.length === 0) {
            list.innerHTML = `<p class="empty-cart-text">El carrito está vacío.</p>`;
            totalVal.innerText = `$0 USD`;
        } else {
            list.innerHTML = mockCart.map(item => `
                <div class="mock-cart-item">
                    <span>${item.name}</span>
                    <strong>$${item.price} USD</strong>
                </div>
            `).join('');
            
            const total = mockCart.reduce((sum, item) => sum + item.price, 0);
            totalVal.innerText = `$${total} USD`;
        }
    }

    window.filterStore = function(category) {
        const pills = document.querySelectorAll('.cat-pill');
        pills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.innerText.toLowerCase() === category || (category === 'all' && pill.innerText.toLowerCase() === 'todos')) {
                pill.classList.add('active');
            }
        });
        
        const products = document.querySelectorAll('.prod-card');
        products.forEach(prod => {
            if (category === 'all' || prod.getAttribute('data-cat') === category) {
                prod.style.display = 'flex';
            } else {
                prod.style.display = 'none';
            }
        });
    };

    window.mockCheckout = function() {
        if (mockCart.length === 0) {
            alert('¡Agrega productos al carrito primero!');
            return;
        }
        alert('🛍️ ¡Pedido de Tienda Recibido! Tu compra de zapatillas/ropa ha sido simulada exitosamente.');
        mockCart = [];
        document.getElementById('cart-count').innerText = 0;
        updateCartPopup();
        window.toggleCartPopup();
    };

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

    /* --------------------------------------------------------------------------
       9. COTIZADOR DE PROYECTOS INTERACTIVO
       -------------------------------------------------------------------------- */
    const screensRange = document.getElementById('screens-range');
    const screensVal = document.getElementById('screens-val');
    const totalPriceEl = document.getElementById('total-price');
    const deliveryTimeEl = document.getElementById('delivery-time');
    const platformSelectedEl = document.getElementById('platform-selected');
    const featuresSelectedEl = document.getElementById('features-selected');
    const btnCalcWhatsapp = document.getElementById('btn-calc-whatsapp');

    function calculateProject() {
        if (!screensRange) return;

        // 1. Base prices & weeks by platform (minimum price starts at $3000)
        const platformValue = document.querySelector('input[name="platform"]:checked').value;
        let basePrice = 0;
        let baseWeeks = 0;
        let platformLabel = "";

        if (platformValue === 'android') {
            basePrice = 3000;
            baseWeeks = 3;
            platformLabel = "Android Nativo";
        } else if (platformValue === 'ios') {
            basePrice = 3000;
            baseWeeks = 3;
            platformLabel = "iOS Nativo";
        } else {
            basePrice = 4500;
            baseWeeks = 4;
            platformLabel = "React Native (iOS & Android)";
        }

        // 2. Screens calculation (minimum 3 screens is $0 add-on, each additional adds $150 and 1.5 days)
        const screens = parseInt(screensRange.value);
        screensVal.innerText = `${screens} pantallas`;
        
        const screensPrice = (screens - 3) * 150;
        const screensWeeks = Math.ceil((screens - 3) * 0.25); 

        // 3. Features calculation
        let featuresPrice = 0;
        let featuresWeeks = 0;
        let selectedFeaturesList = [];

        const checkboxes = document.querySelectorAll('.feature-checkbox');
        checkboxes.forEach(cb => {
            if (cb.checked) {
                if (cb.value === 'maps') {
                    featuresPrice += 500;
                    featuresWeeks += 1;
                    selectedFeaturesList.push("Mapas/Geolocalización");
                } else if (cb.value === 'chat') {
                    featuresPrice += 600;
                    featuresWeeks += 1;
                    selectedFeaturesList.push("Chat en vivo");
                } else if (cb.value === 'auth') {
                    featuresPrice += 400;
                    featuresWeeks += 0.5;
                    selectedFeaturesList.push("Autenticación");
                } else if (cb.value === 'push') {
                    featuresPrice += 300;
                    featuresWeeks += 0.5;
                    selectedFeaturesList.push("Notificaciones Push");
                } else if (cb.value === 'dashboard') {
                    featuresPrice += 800;
                    featuresWeeks += 1.5;
                    selectedFeaturesList.push("Panel de Admin");
                } else if (cb.value === 'videocalls') {
                    featuresPrice += 1200;
                    featuresWeeks += 2;
                    selectedFeaturesList.push("Videollamadas (HD)");
                } else if (cb.value === 'calls') {
                    featuresPrice += 800;
                    featuresWeeks += 1.5;
                    selectedFeaturesList.push("Llamadas de Voz");
                } else if (cb.value === 'streaming') {
                    featuresPrice += 1500;
                    featuresWeeks += 2.5;
                    selectedFeaturesList.push("Transmisiones en Vivo");
                } else if (cb.value === 'ai') {
                    featuresPrice += 2000;
                    featuresWeeks += 3;
                    selectedFeaturesList.push("Agentes de IA");
                }
            }
        });

        // 4. Summarize calculations
        const totalPrice = basePrice + screensPrice + featuresPrice;
        const totalWeeks = baseWeeks + screensWeeks + Math.ceil(featuresWeeks);

        // 5. Update UI
        totalPriceEl.innerText = `$${totalPrice} USD`;
        deliveryTimeEl.innerText = `${totalWeeks} semanas`;
        platformSelectedEl.innerText = platformLabel;
        featuresSelectedEl.innerText = selectedFeaturesList.length > 0 ? selectedFeaturesList.join(', ') : 'Ninguna';

        // 6. Format WhatsApp Message Link
        const whatsAppPhone = "51925074274";
        const featuresText = selectedFeaturesList.length > 0 ? selectedFeaturesList.join(', ') : 'Ninguna';
        const messageText = `Hola Jorgensen! Coticé una aplicación en tu portafolio web:\n\n` +
                            `- *Plataforma:* ${platformLabel}\n` +
                            `- *Pantallas:* ${screens}\n` +
                            `- *Funcionalidades:* ${featuresText}\n\n` +
                            `*Presupuesto Estimado:* $${totalPrice} USD\n` +
                            `*Tiempo Estimado:* ${totalWeeks} semanas\n\n` +
                            `Me gustaría agendar una reunión para discutir los detalles de mi proyecto.`;
        
        btnCalcWhatsapp.href = `https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(messageText)}`;
    }

    // Attach event listeners to all calculator inputs
    if (screensRange) {
        screensRange.addEventListener('input', calculateProject);
        
        const platformRadios = document.querySelectorAll('input[name="platform"]');
        platformRadios.forEach(radio => radio.addEventListener('change', calculateProject));

        const featureCheckboxes = document.querySelectorAll('.feature-checkbox');
        featureCheckboxes.forEach(cb => cb.addEventListener('change', calculateProject));

        // Run initial calculation on load
        calculateProject();
    }

    /* --------------------------------------------------------------------------
       10. EFECTO DE INCLINACIÓN 3D EN TARJETAS (Tilt Hover Effect)
       -------------------------------------------------------------------------- */
    const tiltElements = document.querySelectorAll('.hero-profile-card, .service-card');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const angleX = (yc - y) / 14; 
            const angleY = (x - xc) / 14;
            el.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
});
