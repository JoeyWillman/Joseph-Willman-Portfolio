/* js/maps.js
 * Renders the projects grid on Maps.html from data/projects.json
 * - Each card is a single clickable element (no nested links)
 * - Fixes "wrong project opens" issue
 * - Graceful image fallback and no 404 noise
 */

(function () {
  const DATA_URL = 'data/projects.json';
  const GRID_ID = 'projectGrid';

  // Utility to safely escape HTML
  function escapeHtml(str = '') {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[m]));
  }

  // Card HTML template
  function cardTemplate(p) {
    const href = `project.html?p=${encodeURIComponent(p.slug)}`;
    const title = escapeHtml(p.title || '');
    const theme = p.theme ? `<p class="text-muted small mb-0">${escapeHtml(p.theme)}</p>` : '';
    const img = p.image ? escapeHtml(p.image) : 'assets/placeholder.png';

    return `
      <a class="map-card card-link" href="${href}" aria-label="Open ${title}">
        <img
          src="${img}"
          alt="${title}"
          loading="lazy"
          onerror="this.onerror=null;this.src='assets/placeholder.png';"
        >
        <div class="map-card-body">
          <h5>${title}</h5>
          ${theme}
        </div>
        <div class="map-card-footer">
          <span class="btn btn-primary">See Detail</span>
        </div>
      </a>
    `;
  }

  // Render all projects
  function render(projects) {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = `
        <div class="alert alert-warning" role="alert">
          No projects found. Add items to <code>data/projects.json</code>.
        </div>`;
      return;
    }

    // Sort by "order" (desc) then alphabetically
    projects.sort(
      (a, b) =>
        (b.order ?? 0) - (a.order ?? 0) ||
        String(a.title).localeCompare(String(b.title))
    );

    grid.innerHTML = projects.map(cardTemplate).join('');
  }

  // Load project data
  async function init() {
    try {
      const res = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
      const data = await res.json();
      render(data);
    } catch (err) {
      console.error(err);
      const grid = document.getElementById(GRID_ID);
      if (grid) {
        grid.innerHTML = `
          <div class="alert alert-danger" role="alert">
            There was a problem loading projects. Please try again later.
          </div>`;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
