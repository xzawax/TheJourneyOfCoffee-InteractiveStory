/* ============================================================
   THE JOURNEY OF COFFEE — main.js
   Architecture:
     1.  Config & Constants
     2.  GSAP Setup & Plugin Registration
     3.  Utility Helpers
     4.  Module: Progress Bar
     5.  Module: Stage Nav
     6.  Module: Hero Animations
     7.  Module: Three.js Hero Canvas
     8.  Module: Bean Belt Animation
     9.  Module: Harvest Cherry Float
    10.  Module: Section Reveal (ScrollTrigger)
    11.  Module: Stat Count-Up
    12.  Module: Roast Interaction
    13.  Module: Brew Cards
    14.  Module: Cup Steam
    15.  Init
   ============================================================ */


/* ============================================================
   1. CONFIG & CONSTANTS
   ============================================================ */

const CONFIG = {
  roastLevels: {
    light:  { colour: '#c8a96e', temp: '196 °C', label: 'Light Roast'  },
    medium: { colour: '#7b4a1e', temp: '210 °C', label: 'Medium Roast' },
    dark:   { colour: '#2c1206', temp: '225 °C', label: 'Dark Roast'   },
  },

  scrollTrigger: {
    start:         'top 82%',
    toggleActions: 'play none none none',
  },

  dur: {
    fast:  0.3,
    mid:   0.6,
    slow:  1.0,
    hero:  1.2,
  },

  ease: {
    out:   'power3.out',
    inOut: 'power2.inOut',
    expo:  'expo.out',
    back:  'back.out(1.4)',
  },
};


/* ============================================================
   2. GSAP SETUP
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


/* ============================================================
   3. UTILITY HELPERS
   ============================================================ */

const qs  = (sel, scope = document) => scope.querySelector(sel);
const qsa = (sel, scope = document) => [...scope.querySelectorAll(sel)];

function formatNumber(val, target) {
  // Billions
  if (target >= 1_000_000_000) {
    const b = val / 1_000_000_000;
    return val >= target
      ? `${Math.round(target / 1_000_000_000)}B`
      : `${b.toFixed(2)}B`;
  }
  // Millions
  if (target >= 1_000_000) {
    const m = val / 1_000_000;
    return val >= target
      ? `${Math.round(target / 1_000_000)}M`
      : `${m.toFixed(1)}M`;
  }
  // Thousands
  if (target >= 1_000) {
    const k = val / 1_000;
    return val >= target
      ? `${Math.round(target / 1_000)}K`
      : `${k.toFixed(1)}K`;
  }
  return Math.round(val).toLocaleString();
}

function animateCount(el, target, duration = 2) {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = formatNumber(obj.val, target);
    },
    onComplete() {
      el.textContent = formatNumber(target, target);
    },
  });
}


/* ============================================================
   4. MODULE: PROGRESS BAR
   ============================================================ */

function initProgressBar() {
  const fill = qs('[data-gsap="progress-fill"]');
  if (!fill) return;

  ScrollTrigger.create({
    start: 'top top',
    end:   'bottom bottom',
    onUpdate(self) {
      gsap.set(fill, { width: `${self.progress * 100}%` });
    },
  });
}


/* ============================================================
   5. MODULE: STAGE NAV
   ============================================================ */

function initStageNav() {
  const nav  = qs('.stage-nav');
  const dots = qsa('.stage-nav__dot');
  if (!nav || !dots.length) return;

  ScrollTrigger.create({
    trigger:     '#section-hero',
    start:       'bottom top',
    onEnter()     { nav.classList.add('is-visible'); },
    onLeaveBack() { nav.classList.remove('is-visible'); },
  });

  qsa('.section[data-section]').forEach((section) => {
    const index = section.dataset.section;
    ScrollTrigger.create({
      trigger:      section,
      start:        'top 50%',
      end:          'bottom 50%',
      onEnter()     { setActiveDot(index); },
      onEnterBack() { setActiveDot(index); },
    });
  });

  function setActiveDot(index) {
    dots.forEach((d) => d.classList.remove('is-active'));
    const active = qs(`[data-stage="${index}"]`);
    if (active) active.classList.add('is-active');
  }
}


