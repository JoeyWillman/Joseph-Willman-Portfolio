/* js/project.js
 * Renders a single project on project.html?p=<slug>
 * - Shows title, theme, description, "View Project" (if link), and either iframe or image
 * - Updates <title> dynamically
 * - Graceful not-found state with a backlink
 */

(function () {
  const DATA_URL = 'data/projects.json';
  const CONTAINER_ID = 'projectContainer';

  const $ = (sel, root = document) => root.querySelector(sel);

  function escapeHtml(str = '') {
    return str.replace(/[&<>"']/g, m => (
      { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]
    ));
  }

  function getSlug() {
    const params = new URLSearchParams(location.search);
    return params.get('p') || '';
  }

  function projectNotFound(slug) {
    const el = document.getElementById(CONTAINER_ID);
    if (!el) return;
    el.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Project “${escapeHtml(slug || '(none)')}” not found.
        <a href="Maps.html" class="alert-link">Back to all maps</a>.
      </div>
    `;
    document.title = 'Project Not Found | Joseph Willman';
  }

  function renderProject(p) {
    const el = document.getElementById(CONTAINER_ID);
    if (!el) return;

    const themeLine = p.theme ? `<p class="text-muted mb-2">${escapeHtml(p.theme)}</p>` : '';
    const description = p.description ? `<p class="portfolio-description">${escapeHtml(p.description)}</p>` : '';
    const liveBtn = p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="btn btn-primary me-2">View Project</a>` : '';

    // Prefer iframe embed if provided, else show image
    const media = p.iframe
      ? p.iframe
      : `<img src="${p.image}" alt="${escapeHtml(p.title)}" class="img-fluid rounded shadow-sm" loading="lazy" onerror="this.onerror=null;this.src='assets/placeholder.png';">`;

    el.innerHTML = `
      <h2 class="portfolio-title mb-2">${escapeHtml(p.title)}</h2>
      ${themeLine}
      ${description}
      <div class="mb-3">
        ${liveBtn}
        <a href="Maps.html" class="btn btn-outline-secondary"><i class="fa fa-arrow-left"></i> Back to Maps</a>
      </div>
      <div class="mt-3">${media}</div>
    `;

    // Update document title
    document.title = `${p.title} | Joseph Willman`;
  }

  async function init() {
    const slug = getSlug().trim();
    if (!slug) return projectNotFound(slug);

    try {
      const res = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
      const data = await res.json();

      const project = Array.isArray(data) ? data.find(p => p.slug === slug) : null;
      if (!project) return projectNotFound(slug);

      renderProject(project);
    } catch (err) {
      console.error(err);
      projectNotFound(slug);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
