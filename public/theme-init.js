(function () {
  try {
    var stored = localStorage.getItem('theme');
    var mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