/* ============================================================
   6. MODULE: HERO ANIMATIONS
   Staggered entrance: eyebrow → title → subtitle → scroll cue
   Parallax on background circles.
   ============================================================ */

function initHero() {
  if (prefersReducedMotion) {
    gsap.set(
      ['.hero__eyebrow', '.hero__title', '.hero__title-line', '.hero__subtitle', '.hero__scroll-cue'],
      { opacity: 1, y: 0 }
    );
    return;
  }

  const tl = gsap.timeline({ delay: 0.3 });

  tl.to('.hero__eyebrow', {
    opacity:  1,
    y:        0,
    duration: CONFIG.dur.mid,
    ease:     CONFIG.ease.out,
  })
  .to('.hero__title-line', {
    opacity:  1,
    y:        0,
    duration: CONFIG.dur.hero,
    ease:     CONFIG.ease.expo,
    stagger:  0.15,
  }, '-=0.2')
  .set('.hero__title', { opacity: 1 }, '<')
  .to('.hero__subtitle', {
    opacity:  1,
    y:        0,
    duration: CONFIG.dur.mid,
    ease:     CONFIG.ease.out,
  }, '-=0.5')
  .to('.hero__scroll-cue', {
    opacity:  1,
    y:        0,
    duration: CONFIG.dur.mid,
    ease:     CONFIG.ease.out,
  }, '-=0.3');

  // Scroll arrow bounce loop
  gsap.to('.hero__scroll-arrow', {
    y:        10,
    duration: 0.9,
    ease:     'sine.inOut',
    yoyo:     true,
    repeat:   -1,
    delay:    1.8,
  });

  // Background circle parallax
  gsap.to('.hero__bg-circle--1', {
    y: '-20%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#section-hero',
      start:   'top top',
      end:     'bottom top',
      scrub:   1.5,
    },
  });

  gsap.to('.hero__bg-circle--2', {
    y: '15%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#section-hero',
      start:   'top top',
      end:     'bottom top',
      scrub:   2,
    },
  });
}


/* ============================================================
   7. MODULE: THREE.JS HERO CANVAS
   - Renders a 3D coffee bean shape (TorusKnot as placeholder,
     swap geometry for your .glb bean via GLTFLoader)
   - Auto-spins on Y axis
   - Hover → pauses spin, enables OrbitControls drag
   - Mouseleave → resumes auto-spin from current rotation
   - Transparent background so CSS bg circles show through
   ============================================================ */

