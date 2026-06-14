/* ============================================================
   COMPONENT: cherry-cluster.js
   Organic floating animation for the coffee cherry cluster.
   The whole group drifts gently; each individual cherry has
   its own micro-float offset for a natural, non-mechanical feel.

   Dependencies:
     - gsap

   HTML hooks:
     <div data-gsap="cherry-float">          ← the group wrapper
       <div class="harvest__cherry">...</div> ← individual cherries
       <div class="harvest__cherry">...</div>
       …
     </div>

   Options (pass as plain object to initCherryCluster):
     groupSelector   {string}  Selector for the float group
                               default: '[data-gsap="cherry-float"]'
     cherrySelector  {string}  Selector for individual cherries
                               default: '.harvest__cherry'
     groupDrift      {number}  Max Y drift for the whole group (px)
                               default: 12
     groupRotation   {number}  Max rotation for the group (deg)
                               default: 3
     groupDuration   {number}  Group float cycle duration (s)
                               default: 3.2

   Usage:
     // bare — all defaults
     initCherryCluster();

     // custom selectors (if you reuse this on another page)
     initCherryCluster({
       groupSelector:  '#my-cherries',
       cherrySelector: '.cherry-item',
     });
   ============================================================ */

function initCherryCluster(options = {}) {
  const {
    groupSelector  = '[data-gsap="cherry-float"]',
    cherrySelector = '.harvest__cherry',
    groupDrift     = 12,
    groupRotation  = 3,
    groupDuration  = 3.2,
  } = options;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const group    = document.querySelector(groupSelector);
  if (!group) return;

  const cherries = [...group.querySelectorAll(cherrySelector)];

  // ── Whole-group slow drift ─────────────────────────────────
  gsap.to(group, {
    y:        -groupDrift,
    rotation: groupRotation,
    duration: groupDuration,
    ease:     'sine.inOut',
    yoyo:     true,
    repeat:   -1,
  });

  // ── Per-cherry micro-float ─────────────────────────────────
  // Each cherry gets a unique amplitude and timing so they move
  // independently rather than in unison.
  cherries.forEach((cherry, i) => {
    gsap.to(cherry, {
      y:        -(4 + i * 1.5),
      x:        i % 2 === 0 ?  2 : -2,
      rotation: i % 2 === 0 ?  4 : -3,
      duration: 2.2 + i * 0.3,
      ease:     'sine.inOut',
      yoyo:     true,
      repeat:   -1,
      delay:    i * 0.18,
    });
  });
}
export default initCherryCluster;
