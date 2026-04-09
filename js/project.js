/* js/project.js
 * Renders a single project on project.html?p=<slug>
 * To update project content: edit data/projects.json only.
 */
(function () {
  const DATA_URL     = 'data/projects.json';
  const CONTAINER_ID = 'projectContainer';

  function escapeHtml(str = '') {
    return str.replace(/[&<>"']/g, m => (
      {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]
    ));
  }

  function getSlug() {
    return new URLSearchParams(location.search).get('p') || '';
  }

  function showNotFound(slug) {
    const el = document.getElementById(CONTAINER_ID);
    if (!el) return;
    el.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Project <strong>${escapeHtml(slug || '(none)')}</strong> was not found.
        <a href="Maps.html" class="alert-link ms-2">← Back to all maps</a>
      </div>`;
    document.title = 'Project Not Found | Joseph Willman';
  }

  function renderProject(p) {
    const el = document.getElementById(CONTAINER_ID);
    if (!el) return;

    const theme       = p.theme       ? `<p class="text-muted mb-3">${escapeHtml(p.theme)}</p>` : '';
    const description = p.description ? `<p class="portfolio-description">${escapeHtml(p.description)}</p>` : '';
    const liveBtn     = p.link
      ? `<a href="${escapeHtml(p.link)}" target="_blank" rel="noopener" class="btn btn-primary">
           <i class="fas fa-external-link-alt"></i> View Project
         </a>`
      : '';
    const media = p.iframe
      ? p.iframe
      : `<img src="${escapeHtml(p.image || 'assets/placeholder.png')}" alt="${escapeHtml(p.title)}"
             class="img-fluid rounded" loading="lazy"
             onerror="this.onerror=null;this.src='assets/placeholder.png';" style="box-shadow:0 4px 20px rgba(0,0,0,.12);">`;

    el.innerHTML = `
      <h2 class="portfolio-title">${escapeHtml(p.title)}</h2>
      ${theme}
      ${description}
      <div class="d-flex flex-wrap gap-2 mb-4">
        ${liveBtn}
        <a href="Maps.html" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left"></i> Back to Maps
        </a>
      </div>
      <div>${media}</div>`;

    document.title = `${p.title} | Joseph Willman`;
  }

  async function init() {
    const slug = getSlug().trim();
    if (!slug) return showNotFound(slug);
    try {
      const res  = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const project = Array.isArray(data) ? data.find(p => p.slug === slug) : null;
      if (!project) return showNotFound(slug);
      renderProject(project);
    } catch (err) {
      console.error(err);
      showNotFound(slug);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();