function initThreeJS() {
  const container = qs('[data-threejs="hero-canvas"]');

  // Bail silently if Three.js not loaded or container missing
  if (!container || typeof THREE === 'undefined') return;

  // --- Scene setup ---
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 4.5);

  const renderer = new THREE.WebGLRenderer({
    antialias:  true,
    alpha:      true,         // transparent background
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // --- Lighting ---
  // Warm ambient fill
  const ambient = new THREE.AmbientLight(0xfff3e0, 0.6);
  scene.add(ambient);

  // Key light — caramel warm
  const keyLight = new THREE.DirectionalLight(0xc8843a, 1.8);
  keyLight.position.set(3, 4, 3);
  scene.add(keyLight);

  // Rim light — cool contrast
  const rimLight = new THREE.DirectionalLight(0x3a2010, 0.8);
  rimLight.position.set(-3, -2, -2);
  scene.add(rimLight);

  // --- Geometry: Coffee Bean shape ---
  // Using a flattened sphere + crease line as placeholder.
  // To swap in your .glb: comment out beanGroup creation below,
  // use THREE.GLTFLoader and add loaded scene to beanGroup.
  const beanGroup = new THREE.Group();

  const loader = new THREE.GLTFLoader();

  loader.load('object/coffee_bean.glb', (gltf) => {
      beanGroup.add(gltf.scene);
  });

  // // Bean body — scaled sphere (oval / bean-like)
  // const bodyGeo = new THREE.SphereGeometry(1, 64, 64);
  // const bodyMat = new THREE.MeshStandardMaterial({
  //   color:     0x6b3318,
  //   roughness: 0.55,
  //   metalness: 0.05,
  // });
  // const body = new THREE.Mesh(bodyGeo, bodyMat);
  // body.scale.set(0.9, 1.2, 0.6);   // flatten into bean oval
  // beanGroup.add(body);
  beanGroup.scale.set(0.5,0.5,0.5)
  // beanGroup.rotation.set(1,1.5,0.5)
  beanGroup.rotation.z = 1;
  // beanGroup.position.set(1,0,0)
  // camera.position.x += 1;

  // Centre crease — thin torus along the bean's equator
  const creaseGeo = new THREE.TorusGeometry(0.62, 0.04, 16, 80);
  const creaseMat = new THREE.MeshStandardMaterial({
    color:     0x3b1509,
    roughness: 0.8,
    metalness: 0.0,
  });
  const crease = new THREE.Mesh(creaseGeo, creaseMat);
  crease.rotation.x = Math.PI / 2;
  crease.scale.set(1, 1, 0.01);    // flatten crease to a line on bean surface
  beanGroup.add(crease);

  scene.add(beanGroup);

  // --- OrbitControls ---
  const controls        = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom    = false;
  controls.enablePan     = false;
  controls.enabled       = false;   // disabled until hover

  
  controls.target.set(0, 0, 0);
  controls.update();

  // --- Auto-spin state ---
  let isHovered    = false;
  let autoSpinSpeed = 0.004;        // radians per frame

  // Hover: pause spin, hand off to OrbitControls
  container.addEventListener('mouseenter', () => {
    // isHovered        = true;
    controls.enabled = true;
  });

  container.addEventListener('mousedown', () => {
    isHovered        = true;
    controls.enabled = true;
  });

  container.addEventListener('mouseup', () => {
    isHovered        = false;
  });

  container.addEventListener('mouseleave', () => {
    isHovered        = false;
    controls.enabled = false;
  });

  // Touch: enable controls on touch devices
  container.addEventListener('touchstart', () => {
    isHovered        = true;
    controls.enabled = true;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    // Small delay so last touch doesn't snap back
    setTimeout(() => {
      isHovered        = false;
      controls.enabled = false;
    }, 1500);
  });

  // --- Resize handler ---
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // --- GSAP entrance: bean scales in when page loads ---
  gsap.from(beanGroup.scale, {
    x:        0,
    y:        0,
    z:        0,
    duration: 1.6,
    ease:     'elastic.out(1, 0.6)',
    delay:    0.8,
  });

  // --- Render loop ---
  function tick() {
    requestAnimationFrame(tick);

    if (!isHovered && !prefersReducedMotion) {
      beanGroup.rotation.y += autoSpinSpeed;
      beanGroup.rotation.x  = Math.sin(Date.now() * 0.0004) * 0.15; // gentle wobble
    }

    controls.update();
    renderer.render(scene, camera);
  }

  tick();

  // --- Tooltip hint: show on first load, hide after 3s ---
  const hint = document.createElement('p');
  hint.textContent = 'Drag to rotate';
  hint.style.cssText = `
    position:absolute; bottom:24px; left:50%; transform:translateX(-50%);
    font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase;
    color:rgba(240,230,211,0.45); pointer-events:none;
    transition:opacity 0.6s ease;
  `;
  container.style.position = 'absolute';
  container.appendChild(hint);
  setTimeout(() => { hint.style.opacity = '0'; }, 3000);
}


/* ============================================================
   8. MODULE: COFFEE ORIGINS EXPLORER
   Interactive cards for major coffee-producing countries.
   Click a region to reveal tasting notes & production facts.
   ============================================================ */

const ORIGINS_DATA = [
  {
    code: 'ET', country: 'Ethiopia', region: 'Africa',
    flag: '🇪🇹', altitude: '1,500–2,200m',
    profile: 'Blueberry · Jasmine · Bergamot',
    note: 'Birthplace of Arabica. Natural-processed coffees from Yirgacheffe are legendary for their floral intensity.',
    production: '450K',
  },
  {
    code: 'CO', country: 'Colombia', region: 'Americas',
    flag: '🇨🇴', altitude: '1,200–2,000m',
    profile: 'Caramel · Red Apple · Hazelnut',
    note: 'Two harvests a year and a mountain geography that creates distinctive micro-climates for exceptional balance.',
    production: '860K',
  },
  {
    code: 'BR', country: 'Brazil', region: 'Americas',
    flag: '🇧🇷', altitude: '800–1,200m',
    profile: 'Dark Chocolate · Walnut · Brown Sugar',
    note: 'The world\'s largest producer. Low-acid, full-bodied naturals form the backbone of most espresso blends.',
    production: '3.5M',
  },
  {
    code: 'ID', country: 'Indonesia', region: 'Asia-Pacific',
    flag: '🇮🇩', altitude: '1,000–1,700m',
    profile: 'Dark Earth · Cedar · Tobacco',
    note: 'Wet-hulled "Giling Basah" processing gives Sumatran coffees their distinctively deep, syrupy body.',
    production: '660K',
  },
  {
    code: 'GT', country: 'Guatemala', region: 'Americas',
    flag: '🇬🇹', altitude: '1,300–2,000m',
    profile: 'Toffee · Dark Cherry · Spice',
    note: 'Volcanic soil and cool highland air create complex coffees. Antigua is the country\'s most celebrated region.',
    production: '210K',
  },
  {
    code: 'YE', country: 'Yemen', region: 'Arabia',
    flag: '🇾🇪', altitude: '1,500–2,500m',
    profile: 'Wine · Dried Fruit · Cardamom',
    note: 'Ancient terraced farms and heirloom varieties make Yemeni coffees some of the rarest in the world.',
    production: '22K',
  },
];

function initOriginsExplorer() {
  const container = document.querySelector('.origins__explorer');
  if (!container) return;

  const grid   = container.querySelector('.origins__grid');
  const detail = container.querySelector('.origins__detail');

  let activeCode = null;

  // Build cards
  ORIGINS_DATA.forEach((origin, i) => {
    const card = document.createElement('button');
    card.className = 'origins__card';
    card.dataset.code = origin.code;
    card.setAttribute('type', 'button');
    card.setAttribute('aria-expanded', 'false');
    card.innerHTML = `
      <span class="origins__card-flag">${origin.flag}</span>
      <span class="origins__card-name">${origin.country}</span>
      <span class="origins__card-region">${origin.region}</span>
    `;

    card.addEventListener('click', () => {
      const isAlreadyActive = activeCode === origin.code;

      // Reset all cards
      grid.querySelectorAll('.origins__card').forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-expanded', 'false');
      });

      if (isAlreadyActive) {
        // activeCode = null;
        // gsap.to(detail, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.in',
        //   onComplete: () => { detail.hidden = true; detail.innerHTML = ''; }
        // });
        return;
      }

      card.classList.add('is-active');
      card.setAttribute('aria-expanded', 'true');
      activeCode = origin.code;

      detail.hidden = false;
      detail.innerHTML = `
        <div class="origins__detail-inner">
          <div class="origins__detail-header">
            <span class="origins__detail-flag">${origin.flag}</span>
            <div>
              <h4 class="origins__detail-country">${origin.country}</h4>
              <span class="origins__detail-region">${origin.region}</span>
            </div>
          </div>
          <div class="origins__detail-meta">
            <div class="origins__meta-item">
              <span class="origins__meta-label">Altitude</span>
              <span class="origins__meta-value">${origin.altitude}</span>
            </div>
            <div class="origins__meta-item">
              <span class="origins__meta-label">Production</span>
              <span class="origins__meta-value">${origin.production} bags/yr</span>
            </div>
          </div>
          <div class="origins__detail-profile">
            <span class="origins__profile-label">Tasting Notes</span>
            <span class="origins__profile-tags">${origin.profile}</span>
          </div>
          <p class="origins__detail-note">${origin.note}</p>
        </div>
      `;

      gsap.fromTo(detail,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
      );
    });

    // Stagger entrance
    if (!prefersReducedMotion) {
      gsap.from(card, {
        opacity: 0, y: 24, scale: 0.95,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.08 * i,
        scrollTrigger: { trigger: '#section-origin', start: 'top 70%' },
      });
    }

    grid.appendChild(card);
  });
}



