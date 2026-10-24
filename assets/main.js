// Preserve links sent from the previous site. All current pages work without JS.
(() => {
  const routes = {
    '#home': './', '#about': './about/', '#research': './research/',
    '#community': './about/#community',
    '#research/p01': './research/rehabverse/',
    '#research/p02': './research/#eeg-headband',
    '#research/p03': './research/assistive-robot/',
    '#research/p04': './research/#passenger-vr',
    '#research/p05': './research/biomechanics/',
    '#research/p06': './research/#cardiac-vr',
    '#research/p07': './research/#additional-projects',
    '#research/p08': './research/#additional-projects',
    '#research/p09': './research/#competition'
  };
  function redirectLegacyLink() {
    const target = routes[window.location.hash];
    if (target) window.location.replace(target);
  }
  redirectLegacyLink();
  window.addEventListener('hashchange', redirectLegacyLink);
})();
