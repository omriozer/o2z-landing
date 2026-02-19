// O2Z - Theme System

(function() {
    'use strict';

    // Skip loading animation on subsequent page loads
    if (sessionStorage.getItem('o2z-loaded')) {
        document.getElementById('loading-screen')?.classList.add('hidden');
    } else {
        sessionStorage.setItem('o2z-loaded', 'true');
    }

    // Theme
    const theme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        // Start crossfade
        document.body.classList.add('transitioning');

        // Switch theme halfway
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        }, 2500);

        // End transition
        setTimeout(() => {
            document.body.classList.remove('transitioning');
        }, 5000);
    });

})();