/* ============================================================
   9. MODULE: HARVEST CHERRY FLOAT
   Continuous gentle float on the cherry group —
   organic, not mechanical: each cherry has a slight
   individual offset so they move independently.
   ============================================================ */

function initCherryFloat() {
  const group    = qs('[data-gsap="cherry-float"]');
  const cherries = qsa('.harvest__cherry', group || document);

  if (!group) return;
  if (prefersReducedMotion) return;

  // Float the whole group — slow drift
  gsap.to(group, {
    y:        -12,
    rotation: 3,
    duration: 3.2,
    ease:     'sine.inOut',
    yoyo:     true,
    repeat:   -1,
  });

  // Each cherry has a subtle individual micro-float for organic feel
  cherries.forEach((cherry, i) => {
    gsap.to(cherry, {
      y:        -(4 + i * 1.5),
      x:        (i % 2 === 0 ? 2 : -2),
      rotation: (i % 2 === 0 ? 4 : -3),
      duration: 2.2 + i * 0.3,
      ease:     'sine.inOut',
      yoyo:     true,
      repeat:   -1,
      delay:    i * 0.18,
    });
  });
}


/* ============================================================
   10. MODULE: SECTION REVEAL (ScrollTrigger)
   Each section fires a staggered timeline on scroll enter.
   ============================================================ */

