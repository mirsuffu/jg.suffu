/* ============================================================
   JG. SUFFU Portfolio — main.js (Reimagined 3D)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- 1. LOADER ----------
    const loader = document.getElementById('loader');
    const barFill = document.querySelector('.loader-bar-fill');
    
    barFill.style.width = '40%';
    setTimeout(() => {
        barFill.style.width = '80%';
        setTimeout(() => {
            barFill.style.width = '100%';
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                document.body.classList.add('loaded');
                initHeroAnimations();
            }, 300);
        }, 400);
    }, 400);

    // ---------- 2. CURSOR FOLLOWER ----------
    // (Cursor follower removed as requested)

    // ---------- 3. THEME TOGGLE REMOVED ----------
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark'); // Force dark mode

    // ---------- 4. NAVBAR & DRAWER ----------
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const scrollProgress = document.getElementById('scroll-progress');
    
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    window.addEventListener('scroll', () => {
        // Navbar Scrolled State
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide scroll indicator on scroll
        if (scrollIndicator) {
            if (window.scrollY > 10) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
        
        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";
    });

    const toggleMenu = () => {
        hamburger.classList.toggle('open');
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    document.querySelectorAll('#mobile-drawer a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Active Link Tracking
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const observerOptions = { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    }, observerOptions);
    sections.forEach(sec => sectionObserver.observe(sec));

    // ---------- 5. HERO ANIMATION ----------
    function initHeroAnimations() {
        const lines = document.querySelectorAll('.hero-line');
        lines.forEach((line) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                line.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, parseInt(line.dataset.delay) * 200 + 100);
        });

        const subtitle = document.getElementById('hero-subtitle');
        const cta = document.getElementById('hero-cta');
        const badge = document.getElementById('hero-badge');
        
        [badge, subtitle, cta].forEach((el, index) => {
            if(!el) return;
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 600 + (index * 150));
        });
    }

    // ---------- 6. HOVER EFFECTS REMOVED ----------

    // ---------- 7. 3D PORTFOLIO CAROUSEL ----------
    const track = document.getElementById('portfolio-track');
    const TOTAL_IMAGES = 29;
    let currentIndex = 0;
    let items = [];

    // Initialize Images
    for (let i = 1; i <= TOTAL_IMAGES; i++) {
        const item = document.createElement('div');
        item.className = 'port-item';
        item.innerHTML = `<img src="image_${i}.png" loading="lazy" alt="Portfolio Image ${i}">`;
        
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) {
                openLightbox(i);
            } else {
                updateCarousel(i - 1);
            }
        });
        
        track.appendChild(item);
        items.push(item);
    }

    function updateCarousel(index) {
        currentIndex = index;
        
        document.getElementById('port-current').textContent = currentIndex + 1;
        
        items.forEach((item, i) => {
            item.className = 'port-item'; // reset
            
            if (i === currentIndex) {
                item.classList.add('active');
            } else if (i === currentIndex - 1 || (currentIndex === 0 && i === TOTAL_IMAGES - 1)) {
                item.classList.add('prev');
            } else if (i === currentIndex + 1 || (currentIndex === TOTAL_IMAGES - 1 && i === 0)) {
                item.classList.add('next');
            } else if (i === currentIndex - 2 || (currentIndex === 0 && i === TOTAL_IMAGES - 2) || (currentIndex === 1 && i === TOTAL_IMAGES - 1)) {
                item.classList.add('prev-2');
            } else if (i === currentIndex + 2 || (currentIndex === TOTAL_IMAGES - 1 && i === 1) || (currentIndex === TOTAL_IMAGES - 2 && i === 0)) {
                item.classList.add('next-2');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    updateCarousel(0);

    document.getElementById('port-prev').addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = TOTAL_IMAGES - 1;
        updateCarousel(newIndex);
    });

    document.getElementById('port-next').addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= TOTAL_IMAGES) newIndex = 0;
        updateCarousel(newIndex);
    });
    
    // Auto Play Portfolio
    let autoPlayPort = setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= TOTAL_IMAGES) newIndex = 0;
        updateCarousel(newIndex);
    }, 4000);
    
    document.getElementById('portfolio-wrapper').addEventListener('mouseenter', () => clearInterval(autoPlayPort));

    // ---------- 8. TESTIMONIALS ----------
    const testiGrid = document.getElementById('testimonials-grid');
    async function loadTestimonials() {
        for (let i = 1; i <= 4; i++) {
            try {
                const res = await fetch(`testi_${i}.txt`);
                if (!res.ok) continue;
                const text = await res.text();
                const lines = text.trim().split('\n').filter(l => l.trim() !== '');
                if (lines.length < 4) continue;

                const title = lines[0].trim();
                const body = lines[1].trim();
                const ratingStr = lines[2].trim();
                const client = lines[3].trim();
                const [filled, total] = ratingStr.split('/').map(Number);

                const card = document.createElement('div');
                card.className = `testi-card reveal-pop delay-${i}`;

                let starsHtml = '';
                for (let s = 0; s < total; s++) {
                    starsHtml += s < filled ? '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
                }

                card.innerHTML = `
                  <div class="testi-stars">${starsHtml}</div>
                  <div class="testi-title">${title}</div>
                  <div class="testi-body">${body}</div>
                  <div class="testi-client">${client}</div>
                `;
                testiGrid.appendChild(card);
            } catch (e) {}
        }
    }
    loadTestimonials();

    // ---------- 9. LIGHTBOX ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    let currentLightboxImg = 1;

    let lbScale = 1;
    let lbPtranslateX = 0;
    let lbPtranslateY = 0;
    let lbIsDragging = false;
    let lbStartX = 0;
    let lbStartY = 0;

    function resetLightboxTransform() {
        lbScale = 1;
        lbPtranslateX = 0;
        lbPtranslateY = 0;
        lightboxImg.style.transition = '';
        lightboxImg.style.transform = '';
        lightboxImg.style.cursor = 'zoom-in';
    }

    function updateLightboxTransform(immediate = false) {
        lightboxImg.style.transition = immediate ? 'none' : 'transform 0.2s ease-out';
        lightboxImg.style.transform = `translate(${lbPtranslateX}px, ${lbPtranslateY}px) scale(${lbScale})`;
    }

    function openLightbox(index) {
        currentLightboxImg = index;
        lightboxImg.src = `image_${index}.png`;
        resetLightboxTransform();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(resetLightboxTransform, 400);
    });

    document.getElementById('lightbox-prev').addEventListener('click', () => {
        currentLightboxImg--;
        if(currentLightboxImg < 1) currentLightboxImg = TOTAL_IMAGES;
        lightboxImg.src = `image_${currentLightboxImg}.png`;
        resetLightboxTransform();
    });

    document.getElementById('lightbox-next').addEventListener('click', () => {
        currentLightboxImg++;
        if(currentLightboxImg > TOTAL_IMAGES) currentLightboxImg = 1;
        lightboxImg.src = `image_${currentLightboxImg}.png`;
        resetLightboxTransform();
    });

    // Zooming Desktop
    lightbox.addEventListener('wheel', (e) => {
        if (!lightbox.classList.contains('open')) return;
        e.preventDefault();
        const zoomIntensity = 0.15;
        lbScale += e.deltaY < 0 ? zoomIntensity : -zoomIntensity;
        lbScale = Math.min(Math.max(1, lbScale), 4);
        if (lbScale === 1) {
            lbPtranslateX = 0;
            lbPtranslateY = 0;
            lightboxImg.style.cursor = 'zoom-in';
        } else {
            lightboxImg.style.cursor = 'grab';
        }
        updateLightboxTransform(false);
    });

    // Panning Desktop
    lightboxImg.addEventListener('mousedown', (e) => {
        if (lbScale > 1) {
            lbIsDragging = true;
            lbStartX = e.clientX - lbPtranslateX;
            lbStartY = e.clientY - lbPtranslateY;
            lightboxImg.style.cursor = 'grabbing';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!lbIsDragging) return;
        lbPtranslateX = e.clientX - lbStartX;
        lbPtranslateY = e.clientY - lbStartY;
        updateLightboxTransform(true);
    });

    window.addEventListener('mouseup', () => {
        lbIsDragging = false;
        if(lbScale > 1) lightboxImg.style.cursor = 'grab';
    });

    // Panning/Zooming Mobile
    let lbInitialPinchDist = null;
    let lbInitialScale = 1;
    
    lightboxImg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            lbInitialPinchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            lbInitialScale = lbScale;
        } else if (e.touches.length === 1 && lbScale > 1) {
            lbIsDragging = true;
            lbStartX = e.touches[0].clientX - lbPtranslateX;
            lbStartY = e.touches[0].clientY - lbPtranslateY;
        }
    }, {passive: false});

    lightboxImg.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && lbInitialPinchDist) {
            e.preventDefault();
            const currentDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            lbScale = lbInitialScale * (currentDist / lbInitialPinchDist);
            lbScale = Math.min(Math.max(1, lbScale), 4);
            if (lbScale === 1) {
                lbPtranslateX = 0;
                lbPtranslateY = 0;
            }
            updateLightboxTransform(true);
        } else if (e.touches.length === 1 && lbIsDragging) {
            e.preventDefault();
            lbPtranslateX = e.touches[0].clientX - lbStartX;
            lbPtranslateY = e.touches[0].clientY - lbStartY;
            updateLightboxTransform(true);
        }
    }, {passive: false});

    lightboxImg.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) lbInitialPinchDist = null;
        if (e.touches.length === 0) lbIsDragging = false;
    });
    
    // Double click to zoom in/out
    lightboxImg.addEventListener('dblclick', () => {
        if (lbScale > 1) {
            resetLightboxTransform();
        } else {
            lbScale = 2;
            lightboxImg.style.cursor = 'grab';
            updateLightboxTransform(false);
        }
    });

    // ---------- 10. CONTACT FORM ----------
    const btnEmail = document.getElementById('btn-send-email');
    const btnWhatsApp = document.getElementById('btn-send-whatsapp');

    function getFormData() {
        return {
            name: document.getElementById('contact-name').value.trim(),
            mobile: document.getElementById('contact-mobile').value.trim(),
            purpose: document.getElementById('contact-purpose').value.trim(),
            note: document.getElementById('contact-note').value.trim() || "Let's Discuss"
        };
    }

    function validateForm(data) {
        if (!data.name || !data.mobile || !data.purpose) {
            alert('Please fill in Name, Mobile/Email, and Purpose.');
            return false;
        }
        return true;
    }

    // Progress Tracker for Form
    const progressDots = document.querySelectorAll('#contact-progress-dots .deco-circle');
    const formInputs = [
        document.getElementById('contact-name'),
        document.getElementById('contact-mobile'),
        document.getElementById('contact-purpose'),
        document.getElementById('contact-note')
    ];

    formInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.trim().length > 0) {
                progressDots[index].classList.add('filled');
            } else {
                progressDots[index].classList.remove('filled');
            }
        });
    });

    document.getElementById('btn-clear-form').addEventListener('click', () => {
        formInputs.forEach((input, index) => {
            input.value = '';
            progressDots[index].classList.remove('filled');
        });
    });

    btnWhatsApp.addEventListener('click', () => {
        const data = getFormData();
        if (!validateForm(data)) return;
        const msg = `*Name:* ${data.name}\n*Mobile/Email:* ${data.mobile}\n*Purpose:* ${data.purpose}\n*Note:* ${data.note}`;
        window.open(`https://wa.me/919422872892?text=${encodeURIComponent(msg)}`, '_blank');
    });

    btnEmail.addEventListener('click', () => {
        const data = getFormData();
        if (!validateForm(data)) return;
        const body = `Name: ${data.name}\nMobile/Email: ${data.mobile}\nPurpose: ${data.purpose}\nNote: ${data.note}`;
        window.location.href = `mailto:mirsuffu@gmail.com?subject=${encodeURIComponent(data.purpose)}&body=${encodeURIComponent(body)}`;
    });

    document.getElementById('footer-year').textContent = new Date().getFullYear();

    // ---------- 11. INTERSECTION OBSERVER FOR REVEALS ----------
    const revealObserverOptions = {
        threshold: 0,
        rootMargin: "0px 0px -20px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, revealObserverOptions);

    const revealElements = document.querySelectorAll('.reveal-blur, .reveal-3d, .reveal-clip, .reveal-pop');
    revealElements.forEach(el => revealObserver.observe(el));
    
    // In case dynamic elements like testimonials get added later:
    const observeDynamic = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList && node.classList.contains('reveal-pop')) {
                    revealObserver.observe(node);
                }
            });
        });
    });
    observeDynamic.observe(document.getElementById('testimonials-grid'), { childList: true });

    // ---------- 11. THREE.JS HEXAGON BACKGROUND ----------
    if (typeof THREE !== 'undefined') {
        const canvas = document.getElementById('three-canvas');
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 40, 120);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 50, 40);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(30, 60, -20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 10;
        dirLight.shadow.camera.far = 200;
        const d = 60;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0x1E90FF, 0.2);
        fillLight.position.set(-30, 20, 30);
        scene.add(fillLight);

        const radius = 4;
        const depth = 15;

        const hexShape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) hexShape.moveTo(x, y);
            else hexShape.lineTo(x, y);
        }
        hexShape.lineTo(Math.cos(0) * radius, Math.sin(0) * radius);

        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.15,
            bevelThickness: 0.2
        };
        const geometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
        geometry.center();

        const material = new THREE.MeshStandardMaterial({
            color: 0x0A0A0A,
            roughness: 0.35,
            metalness: 0.8,
        });

        const hexagons = [];
        const hexWidth = 2 * radius;
        const hexHeight = Math.sqrt(3) * radius;
        const xOffset = hexWidth * 0.75;
        const zOffset = hexHeight;

        const isMobile = window.innerWidth < 768;
        const cols = isMobile ? 14 : 26;
        const rows = isMobile ? 14 : 26;

        for (let row = -rows / 2; row < rows / 2; row++) {
            for (let col = -cols / 2; col < cols / 2; col++) {
                const mesh = new THREE.Mesh(geometry, material);
                const x = col * xOffset;
                const z = row * zOffset + (col % 2 === 0 ? 0 : zOffset / 2);
                mesh.rotation.x = -Math.PI / 2;
                mesh.scale.set(0.96, 1, 0.96);

                const randomHeightOffset = Math.random() * 8;
                mesh.position.set(x, randomHeightOffset, z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                mesh.userData = {
                    baseY: randomHeightOffset,
                    gridX: x,
                    gridZ: z,
                    randomPhase: Math.random() * Math.PI * 2
                };
                scene.add(mesh);
                hexagons.push(mesh);
            }
        }

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectionPoint = new THREE.Vector3();

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(plane, intersectionPoint);

            hexagons.forEach(hex => {
                const wave1 = Math.sin(time * 0.4 + hex.userData.gridX * 0.15 + hex.userData.gridZ * 0.15);
                const wave2 = Math.cos(time * 0.25 + hex.userData.gridX * 0.05 - hex.userData.gridZ * 0.1);
                const breath = Math.sin(time * 0.15 + hex.userData.randomPhase) * 0.5;

                let baseLift = hex.userData.baseY + (wave1 + wave2) * 1.5 + breath;

                if (intersectionPoint) {
                    const dx = hex.position.x - intersectionPoint.x;
                    const dz = hex.position.z - intersectionPoint.z;
                    const distance = Math.sqrt(dx * dx + dz * dz);
                    const influenceRadius = 20;
                    if (distance < influenceRadius) {
                        const factor = 1 - (distance / influenceRadius);
                        const lift = factor * factor * 8;
                        baseLift += lift;
                    }
                }

                const targetY = baseLift;
                hex.position.y += (targetY - hex.position.y) * 0.06;
            });

            renderer.render(scene, camera);
        }
        animate();

        let lastCanvasWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            if (window.innerWidth !== lastCanvasWidth) {
                lastCanvasWidth = window.innerWidth;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        // Set initial dark theme values
        scene.fog.color.setHex(0x000000);
        material.color.setHex(0x0A0A0A);
        material.metalness = 0.8;
        material.roughness = 0.35;
        ambientLight.intensity = 0.15;
        dirLight.intensity = 1.2;
        fillLight.intensity = 0.2;
    }
});
