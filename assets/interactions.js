/* Progressive enhancements. Core navigation and content remain plain HTML. */
(() => {
  const root = new URL('../', document.currentScript.src);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const topButton = document.createElement('button');
  topButton.className = 'back-to-top';
  topButton.type = 'button';
  topButton.textContent = '↑';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.hidden = true;
  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    const main = document.getElementById('main');
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
  });
  document.body.append(topButton);

  const tocLinks = Array.from(document.querySelectorAll('.case-nav a'));
  const sections = tocLinks.map(link => document.getElementById(link.hash.slice(1)));
  tocLinks.forEach((link, index) => {
    link.addEventListener('click', event => {
      const section = sections[index];
      if (!section) return;
      event.preventDefault();
      history.replaceState(null, '', link.hash);
      section.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    });
  });
  let scheduled = false;
  function updateScrollState() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    topButton.hidden = window.scrollY < 700;
    document.body.classList.toggle('has-scrolled', window.scrollY > 24);
    let active = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 180) active = index;
    });
    if (sections.length && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60) {
      active = sections.length - 1;
    }
    tocLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function scheduleScrollUpdate() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateScrollState);
    }
  }
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate);
  window.addEventListener('load', scheduleScrollUpdate);
  updateScrollState();

  // Animate only on entry: elements stay visible if JS or observation is unavailable.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('entered-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.hero-copy, .page-heading, .project-row, .independent, .case-content > section').forEach(element => observer.observe(element));
    reducedMotion.addEventListener('change', event => {
      if (event.matches) observer.disconnect();
    });
  }

  const demos = {
    M3AWN9dTlrI: { image: 'robot-pet-preview.jpg', label: 'Robot pet in MuJoCo simulation' },
    icpEim1LvgI: { image: 'assistive-robot-preview.jpg', label: 'Multimodal assistive robot demonstration' }
  };
  document.querySelectorAll('a.video-link').forEach(link => {
    const id = new URL(link.href).searchParams.get('v');
    const demo = demos[id];
    if (!demo) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'demo-block';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'demo-player';
    button.setAttribute('aria-label', `Play ${demo.label}`);
    const img = document.createElement('img');
    img.src = new URL(`assets/${demo.image}`, root).href;
    img.alt = demo.label;
    img.width = 480;
    img.height = 360;
    const play = document.createElement('span');
    play.className = 'demo-play-icon';
    play.textContent = '▶';
    play.setAttribute('aria-hidden', 'true');
    const caption = document.createElement('span');
    caption.className = 'demo-caption';
    caption.textContent = 'Play project demo';
    button.append(img, play, caption);
    const fallback = document.createElement('a');
    fallback.className = 'demo-fallback';
    fallback.href = link.href;
    fallback.textContent = 'Watch on YouTube ↗';
    button.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      frame.title = demo.label;
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.className = 'demo-player';
      button.replaceWith(frame);
      frame.focus();
    }, { once: true });
    wrapper.append(button, fallback);
    link.replaceWith(wrapper);
  });
})();