function initSectionReveals() {
  if (prefersReducedMotion) return;

  const sections = qsa('[data-gsap="section-reveal"]');

  sections.forEach((section) => {
    const number = qs('.stage__number',           section);
    const title  = qs('[data-gsap="text-reveal"]', section);
    const body   = qs('.stage__body',              section);
    const visual = qs('[data-gsap="visual-enter"]', section);
    const stat   = qs('[data-gsap="stat-count"]',  section);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:       section,
        ...CONFIG.scrollTrigger,
      },
    });

    if (number) {
      tl.from(number, {
        opacity:  0,
        x:        -16,
        duration: CONFIG.dur.mid,
        ease:     CONFIG.ease.out,
      });
    }

    if (title) {
      tl.from(title, {
        opacity:  0,
        y:        40,
        duration: CONFIG.dur.slow,
        ease:     CONFIG.ease.expo,
      }, '-=0.3');
    }

    if (body) {
      tl.from(body, {
        opacity:  0,
        y:        24,
        duration: CONFIG.dur.mid,
        ease:     CONFIG.ease.out,
      }, '-=0.5');
    }

    if (stat) {
      tl.from(stat, {
        opacity:  0,
        y:        20,
        duration: CONFIG.dur.mid,
        ease:     CONFIG.ease.back,
      }, '-=0.3');
    }

    if (visual) {
      // Visual slides in from opposite side to content
      const isReversed = !!section.querySelector('.stage__inner--reverse');
      tl.from(visual, {
        opacity:  0,
        x:        isReversed ? 60 : -60,
        scale:    0.95,
        duration: CONFIG.dur.slow,
        ease:     CONFIG.ease.expo,
      }, '<0.2');
    }
  });
}


/* ============================================================
   11. MODULE: STAT COUNT-UP
   ============================================================ */

