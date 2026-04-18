/* ============================================================
   JG. SUFFU Portfolio — main.js (Refactored)
   Vanilla JS · No libraries (except Three.js for background)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ──────────────────────────────────────────
  // 1. THREE.JS HEXAGON BACKGROUND
  // ──────────────────────────────────────────
  const bgContainer = document.getElementById('bg-canvas-container');
  if (bgContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 40, 120);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    bgContainer.appendChild(renderer.domElement);

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

    // Reduce grid on mobile for performance
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

    // Raycaster for cursor interaction
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

        // Cursor interaction
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

        // Smooth interpolation
        const targetY = baseLift;
        hex.position.y += (targetY - hex.position.y) * 0.06;
      });

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }


  // ──────────────────────────────────────────
  // 2. ENTRY & WELCOME ANIMATION
  // ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  navbar.classList.add('visible');

  // Dynamic footer year
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // Welcome card — Membrane Breathe entrance
  const welcomeCard = document.getElementById('welcome-card');
  if (welcomeCard) {
    // Animate welcome title characters with stagger
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) {
      const originalHTML = welcomeTitle.innerHTML;
      let charIndex = 0;
      const wrappedHTML = originalHTML.replace(/(<[^>]+>)|(.)/g, (match, tag, char) => {
        if (tag) return tag;
        if (char === ' ') return ' ';
        charIndex++;
        return `<span class="welcome-char" style="transition-delay: ${charIndex * 15}ms">${char}</span>`;
      });
      welcomeTitle.innerHTML = wrappedHTML;

      // Trigger character reveals after a short delay
      setTimeout(() => {
        welcomeTitle.querySelectorAll('.welcome-char').forEach(ch => ch.classList.add('visible'));
      }, 600);
    }

    // Trigger the card breathe animation
    setTimeout(() => {
      welcomeCard.classList.add('animate-entrance', 'border-active');
    }, 100);
  }


  // ──────────────────────────────────────────
  // 3. NAVBAR — Active section tracking
  // ──────────────────────────────────────────
  const navLinks = document.querySelectorAll('#navbar .nav-links a');
  const drawerLinks = document.querySelectorAll('#mobile-drawer a');
  const sections = document.querySelectorAll('.section[id]');
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');

  function setActiveNav(id) {
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
    drawerLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  }, { rootMargin: '-30% 0px -70% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // Hamburger toggle
  function toggleDrawer() {
    hamburger.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
    drawerOverlay.classList.toggle('open');
  }

  hamburger.addEventListener('click', toggleDrawer);
  drawerOverlay.addEventListener('click', toggleDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('open')) toggleDrawer();
  }));


  // ──────────────────────────────────────────
  // 4. TYPEWRITER EFFECT — Natural speed
  // ──────────────────────────────────────────
  function typewrite(el, text, baseSpeed = 22) {
    let i = 0;
    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);

    function type() {
      if (i < text.length) {
        const char = text.charAt(i);
        const charNode = document.createTextNode(char);
        el.insertBefore(charNode, cursor);
        i++;

        // Natural speed variation
        let delay = baseSpeed + Math.random() * 15;
        if (char === '.' || char === '—') delay += Math.random() * 80 + 60;
        else if (char === ',') delay += Math.random() * 40 + 30;

        setTimeout(type, delay);
      } else {
        setTimeout(() => cursor.remove(), 2000);
      }
    }
    type();
  }

  // Track typewriter state
  let typewriterAStarted = false;
  let typewriterBStarted = false;
  const twA = document.getElementById('typewriter-a');
  const twB = document.getElementById('typewriter-b');

  function triggerTypewriterA() {
    if (typewriterAStarted || !twA) return;
    typewriterAStarted = true;
    const textA = twA.getAttribute('data-text');
    typewrite(twA, textA, 22);
  }

  function triggerTypewriterB() {
    if (typewriterBStarted || !twB) return;
    typewriterBStarted = true;
    const textB = twB.getAttribute('data-text');
    typewrite(twB, textB, 22);
  }


  // ──────────────────────────────────────────
  // 5. UNIFIED SCROLL REVEAL MANAGER
  // ──────────────────────────────────────────
  function setupScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('revealed');

          // Gradient card border activation
          if (el.classList.contains('gradient-card')) {
            el.classList.add('border-active');
          }

          // Typewriter triggers — wait for slide-in transition to finish
          if (el.closest('#about-row-a') && el.classList.contains('about-text-card')) {
            // Delay typewriter until card's slide-in animation completes (800ms)
            setTimeout(triggerTypewriterA, 850);
          }
          if (el.closest('#about-row-b') && el.classList.contains('about-text-card')) {
            setTimeout(triggerTypewriterB, 850);
          }

          // Testimonial star cascade — wait for card reveal to finish
          if (el.classList.contains('testi-card')) {
            const stars = el.querySelectorAll('.testi-star');
            stars.forEach((star, i) => {
              // 600ms for card reveal + stagger per star
              setTimeout(() => star.classList.add('pop'), 650 + i * 100);
            });
          }

          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.08 });

    // Section titles — low threshold to ensure they always trigger
    document.querySelectorAll('.section-title').forEach(el => {
      el.classList.add('reveal-ready');
      revealObserver.observe(el);
    });

    // About cards — parallax slide-in
    document.querySelectorAll('.about-text-card, .about-media-card').forEach(el => {
      el.classList.add('reveal-ready');
      revealObserver.observe(el);
    });

    // Gradient cards — activate border spin when visible
    document.querySelectorAll('.gradient-card').forEach(el => {
      revealObserver.observe(el);
    });

    // Social links — domino wave with stagger
    document.querySelectorAll('.social-link').forEach((el, i) => {
      el.classList.add('reveal-ready');
      el.style.transitionDelay = `${i * 120}ms`;
      revealObserver.observe(el);
    });

    // Contact card
    const contactCard = document.querySelector('.contact-card');
    if (contactCard) {
      contactCard.classList.add('reveal-ready');
      revealObserver.observe(contactCard);
    }

    // Footer
    const footer = document.getElementById('footer');
    if (footer) {
      footer.classList.add('reveal-ready');
      revealObserver.observe(footer);
    }

    return revealObserver;
  }

  const mainRevealObserver = setupScrollReveal();

  // Helper for dynamically added elements
  function observeNewElement(el, cssClass) {
    if (cssClass) el.classList.add(cssClass);
    mainRevealObserver.observe(el);
  }


  // ──────────────────────────────────────────
  // 6. PORTFOLIO CAROUSEL
  // ──────────────────────────────────────────
  const carouselTrack = document.getElementById('carousel-track');
  const carouselWrapper = document.getElementById('carousel-wrapper');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const TOTAL_IMAGES = 29;
  let currentIndex = 3;
  let userInteracted = false;

  // Populate carousel
  for (let i = 1; i <= TOTAL_IMAGES; i++) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.dataset.index = i - 1;
    const img = document.createElement('img');
    img.src = `image_${i}.png`;
    img.alt = `Portfolio piece ${i}`;
    img.loading = 'lazy';
    item.appendChild(img);
    item.addEventListener('click', () => openLightbox(i - 1));
    carouselTrack.appendChild(item);
  }

  function updateCarouselFocus() {
    const items = carouselTrack.querySelectorAll('.carousel-item');
    items.forEach((item, idx) => {
      item.classList.toggle('focused', idx === currentIndex);
    });
  }

  function slideCarousel() {
    const items = carouselTrack.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth + 20; // gap
    const wrapperWidth = carouselWrapper.offsetWidth;
    const centerOffset = wrapperWidth / 2 - itemWidth / 2;
    const translateX = centerOffset - currentIndex * itemWidth;
    carouselTrack.style.transform = `translateX(${translateX}px)`;
    updateCarouselFocus();
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, TOTAL_IMAGES - 1));
    slideCarousel();
  }

  prevBtn.addEventListener('click', () => {
    userInteracted = true;
    goToSlide(currentIndex - 1);
  });
  nextBtn.addEventListener('click', () => {
    userInteracted = true;
    goToSlide(currentIndex + 1);
  });

  // Mouse wheel navigation
  carouselWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    userInteracted = true;
    if (e.deltaY > 0) goToSlide(currentIndex + 1);
    else goToSlide(currentIndex - 1);
  }, { passive: false });

  // Touch swipe for carousel
  let carouselTouchStartX = 0;
  carouselWrapper.addEventListener('touchstart', (e) => {
    carouselTouchStartX = e.touches[0].clientX;
  }, { passive: true });

  carouselWrapper.addEventListener('touchend', (e) => {
    const delta = carouselTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      userInteracted = true;
      if (delta > 0) goToSlide(currentIndex + 1);
      else goToSlide(currentIndex - 1);
    }
  }, { passive: true });

  // Auto-animation — only when carousel is visible AND user hasn't interacted
  let autoAnimated = false;
  const carouselAutoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !autoAnimated) {
        autoAnimated = true;
        autoAnimateCarousel();
        carouselAutoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  function autoAnimateCarousel() {
    const timeline = [
      { target: 4, delay: 800 },
      { target: 2, delay: 1800 },
      { target: 5, delay: 2800 },
      { target: 3, delay: 3800 },
    ];
    timeline.forEach(({ target, delay }) => {
      setTimeout(() => {
        if (!userInteracted) goToSlide(target);
      }, delay);
    });
  }

  window.addEventListener('resize', slideCarousel);

  // Initialize carousel
  slideCarousel();
  carouselAutoObserver.observe(carouselWrapper);


  // ──────────────────────────────────────────
  // 7. LIGHTBOX — with keyboard support & bloom animation
  // ──────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  let lightboxCurrentIndex = 0;

  let lightboxScale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  function openLightbox(index) {
    lightboxCurrentIndex = index;
    updateLightboxImg();
    resetLightboxTransform();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxImg() {
    lightboxImg.classList.add('no-transition');
    lightboxImg.src = `image_${lightboxCurrentIndex + 1}.png`;
    // Force reflow and remove after a tiny delay
    setTimeout(() => {
      lightboxImg.classList.remove('no-transition');
    }, 20);
  }

  function resetLightboxTransform() {
    lightboxScale = 1;
    offsetX = 0;
    offsetY = 0;
    updateLightboxTransform();
  }

  function updateLightboxTransform() {
    lightboxImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${lightboxScale})`;
  }

  function nextLightbox() {
    lightboxCurrentIndex = (lightboxCurrentIndex + 1) % TOTAL_IMAGES;
    updateLightboxImg();
    resetLightboxTransform();
  }

  function prevLightbox() {
    lightboxCurrentIndex = (lightboxCurrentIndex - 1 + TOTAL_IMAGES) % TOTAL_IMAGES;
    updateLightboxImg();
    resetLightboxTransform();
  }

  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightbox);

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Desktop mouse dragging to pan
  lightboxImg.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Prevents native image dragging ghost
    isDragging = true;
    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;
    lightboxImg.classList.add('cursor-grabbing');
    lightboxImg.classList.add('no-transition');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
    updateLightboxTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    lightboxImg.classList.remove('cursor-grabbing');
    lightboxImg.classList.remove('no-transition');
  });

  // Scroll wheel zoom to cursor (desktop)
  lightbox.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.target !== lightboxImg && e.target !== lightbox) return;
    
    const oldScale = lightboxScale;
    if (e.deltaY < 0) {
      lightboxScale = Math.min(lightboxScale + 0.25, 5);
    } else {
      lightboxScale = Math.max(lightboxScale - 0.25, 0.5);
    }

    const rect = lightbox.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const ratio = lightboxScale / oldScale;
    offsetX = mouseX - (mouseX - offsetX) * ratio;
    offsetY = mouseY - (mouseY - offsetY) * ratio;

    updateLightboxTransform();
  }, { passive: false });

  // Pinch-to-zoom (mobile)
  let lightboxInitDist = 0;
  let lightboxBaseScale = 1;

  lightboxImg.addEventListener('touchstart', (e) => {
    lightboxImg.classList.add('no-transition');
    if (e.touches.length === 2) {
      lightboxInitDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lightboxBaseScale = lightboxScale;
    } else if (e.touches.length === 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX - offsetX;
      dragStartY = e.touches[0].clientY - offsetY;
    }
  }, { passive: true });

  lightboxImg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDelta = currentDist / lightboxInitDist;
      
      const oldScale = lightboxScale;
      lightboxScale = Math.max(0.5, Math.min(5, lightboxBaseScale * scaleDelta));
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - centerX;
      const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - centerY;
      
      const ratio = lightboxScale / oldScale;
      offsetX = touchCenterX - (touchCenterX - offsetX) * ratio;
      offsetY = touchCenterY - (touchCenterY - offsetY) * ratio;

      updateLightboxTransform();
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      offsetX = e.touches[0].clientX - dragStartX;
      offsetY = e.touches[0].clientY - dragStartY;
      updateLightboxTransform();
    }
  }, { passive: false });

  lightboxImg.addEventListener('touchend', () => {
    isDragging = false;
    lightboxImg.classList.remove('no-transition');
  });

  // Keyboard support for Lightbox (and Carousel when closed)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
    if (lightbox.classList.contains('open')) {
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    } else {
      if (e.key === 'ArrowLeft') {
        userInteracted = true;
        goToSlide(currentIndex - 1);
      }
      if (e.key === 'ArrowRight') {
        userInteracted = true;
        goToSlide(currentIndex + 1);
      }
    }
  });


  // ──────────────────────────────────────────
  // 8. TESTIMONIALS — Dynamic load with scroll-reveal
  // ──────────────────────────────────────────
  const testiGrid = document.getElementById('testimonials-grid');
  const TESTI_COUNT = 4;

  async function loadTestimonials() {
    for (let i = 1; i <= TESTI_COUNT; i++) {
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

        // Build card
        const card = document.createElement('div');
        card.className = 'testi-card';

        let starsHtml = '';
        for (let s = 0; s < total; s++) {
          starsHtml += s < filled
            ? '<span class="testi-star star-filled">&#9733;</span>'
            : '<span class="testi-star star-empty">&#9733;</span>';
        }

        card.innerHTML = `
          <div class="testi-title">${title}</div>
          <div class="testi-body">${body}</div>
          <div class="testi-stars">${starsHtml}</div>
          <div class="testi-client">${client}</div>
        `;
        testiGrid.appendChild(card);

        // Register with scroll reveal
        observeNewElement(card, 'reveal-ready');
      } catch (e) {
        // silently skip
      }
    }
  }

  loadTestimonials();


  // ──────────────────────────────────────────
  // 9. CONTACT FORM — WhatsApp & Email
  // ──────────────────────────────────────────
  const btnEmail = document.getElementById('btn-send-email');
  const btnWhatsApp = document.getElementById('btn-send-whatsapp');

  function getFormData() {
    const name = document.getElementById('contact-name').value.trim();
    const mobile = document.getElementById('contact-mobile').value.trim();
    const purpose = document.getElementById('contact-purpose').value.trim();
    let note = document.getElementById('contact-note').value.trim();
    if (!note) note = "Let's Discuss";
    return { name, mobile, purpose, note };
  }

  function validateForm() {
    const { name, mobile, purpose } = getFormData();
    if (!name || !mobile || !purpose) {
      alert('Please fill in all required fields: Name, Mobile/Email, and Purpose.');
      return false;
    }
    return true;
  }

  btnWhatsApp.addEventListener('click', () => {
    if (!validateForm()) return;
    const { name, mobile, purpose, note } = getFormData();
    const msg = `*Name:* ${name} | *Mobile/Email:* ${mobile} | *Purpose:* ${purpose} | *Note:* ${note}`;
    const url = `https://wa.me/919422872892?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });

  btnEmail.addEventListener('click', () => {
    if (!validateForm()) return;
    const { name, mobile, purpose, note } = getFormData();
    const body = `Name: ${name}\nMobile/Email: ${mobile}\nPurpose: ${purpose}\nNote: ${note}`;
    const url = `mailto:mirsuffu@gmail.com?subject=${encodeURIComponent(purpose)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  });

});
