document.addEventListener('DOMContentLoaded', () => {
    
    // --- STICKY HEADER ---
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially on load
    
    // --- MOBILE MENU ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navList.classList.toggle('active');
            
            // Toggle scroll lock on body
            if (navList.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve if we only want it to animate once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // --- CARD GLOW MOUSE TRACKING ---
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside the card
            const y = e.clientY - rect.top;  // y position inside the card
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- CERTIFICATION MODAL LOGIC ---
    const certCards = document.querySelectorAll('.certification-card');
    const certModal = document.getElementById('cert-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOverlay = certModal ? certModal.querySelector('.modal-overlay') : null;
    const modalContentArea = document.getElementById('modal-content-area');
    
    if (certCards.length > 0 && certModal && modalContentArea) {
        
        const openModal = (card) => {
            const title = card.getAttribute('data-title') || '';
            const institution = card.getAttribute('data-institution') || '';
            const year = card.getAttribute('data-year') || '';
            const hours = card.getAttribute('data-hours') || '';
            const instructor = card.getAttribute('data-instructor') || '';
            const desc = card.getAttribute('data-desc') || '';
            const image = card.getAttribute('data-image') || '';
            
            const competenciesRaw = card.getAttribute('data-competencies') || '';
            const competencies = competenciesRaw ? competenciesRaw.split(';') : [];
            
            let competenciesHtml = '';
            if (competencies.length > 0) {
                competenciesHtml = `
                    <div class="modal-section">
                        <h4 class="modal-desc-title">Principais competências desenvolvidas:</h4>
                        <ul class="modal-skills-list">
                            ${competencies.map(comp => `<li>${comp.trim()}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
            
            const instructorHtml = instructor ? `<span>&bull; Instrutor(a): ${instructor}</span>` : '';
            
            modalContentArea.innerHTML = `
                <div class="modal-grid">
                    <div class="modal-left">
                        <div class="modal-img-container">
                            <img src="${image}" alt="Certificado ${title}">
                        </div>
                    </div>
                    <div class="modal-right">
                        <div class="modal-badge-group">
                            <span class="modal-institution">${institution}</span>
                            <div class="modal-meta-row">
                                <span>Conclusão: ${year}</span>
                                <span>&bull; Carga horária: ${hours}</span>
                                ${instructorHtml}
                            </div>
                        </div>
                        <h3 class="modal-title">${title}</h3>
                        <div class="modal-section">
                            <h4 class="modal-desc-title">Descrição completa:</h4>
                            <p class="modal-desc-text">${desc}</p>
                        </div>
                        ${competenciesHtml}
                    </div>
                </div>
            `;
            
            certModal.classList.add('active');
            certModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        
        const closeModal = () => {
            certModal.classList.remove('active');
            certModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };
        
        certCards.forEach(card => {
            card.addEventListener('click', () => openModal(card));
        });
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