function initStatCountUps() {
  qsa('[data-count-target]').forEach((el) => {
    const target   = parseInt(el.dataset.countTarget, 10);
    const duration = target > 100000 ? 2.5 : 1.8;
    let   fired    = false;

    ScrollTrigger.create({
      trigger: el,
      start:   'top 85%',
      onEnter() {
        if (fired) return;
        fired = true;
        prefersReducedMotion
          ? (el.textContent = formatNumber(target, target))
          : animateCount(el, target, duration);
      },
    });
  });

  // Final hero stat — separate bigger moment
  const finalEl = qs('.final-stat__number');
  if (!finalEl) return;
  const finalTarget = parseInt(finalEl.dataset.countTarget, 10);
  let finalFired = false;

  ScrollTrigger.create({
    trigger: finalEl,
    start:   'top 85%',
    onEnter() {
      if (finalFired) return;
      finalFired = true;
      if (prefersReducedMotion) {
        finalEl.textContent = '2B';
        return;
      }
      gsap.from(finalEl, {
        scale:    0.8,
        opacity:  0,
        duration: CONFIG.dur.mid,
        ease:     CONFIG.ease.back,
      });
      animateCount(finalEl, finalTarget, 3);
    },
  });
}


/* ============================================================
   12. MODULE: ROAST INTERACTION
   Click roast button → GSAP tweens bean background colour
   + micro bounce for tactile feedback.
   ============================================================ */

function initRoastInteraction() {
  const bean    = qs('[data-gsap="roast-bean"]');
  const buttons = qsa('.roast__level');
  if (!bean || !buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.roast;
      const data  = CONFIG.roastLevels[level];
      if (!data) return;

      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      if (prefersReducedMotion) {
        gsap.set(bean, { backgroundColor: data.colour });
        return;
      }

      gsap.to(bean, {
        backgroundColor: data.colour,
        duration:        CONFIG.dur.slow,
        ease:            CONFIG.ease.inOut,
      });

      gsap.fromTo(
        bean,
        { scale: 0.92 },
        { scale: 1, duration: CONFIG.dur.mid, ease: CONFIG.ease.back }
      );
    });
  });
}


/* ============================================================
   13. MODULE: BREW CARDS
   Staggered scroll entrance.
   ============================================================ */

function initBrewCards() {
  const cards = qsa('[data-gsap="brew-card-item"]');
  if (!cards.length || prefersReducedMotion) return;

  gsap.from(cards, {
    opacity:  0,
    y:        50,
    scale:    0.96,
    duration: CONFIG.dur.slow,
    ease:     CONFIG.ease.expo,
    stagger:  0.12,
    scrollTrigger: {
      trigger:       '[data-gsap="brew-cards-stagger"]',
      start:         'top 75%',
      toggleActions: 'play none none none',
    },
  });
}


/* ============================================================
   14. MODULE: CUP STEAM
   Cup scales in, steam lines stagger up, CSS loop takes over.
   ============================================================ */

function initCupSteam() {
  const steamLines = qsa('.cup__steam-line');
  const cup        = qs('.cup__illustration');
  if (!steamLines.length) return;

  if (prefersReducedMotion) {
    gsap.set(steamLines, { opacity: 0.3 });
    return;
  }

  if (cup) {
    gsap.from(cup, {
      opacity:  0,
      scale:    0.8,
      y:        30,
      duration: CONFIG.dur.slow,
      ease:     CONFIG.ease.back,
      scrollTrigger: { trigger: '#section-cup', start: 'top 70%' },
    });
  }

  gsap.from(steamLines, {
    opacity:         0,
    scaleY:          0,
    transformOrigin: 'bottom center',
    duration:        CONFIG.dur.slow,
    ease:            CONFIG.ease.out,
    stagger:         0.2,
    delay:           0.4,
    scrollTrigger:   { trigger: '#section-cup', start: 'top 65%' },
  });

  const cupTitle = qs('.cup__title');
  if (cupTitle) {
    gsap.from(cupTitle, {
      opacity:  0,
      y:        40,
      duration: CONFIG.dur.slow,
      ease:     CONFIG.ease.expo,
      scrollTrigger: { trigger: '#section-cup', start: 'top 70%' },
    });
  }
}


/* ============================================================
   EXTRA MODULE: FLAVOUR WHEEL (interactive)
   Hover a segment to highlight a taste category.
   ============================================================ */

