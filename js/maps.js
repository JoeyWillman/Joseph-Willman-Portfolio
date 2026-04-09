/* js/maps.js
 * Renders the projects grid on Maps.html from data/projects.json
 * To add a project: edit data/projects.json only — no JS changes needed.
 */
(function () {
  const DATA_URL  = 'data/projects.json';
  const GRID_ID   = 'projectGrid';

  function escapeHtml(str = '') {
    return str.replace(/[&<>"']/g, m => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[m]));
  }

  function cardTemplate(p) {
    const href  = `project.html?p=${encodeURIComponent(p.slug)}`;
    const title = escapeHtml(p.title || '');
    const theme = p.theme ? `<p>${escapeHtml(p.theme)}</p>` : '';
    const img   = p.image ? escapeHtml(p.image) : 'assets/placeholder.png';

    return `
      <a class="map-card" href="${href}" aria-label="${title}">
        <img src="${img}" alt="${title}" loading="lazy"
             onerror="this.onerror=null;this.src='assets/placeholder.png';">
        <div class="map-card-body">
          <h5>${title}</h5>
          ${theme}
        </div>
        <div class="map-card-footer">
          <span class="btn btn-primary">See Detail</span>
        </div>
      </a>`;
  }

  function render(projects) {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = '<p class="text-muted text-center">No projects found. Add entries to <code>data/projects.json</code>.</p>';
      return;
    }

    projects.sort(
      (a, b) => (b.order ?? 0) - (a.order ?? 0) || String(a.title).localeCompare(String(b.title))
    );

    grid.innerHTML = projects.map(cardTemplate).join('');
  }

  async function init() {
    try {
      const res  = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      render(await res.json());
    } catch (err) {
      console.error(err);
      const grid = document.getElementById(GRID_ID);
      if (grid) grid.innerHTML = '<p class="text-muted text-center">Could not load projects. Please try again later.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();