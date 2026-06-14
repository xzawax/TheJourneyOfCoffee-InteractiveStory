/* ============================================================
   components/js/ComponentLoader.js
   Fetches HTML component partials and injects them into
   [data-component="name"] mount points in the DOM.

   Usage in HTML:
     <div data-component="hero-canvas"></div>
     <div data-component="origins-explorer"></div>
     <div data-component="cherry-cluster"></div>

   Usage in JS (await before initing animations):
     import { loadComponents } from './components/js/ComponentLoader.js';
     await loadComponents();
     // now safe to query the injected DOM

   Component files live in: components/html/<name>.html
   ─────────────────────────────────────────────────────────── */

const COMPONENT_DIR = 'components';

/**
 * Fetch a single HTML partial and inject it into a mount element.
 * @param {HTMLElement} mountEl
 * @returns {Promise<void>}
 */
async function loadComponent(mountEl) {
  const name = mountEl.dataset.component;
  if (!name) return;

  try {
    const res  = await fetch(`${COMPONENT_DIR}/${name}.html`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // Strip HTML comments from the partial before injecting
    const cleaned = html.replace(/<!--[\s\S]*?-->/g, '').trim();
    mountEl.outerHTML = cleaned;
  } catch (err) {
    console.warn(`[ComponentLoader] Failed to load "${name}":`, err);
  }
}

/**
 * Find all [data-component] mount points and load them in parallel.
 * Resolves once all components are injected.
 * @returns {Promise<void>}
 */
export async function loadComponents() {
  const mounts = [...document.querySelectorAll('[data-component]')];
  if (!mounts.length) return;
  await Promise.all(mounts.map(loadComponent));
}