function initFlavourWheel() {
  const wheel = qs('.flavour-wheel');
  if (!wheel) return;

  const segments = qsa('.fwheel__segment', wheel);
  const label    = qs('.fwheel__centre-label', wheel);
  const desc     = qs('.fwheel__centre-desc', wheel);

  const FLAVOURS = [
    { name: 'Fruity',    desc: 'Berry, citrus, stone fruit & tropical notes',   color: '#e05050' },
    { name: 'Floral',    desc: 'Rose, jasmine, lavender & chamomile aromas',    color: '#c86eb4' },
    { name: 'Sweet',     desc: 'Caramel, honey, vanilla & brown-sugar warmth',  color: '#c8843a' },
    { name: 'Nutty',     desc: 'Hazelnut, walnut, almond & toasted grain',      color: '#a07040' },
    { name: 'Chocolatey',desc: 'Dark chocolate, cocoa powder & bittersweet',    color: '#7b4a1e' },
    { name: 'Spicy',     desc: 'Cinnamon, clove, black pepper & cardamom',      color: '#8b3a3a' },
    { name: 'Earthy',    desc: 'Cedar, tobacco, leather & forest floor',        color: '#4a6040' },
    { name: 'Sour/Fermented', desc: 'Wine, tamarind, kombucha & vinegar tang', color: '#6a8030' },
  ];

  segments.forEach((seg, i) => {
    const d = FLAVOURS[i % FLAVOURS.length];
    seg.style.setProperty('--seg-color', d.color);
    seg.dataset.name = d.name;

    seg.addEventListener('mouseenter', () => {
      segments.forEach(s => s.classList.remove('is-active'));
      seg.classList.add('is-active');
      label.textContent = d.name;
      desc.textContent  = d.desc;
      gsap.fromTo([label, desc], { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: 'power2.out' });
    });

    seg.addEventListener('mouseleave', () => {
      seg.classList.remove('is-active');
      label.textContent = 'Hover a\nsegment';
      desc.textContent  = 'Explore the coffee flavour wheel';
    });
  });
}

/* ============================================================
   EXTRA MODULE: BREW RATIO CALCULATOR
   ============================================================ */

function initRatioCalc() {
  const calc = qs('.ratio-calc');
  if (!calc) return;

  const coffeeInput = qs('.ratio-calc__coffee', calc);
  const ratioSelect = qs('.ratio-calc__ratio', calc);
  const waterOut    = qs('.ratio-calc__water-out', calc);
  const cupsOut     = qs('.ratio-calc__cups-out', calc);

  function update() {
    const coffee = parseFloat(coffeeInput.value) || 0;
    const ratio  = parseFloat(ratioSelect.value)  || 16;
    const water  = coffee * ratio;
    const cups   = water / 240;

    gsap.fromTo(waterOut, { scale: 1.12, color: '#e0a85a' }, { scale: 1, color: '#c8843a', duration: 0.35, ease: 'power2.out' });

    waterOut.textContent = `${Math.round(water)} ml`;
    cupsOut.textContent  = `≈ ${cups < 1 ? cups.toFixed(1) : Math.round(cups)} cup${cups !== 1 ? 's' : ''}`;
  }

  coffeeInput.addEventListener('input', update);
  ratioSelect.addEventListener('change', update);
  update();
}


/* ============================================================
   15. INIT
   ============================================================ */

function init() {
  if (typeof gsap === 'undefined') {
    console.warn('[coffee-journey] GSAP not found. Animations skipped.');
    return;
  }

  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.defaults({ markers: false });

  initProgressBar();
  initStageNav();
  initHero();
  initThreeJS();
  initOriginsExplorer();
  initFlavourWheel();
  initRatioCalc();
  initCherryFloat();
  initSectionReveals();
  initStatCountUps();
  initRoastInteraction();
  initBrewCards();
  initCupSteam();

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  console.log('[coffee-journey] Initialised ✓');
}

document.addEventListener('DOMContentLoaded', init);
