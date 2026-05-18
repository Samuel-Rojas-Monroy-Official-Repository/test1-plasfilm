/* ══════════════════════════════════════
   PORTAFOLIO DE SERVICIOS — main.js
   ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR PERSONALIZADO ── */
  const cursor = document.getElementById('cursor');
  if (cursor && window.innerWidth > 900) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .precio-card, .addon-card, .proceso-step').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('big'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });
  }

  /* ── SCROLL PROGRESS BAR ── */
  const line = document.getElementById('scroll-line');
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    if (line) line.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });

  /* ── NAV SCROLL EFFECT + ACTIVE LINK ── */
  const navbar = document.querySelector('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, { passive: true });

  /* ── REVEAL AL SCROLL ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── STAGGER EN GRIDS ── */
  function stagger(selector) {
    const items = document.querySelectorAll(selector);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const i = [...items].indexOf(e.target);
          e.target.style.transitionDelay = (i * 0.07) + 's';
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(el => { el.classList.add('reveal'); obs.observe(el); });
  }
  stagger('.precio-card');
  stagger('.addon-card');
  stagger('.skill-tag');

  /* ── TYPEWRITER HERO ── */
  const tw = document.getElementById('hero-typewriter');
  if (tw) {
    const strings = [
      'Sitios web que venden.',
      'Animaciones que impresionan.',
      'Código que funciona.',
      'Presencia digital real.',
    ];
    let si = 0, ci = 0, del = false;
    function tick() {
      const s = strings[si];
      tw.textContent = s.slice(0, ci);
      if (!del && ci === s.length) { setTimeout(() => { del = true; tick(); }, 2000); return; }
      if (del && ci === 0) { del = false; si = (si + 1) % strings.length; }
      ci += del ? -1 : 1;
      setTimeout(tick, del ? 28 : 58);
    }
    tick();
  }

  /* ── TRES.JS HERO CANVAS (partículas) ── */
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas && window.innerWidth > 600) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => initHeroScene(heroCanvas);
    document.head.appendChild(script);
  }

  function initHeroScene(container) {
    const W = container.clientWidth, H = container.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 7;

    const count = 200;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 14;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x6B7A3E, size: 0.04, transparent: true, opacity: 0.7
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const lineMat = new THREE.LineBasicMaterial({ color: 0x6B7A3E, transparent: true, opacity: 0.08 });
    for (let i = 0; i < count; i += 4) {
      const lg = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pos[i*3], pos[i*3+1], pos[i*3+2]),
        new THREE.Vector3(pos[(i+1)*3] || 0, pos[(i+1)*3+1] || 0, pos[(i+1)*3+2] || 0)
      ]);
      scene.add(new THREE.Line(lg, lineMat));
    }

    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.0008;
      points.rotation.y += (mouse.x - points.rotation.y) * 0.03;
      points.rotation.x += (-mouse.y - points.rotation.x) * 0.03;
      points.rotation.z = t * 0.1;
      mat.opacity = 0.5 + Math.sin(t * 3) * 0.15;
      renderer.render(scene, camera);
    }
    animate();
  }

  /* ── HOVER MAGNÉTICO BOTONES ── */
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  /* ── FORMULARIO CONTACTO (EmailJS) ── */
  const EMAILJS_PUBLIC_KEY  = 'Mcf9pW4nKx3JoFjeF';
  const EMAILJS_SERVICE_ID  = 'service_zq1gnov';
  const EMAILJS_TEMPLATE_ID = 'template_glb5tyb';

  if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

  const formBtn = document.getElementById('formBtn');
  const formOk  = document.getElementById('formOk');

  if (formBtn) {
    formBtn.addEventListener('click', () => {
      const nombre  = document.getElementById('cNombre')?.value?.trim() || 'Sin nombre';
      const email   = document.getElementById('cEmail')?.value?.trim();
      const empresa = document.querySelectorAll('#contacto input')[1]?.value?.trim() || '—';
      const plan    = document.querySelector('#contacto select')?.value || '—';
      const mensaje = document.querySelector('#contacto textarea')?.value?.trim() || '—';

      if (!email) { document.getElementById('cEmail')?.focus(); return; }

      formBtn.textContent = 'Enviando...';
      formBtn.disabled = true;

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  nombre,
        from_email: email,
        empresa,
        plan,
        mensaje,
      })
      .then(() => {
        formBtn.style.display = 'none';
        if (formOk) formOk.classList.add('show');
      })
      .catch(() => {
        formBtn.textContent = 'Enviar mensaje';
        formBtn.disabled = false;
        alert('Error al enviar. Escríbeme por WhatsApp directamente.');
      });
    });
  }

  /* ── SMOOTH SCROLL INTERNO ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 60, behavior: 'smooth' });
    });
  });

});
