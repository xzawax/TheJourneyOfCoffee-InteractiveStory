/* ============================================================
   COMPONENT: origins-explorer.js
   Interactive country cards — click to reveal tasting notes,
   altitude, and production stats for major coffee origins.

   Dependencies:
     - gsap (for card entrance + detail panel animation)
     - ScrollTrigger (registered before this runs)

   HTML hook:
     <div class="origins__explorer">
       <div class="origins__grid"></div>
       <div class="origins__detail" hidden></div>
     </div>

   Options (pass as plain object to initOriginsExplorer):
     data           {Array}   Override the default origins dataset
     scrollTrigger  {string}  ScrollTrigger start value for card entrance
                              default: '#section-origin'

   Usage:
     // bare — all defaults
     initOriginsExplorer();

     // custom scroll trigger section
     initOriginsExplorer({ scrollTrigger: '#my-section' });

     // custom data (must match the shape below)
     initOriginsExplorer({ data: myOriginsArray });
   ============================================================ */

const ORIGINS_DEFAULT_DATA = [
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
    note: "The world's largest producer. Low-acid, full-bodied naturals form the backbone of most espresso blends.",
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
    note: "Volcanic soil and cool highland air create complex coffees. Antigua is the country's most celebrated region.",
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

function initOriginsExplorer(options = {}) {
  const {
    data          = ORIGINS_DEFAULT_DATA,
    scrollTrigger = '#section-origin',
  } = options;

  const wrapper = document.querySelector('.origins__explorer');
  if (!wrapper) return;

  const grid   = wrapper.querySelector('.origins__grid');
  const detail = wrapper.querySelector('.origins__detail');
  if (!grid || !detail) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeCode = null;

  // ── Build cards ────────────────────────────────────────────
  data.forEach((origin, i) => {
    const card = document.createElement('button');
    card.className = 'origins__card';
    card.dataset.code = origin.code;
    card.type = 'button';
    card.setAttribute('aria-expanded', 'false');
    card.innerHTML = `
      <span class="origins__card-flag">${origin.flag}</span>
      <span class="origins__card-name">${origin.country}</span>
      <span class="origins__card-region">${origin.region}</span>
    `;

    // ── Click handler ───────────────────────────────────────
    card.addEventListener('click', () => {
      if (activeCode === origin.code) return; // already open — do nothing

      // Deactivate previous card
      grid.querySelectorAll('.origins__card').forEach((c) => {
        c.classList.remove('is-active');
        c.setAttribute('aria-expanded', 'false');
      });

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

    // ── Stagger entrance on scroll ──────────────────────────
    if (!prefersReduced) {
      gsap.from(card, {
        opacity: 0, y: 24, scale: 0.95,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.08 * i,
        scrollTrigger: { trigger: scrollTrigger, start: 'top 70%' },
      });
    }

    grid.appendChild(card);
  });
}
export { ORIGINS_DEFAULT_DATA };
export default initOriginsExplorer;
