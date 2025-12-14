document.addEventListener('DOMContentLoaded', function() {
    console.log('Tik Tak Top Course Script Loaded');
    
    // ==================== GOOGLE SHEETS CONFIG ====================
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQWiNQqjwir06dK5d26yZoRRS3hJ4KnpgMSZrdU7LOiNx-eyD_7RX-AajutaWW1k4x/exec";
    
    // ==================== MOBILE MENU TOGGLE ====================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                hamburger.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
    
    // ==================== COURSE SELECTION NOTIFICATION ====================
    const courseNotification = document.getElementById('courseNotification');
    const closeNotification = document.getElementById('closeNotification');
    
    if (courseNotification && closeNotification) {
        let notificationShown = sessionStorage.getItem('notificationShown');
        
        if (!notificationShown) {
            setTimeout(() => {
                courseNotification.style.display = 'block';
                courseNotification.setAttribute('aria-hidden', 'false');
                sessionStorage.setItem('notificationShown', 'true');
            }, 3000);
        }
        
        closeNotification.addEventListener('click', () => {
            courseNotification.style.display = 'none';
            courseNotification.setAttribute('aria-hidden', 'true');
        });
        
        courseNotification.addEventListener('click', (e) => {
            if (e.target === courseNotification) {
                courseNotification.style.display = 'none';
                courseNotification.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    // ==================== COURSE TAGS SELECTION ====================
    document.querySelectorAll('.course-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const course = this.getAttribute('data-course');
            
            // Highlight selected tag
            document.querySelectorAll('.course-tag').forEach(t => {
                t.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Scroll to registration section
            setTimeout(() => {
                const registerSection = document.getElementById('register');
                if (registerSection) {
                    registerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        });
    });
    
    // ==================== KELAS BUTTON SELECTION ====================
    document.querySelectorAll('.course-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseName = this.getAttribute('data-course-name');
            const coursePrice = this.getAttribute('data-price');
            
            // Auto-fill program in registration form
            const programSelect = document.getElementById('anggotaProgram');
            if (programSelect) {
                for (let option of programSelect.options) {
                    if (option.text.includes(courseName)) {
                        option.selected = true;
                        break;
                    }
                }
            }
            
            // Show confirmation
            showResponseMessage(
                `🎉 Kelas <strong>"${courseName}"</strong> telah dipilih!<br>
                Harga: <strong>${coursePrice}</strong><br>
                Silakan lanjutkan pendaftaran di bawah.`,
                'success'
            );
            
            // Scroll to registration form
            setTimeout(() => {
                const registerSection = document.getElementById('register');
                if (registerSection) {
                    registerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        });
    });
    
    // ==================== FORM PENDAFTARAN ANGGOTA ====================
    const registrationForm = document.getElementById('registrationForm');
    const responseMessage = document.getElementById('responseMessage');
    
    function showResponseMessage(message, type) {
        if (responseMessage) {
            responseMessage.innerHTML = message;
            responseMessage.className = `response-message ${type}`;
            responseMessage.style.display = 'block';
            responseMessage.setAttribute('role', 'alert');
            
            // Auto hide after 7 seconds
            setTimeout(() => {
                if (responseMessage.style.display === 'block') {
                    responseMessage.style.display = 'none';
                }
            }, 7000);
        }
    }
    
    // Validasi NIK
    function validateNIK(nik) {
        const cleanNIK = nik.replace(/\D/g, '');
        
        if (cleanNIK.length === 0) {
            return { valid: false, message: 'NIK tidak boleh kosong' };
        }
        
        if (cleanNIK.length < 5) {
            return { valid: false, message: 'Nomor induk siswa minimal 5 digit' };
        }
        
        if (cleanNIK.length === 16 && !/^\d+$/.test(cleanNIK)) {
            return { valid: false, message: 'NIK harus 16 digit angka' };
        }
        
        return { valid: true, nik: cleanNIK };
    }
    
    // Validasi Nomor WhatsApp
    function validateWhatsApp(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (cleanPhone.length === 0) {
            return { valid: false, message: 'Nomor WhatsApp tidak boleh kosong' };
        }
        
        if (cleanPhone.length < 10 || cleanPhone.length > 14) {
            return { valid: false, message: 'Nomor WhatsApp harus 10-14 digit' };
        }
        
        return { valid: true, phone: cleanPhone };
    }
    
    // Format nomor untuk WhatsApp
    function formatPhoneNumber(phone) {
        const clean = phone.replace(/\D/g, '');
        if (clean.startsWith('0')) return '62' + clean.substring(1);
        if (clean.startsWith('62')) return clean;
        if (clean.startsWith('8')) return '62' + clean;
        return clean;
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous errors
            document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
                el.classList.remove('error');
            });
            
            // Get form values
            const formData = new FormData(this);
            const data = {
                nama: formData.get('anggotaNama'),
                program: formData.get('anggotaProgram'),
                nik: formData.get('anggotaNIK'),
                alamat: formData.get('anggotaAlamat'),
                whatsapp: formData.get('anggotaWhatsApp'),
                terms: document.getElementById('anggotaTerms')?.checked || false
            };
            
            // Validate form
            const errors = [];
            
            if (!data.nama?.trim()) {
                errors.push('Nama lengkap harus diisi');
                document.getElementById('anggotaNama').classList.add('error');
            } else if (data.nama.length < 3) {
                errors.push('Nama minimal 3 karakter');
                document.getElementById('anggotaNama').classList.add('error');
            }
            
            if (!data.program) {
                errors.push('Program kelas harus dipilih');
                document.getElementById('anggotaProgram').classList.add('error');
            }
            
            const nikValidation = validateNIK(data.nik);
            if (!nikValidation.valid) {
                errors.push(nikValidation.message);
                document.getElementById('anggotaNIK').classList.add('error');
            }
            
            if (!data.alamat?.trim()) {
                errors.push('Alamat lengkap harus diisi');
                document.getElementById('anggotaAlamat').classList.add('error');
            } else if (data.alamat.length < 10) {
                errors.push('Alamat terlalu pendek, minimal 10 karakter');
                document.getElementById('anggotaAlamat').classList.add('error');
            }
            
            const phoneValidation = validateWhatsApp(data.whatsapp);
            if (!phoneValidation.valid) {
                errors.push(phoneValidation.message);
                document.getElementById('anggotaWhatsApp').classList.add('error');
            }
            
            if (!data.terms) {
                errors.push('Anda harus menyetujui syarat dan ketentuan');
            }
            
            if (errors.length > 0) {
                showResponseMessage(
                    `<strong>Perbaiki data berikut:</strong><br>• ${errors.join('<br>• ')}`,
                    'error'
                );
                
                // Scroll to first error
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim ke Google Sheets...';
                submitBtn.disabled = true;
                
                // Prepare data for Google Sheets
                const programText = document.getElementById('anggotaProgram').options[document.getElementById('anggotaProgram').selectedIndex].text;
                const submissionData = {
                    nama: data.nama.trim(),
                    program: programText,
                    nik: nikValidation.nik,
                    alamat: data.alamat.trim(),
                    whatsapp: formatPhoneNumber(phoneValidation.phone)
                };
                
                console.log('📤 Sending to Google Sheets:', submissionData);
                
                try {
                    // Send to Google Sheets via Apps Script
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(submissionData)
                    });
                    
                    console.log('📥 Response status:', response.status);
                    
                    let result;
                    try {
                        result = await response.json();
                    } catch {
                        result = { success: true }; // Jika response bukan JSON
                    }
                    
                    if (result && (result.success || result.status === "success")) {
                        // SUCCESS
                        const memberId = 'TTTC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
                        
                        showResponseMessage(
                            `✅ <strong>Pendaftaran Berhasil!</strong><br>
                            Selamat <strong>${data.nama}</strong>, Anda telah terdaftar sebagai anggota Tik Tak Top Course.<br>
                            <strong>ID Anggota:</strong> ${memberId}<br>
                            <strong>Kelas:</strong> ${programText}<br><br>
                            Data telah disimpan ke Google Sheets. Konfirmasi akan dikirim ke WhatsApp ${data.whatsapp} dalam 1x24 jam.`,
                            'success'
                        );
                        
                        // Log to console
                        console.log('✅ Data saved to Google Sheets:', {
                            memberId: memberId,
                            ...submissionData,
                            timestamp: new Date().toISOString()
                        });
                        
                    } else {
                        // ERROR from server
                        showResponseMessage(
                            `❌ <strong>Gagal menyimpan data.</strong><br>
                            Error: ${result.error || 'Unknown error'}<br>
                            Silakan coba lagi atau hubungi admin.`,
                            'error'
                        );
                    }
                    
                } catch (error) {
                    // Network error
                    console.error('🌐 Network error:', error);
                    
                    // Fallback: Save to localStorage
                    const memberId = 'TTTC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
                    const backupData = {
                        memberId: memberId,
                        nama: data.nama.trim(),
                        program: programText,
                        nik: nikValidation.nik,
                        alamat: data.alamat.trim(),
                        whatsapp: formatPhoneNumber(phoneValidation.phone),
                        timestamp: new Date().toISOString(),
                        error: error.message
                    };
                    
                    // Save to localStorage
                    try {
                        const existing = JSON.parse(localStorage.getItem('tiktaktop_backup') || '[]');
                        existing.push(backupData);
                        localStorage.setItem('tiktaktop_backup', JSON.stringify(existing));
                    } catch (e) {
                        console.log('LocalStorage error:', e);
                    }
                    
                    showResponseMessage(
                        `⚠️ <strong>Data disimpan sementara.</strong><br>
                        Koneksi bermasalah, tetapi data sudah disimpan lokal.<br>
                        <strong>ID Anggota:</strong> ${memberId}<br>
                        Hubungi admin dengan ID tersebut untuk konfirmasi.`,
                        'warning'
                    );
                    
                    console.log('💾 Backup saved to localStorage:', backupData);
                }
                
                // Reset form setelah 3 detik
                setTimeout(() => {
                    registrationForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
        
        // Form input validation styling
        const formInputs = registrationForm.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                if (this.value.trim() !== '') {
                    this.classList.add('valid');
                } else {
                    this.classList.remove('valid');
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.required && this.value.trim() === '') {
                    this.classList.add('error');
                }
            });
        });
        
        // Form reset handler
        registrationForm.addEventListener('reset', function() {
            showResponseMessage('Form telah direset. Silakan isi kembali data Anda.', 'info');
            formInputs.forEach(input => {
                input.classList.remove('error', 'valid');
            });
        });
    }
    
    // ==================== ANIMATED COUNTER FOR STATS ====================
    function animateCounter(element, target) {
        if (!element) return;
        
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = Math.max(Math.floor(duration / (target / increment)), 30);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
                const scale = 0.9 + (current / target) * 0.1;
                element.style.transform = `scale(${scale})`;
            }
        }, stepTime);
    }
    
    // Initialize counter animation when stats section is in view
    const statsContainer = document.getElementById('statsContainer');
    
    if (statsContainer) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statItems = statsContainer.querySelectorAll('.stat-item h3');
                    statItems.forEach((stat, index) => {
                        stat.style.opacity = '0.5';
                        stat.style.transform = 'scale(0.8)';
                        const target = parseInt(stat.getAttribute('data-count'));
                        setTimeout(() => {
                            animateCounter(stat, target);
                        }, index * 200);
                    });
                    statsObserver.disconnect();
                }
            });
        }, observerOptions);
        
        statsObserver.observe(statsContainer);
    }
    
    // ==================== GALLERY LIGHTBOX ====================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxClose = document.getElementById('lightboxClose');
    
    let currentGalleryIndex = 0;
    const galleryImages = Array.from(galleryItems);
    
    function openLightbox(item, index) {
        if (!lightboxModal || !lightboxImage || !lightboxTitle || !lightboxDescription) return;
        
        const imgSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        
        lightboxImage.src = imgSrc;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxImage.alt = title;
        
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        currentGalleryIndex = index;
        
        setTimeout(() => {
            lightboxClose?.focus();
        }, 100);
    }
    
    function closeLightbox() {
        if (!lightboxModal) return;
        
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        
        // Return focus to the gallery item that was clicked
        if (galleryItems[currentGalleryIndex]) {
            galleryItems[currentGalleryIndex].focus();
        }
    }
    
    // Initialize gallery
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentGalleryIndex = index;
            openLightbox(this, index);
        });
        
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentGalleryIndex = index;
                openLightbox(this, index);
            }
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightboxModal?.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
            if (e.key === 'ArrowRight') {
                currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
                openLightbox(galleryImages[currentGalleryIndex], currentGalleryIndex);
            }
            if (e.key === 'ArrowLeft') {
                currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
                openLightbox(galleryImages[currentGalleryIndex], currentGalleryIndex);
            }
        }
    });
    
    // ==================== SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const yOffset = -80;
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== NAVBAR BACKGROUND ON SCROLL ====================
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove background based on scroll
            if (scrollTop > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = 'var(--shadow)';
            }
            
            // Hide/show navbar on scroll direction
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // Update active nav link
            updateActiveNavLink();
        });
    }
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Untuk dropdown Kelas
            if (href === '#kelas' && (
                current === 'kelas' || 
                current === 'kelas-web' || 
                current === 'kelas-programming' || 
                current === 'kelas-office' || 
                current === 'kelas-desain' || 
                current === 'kelas-jaringan'
            )) {
                link.classList.add('active');
            }
            // Untuk dropdown Layanan
            else if (href === '#layanan' && (current === 'register' || current === 'layanan')) {
                link.classList.add('active');
            }
            // Untuk link langsung
            else if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ==================== BACK TO TOP BUTTON ====================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // ==================== MOBILE DROPDOWN TOGGLE ====================
    document.querySelectorAll('.dropdown > .nav-link').forEach(dropdownLink => {
        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.parentElement;
                const dropdownContent = this.nextElementSibling;
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                dropdownContent.style.display = dropdown.classList.contains('active') ? 'block' : 'none';
            }
        });
    });
    
    // ==================== INITIALIZE ANIMATIONS ====================
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements to animate
    document.querySelectorAll('.course-card, .achievement-card, .gallery-item, .service-card, .category-card').forEach(el => {
        animateOnScroll.observe(el);
    });
    
    // ==================== FORM CHAR COUNTER ====================
    const alamatTextarea = document.getElementById('anggotaAlamat');
    if (alamatTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.textContent = '0/500 karakter';
        alamatTextarea.parentNode.appendChild(charCounter);
        
        alamatTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length}/500 karakter`;
            
            if (length > 450) {
                charCounter.classList.add('warning');
            } else {
                charCounter.classList.remove('warning');
            }
            
            if (length > 500) {
                this.value = this.value.substring(0, 500);
                charCounter.textContent = '500/500 karakter (maksimum)';
            }
        });
    }
    
    console.log('All scripts initialized successfully');
});