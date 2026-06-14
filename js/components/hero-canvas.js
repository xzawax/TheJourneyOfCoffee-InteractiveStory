/* ============================================================
   COMPONENT: hero-canvas.js
   3D coffee bean rendered with Three.js.

   Dependencies (must be loaded before this file):
     - three.min.js
     - OrbitControls.js  (THREE.OrbitControls)
     - GLTFLoader.js     (THREE.GLTFLoader)
     - gsap + ScrollTrigger (for entrance animation)

   HTML hook:
     <div data-threejs="hero-canvas"></div>

   Options (pass as plain object to initHeroCanvas):
     glbPath        {string}  Path to your .glb file
                              default: 'object/coffee_bean.glb'
     autoSpinSpeed  {number}  Radians per frame  default: 0.004
     cameraZ        {number}  Camera distance     default: 4.5
     beanScale      {number}  Uniform scale       default: 0.5

   Usage:
     // bare — all defaults
     initHeroCanvas();

     // custom glb path
     initHeroCanvas({ glbPath: 'assets/my_bean.glb' });
   ============================================================ */

function initHeroCanvas(options = {}) {
  const {
    glbPath       = 'object/coffee_bean.glb',
    autoSpinSpeed = 0.004,
    cameraZ       = 4.5,
    beanScale     = 0.5,
  } = options;

  const container = document.querySelector('[data-threejs="hero-canvas"]');
  if (!container || typeof THREE === 'undefined') return;

  // ── Scene ──────────────────────────────────────────────────
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, cameraZ);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ── Lighting ───────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xfff3e0, 0.6));

  const keyLight = new THREE.DirectionalLight(0xc8843a, 1.8);
  keyLight.position.set(3, 4, 3);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x3a2010, 0.8);
  rimLight.position.set(-3, -2, -2);
  scene.add(rimLight);

  // ── Bean group ─────────────────────────────────────────────
  const beanGroup = new THREE.Group();
  beanGroup.scale.setScalar(beanScale);
  beanGroup.rotation.z = 1;

  // GLB load
  const loader = new THREE.GLTFLoader();
  loader.load(glbPath, (gltf) => beanGroup.add(gltf.scene));

  // Fallback crease ring (visible before/if GLB loads)
  const creaseMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.04, 16, 80),
    new THREE.MeshStandardMaterial({ color: 0x3b1509, roughness: 0.8 })
  );
  creaseMesh.rotation.x = Math.PI / 2;
  creaseMesh.scale.set(1, 1, 0.01);
  beanGroup.add(creaseMesh);

  scene.add(beanGroup);

  // ── OrbitControls ──────────────────────────────────────────
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom    = false;
  controls.enablePan     = false;
  controls.enabled       = false;
  controls.target.set(0, 0, 0);
  controls.update();

  // ── Interaction state ──────────────────────────────────────
  let isHovered = false;

  // Desktop mouse
  container.addEventListener('mouseenter', () => { controls.enabled = true; });
  container.addEventListener('mousedown',  () => { isHovered = true; controls.enabled = true; });
  container.addEventListener('mouseup',    () => { isHovered = false; });
  container.addEventListener('mouseleave', () => {
    isHovered        = false;
    controls.enabled = false;
  });

  // Touch — distinguish vertical scroll from horizontal orbit drag
  let touchStartX = 0;
  let touchStartY = 0;
  let touchIntent = null; // 'orbit' | 'scroll' | null

  container.addEventListener('touchstart', (e) => {
    touchStartX      = e.touches[0].clientX;
    touchStartY      = e.touches[0].clientY;
    touchIntent      = null;
    controls.enabled = false;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (touchIntent !== null) return;

    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx < 6 && dy < 6) return;

    if (dx > dy) {
      touchIntent      = 'orbit';
      isHovered        = true;
      controls.enabled = true;
    } else {
      touchIntent      = 'scroll';
      controls.enabled = false;
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    touchIntent      = null;
    isHovered        = false;
    controls.enabled = false;
  }, { passive: true });

  // ── Resize ─────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // ── GSAP entrance ──────────────────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    gsap.from(beanGroup.scale, {
      x: 0, y: 0, z: 0,
      duration: 1.6,
      ease: 'elastic.out(1, 0.6)',
      delay: 0.8,
    });
  }

  // ── Render loop ────────────────────────────────────────────
  (function tick() {
    requestAnimationFrame(tick);
    if (!isHovered && !prefersReduced) {
      beanGroup.rotation.y += autoSpinSpeed;
      beanGroup.rotation.x  = Math.sin(Date.now() * 0.0004) * 0.15;
    }
    controls.update();
    renderer.render(scene, camera);
  })();

  // ── Hint tooltip ───────────────────────────────────────────
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (!isTouchDevice) {
    const hint = Object.assign(document.createElement('p'), {
      textContent: 'Drag to rotate',
    });
    hint.style.cssText = [
      'position:absolute', 'bottom:24px', 'left:50%',
      'transform:translateX(-50%)', 'font-size:0.75rem',
      'letter-spacing:0.1em', 'text-transform:uppercase',
      'color:rgba(240,230,211,0.45)', 'pointer-events:none',
      'transition:opacity 0.6s ease', 'margin:0',
    ].join(';');
    // container.style.position = 'relative';
    container.appendChild(hint);
    setTimeout(() => { hint.style.opacity = '0'; }, 3000);
  }
}

export default initHeroCanvas;
