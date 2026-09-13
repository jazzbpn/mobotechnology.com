/* ═══════════════════════════════════════════════════════
   MOBOTECHNOLOGY — LEGAL PAGES SCRIPT
   Navbar state, mobile menu, table-of-contents toggle and
   active-section tracking. Shared by every legal page.
═══════════════════════════════════════════════════════ */
(() => {
  /* ── Navbar ────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ── Mobile menu ───────────────────────────────── */
  const ham = document.getElementById('ham');
  const mm  = document.getElementById('mmenu');
  const mmc = document.getElementById('mmclose');
  const openMM  = () => { mm.classList.add('open'); document.body.style.overflow = 'hidden'; ham.setAttribute('aria-expanded', 'true'); mmc.focus(); };
  const closeMM = () => { mm.classList.remove('open'); document.body.style.overflow = ''; ham.setAttribute('aria-expanded', 'false'); };
  ham.addEventListener('click', openMM);
  mmc.addEventListener('click', () => { closeMM(); ham.focus(); });
  mm.addEventListener('click', e => e.target === mm && closeMM());
  mm.querySelectorAll('[data-mm]').forEach(l => l.addEventListener('click', closeMM));

  /* ── Table of contents ─────────────────────────── */
  const toc     = document.getElementById('toc');
  const tocBtn  = document.getElementById('tocToggle');
  const links   = toc ? [...toc.querySelectorAll('.toc__link')] : [];
  const desktop = window.matchMedia('(min-width: 1024px)');

  const setToc = open => {
    toc.classList.toggle('open', open);
    tocBtn.setAttribute('aria-expanded', String(open));
  };
  if (tocBtn) {
    tocBtn.addEventListener('click', () => setToc(!toc.classList.contains('open')));
    links.forEach(l => l.addEventListener('click', () => { if (!desktop.matches) setToc(false); }));
  }

  /* Active section highlighting */
  const sections = links
    .map(l => document.getElementById(l.getAttribute('href').slice(1)))
    .filter(Boolean);

  let current = null;
  const setActive = id => {
    if (id === current) return;
    current = id;
    links.forEach(l => {
      const on = l.getAttribute('href') === '#' + id;
      l.classList.toggle('active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
    if (desktop.matches) {
      const active = toc.querySelector('.toc__link.active');
      if (active) {
        const top = active.offsetTop - toc.clientHeight / 2 + active.clientHeight / 2;
        toc.scrollTo({ top, behavior: 'auto' });
      }
    }
  };

  const updateActive = () => {
    if (!sections.length) return;
    const probe = window.scrollY + window.innerHeight * 0.28;
    let cur = sections[0];
    for (const s of sections) if (s.offsetTop <= probe) cur = s;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) cur = sections[sections.length - 1];
    setActive(cur.id);
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateActive(); ticking = false; });
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', updateActive);
  updateActive();

  /* ── Escape key ────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (mm.classList.contains('open')) { closeMM(); ham.focus(); }
    if (toc && !desktop.matches && toc.classList.contains('open')) { setToc(false); tocBtn.focus(); }
  });
})();
