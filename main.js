(function () {
    var STORAGE_KEY = 'maris-lang';

    function getStoredLang() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setLang(lang) {
        if (lang !== 'es' && lang !== 'en') return;
        document.body.classList.remove('lang-es', 'lang-en');
        document.body.classList.add('lang-' + lang);
        document.documentElement.lang = lang === 'es' ? 'es' : 'en';
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {}
        var buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(function (btn) {
            var isActive = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function init() {
        var stored = getStoredLang();
        if (stored === 'es' || stored === 'en') {
            setLang(stored);
        } else {
            setLang('es');
        }

        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setLang(btn.getAttribute('data-lang'));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/* ==========================================================
   Scroll reveal — fade + slight rise for titles and content
   marked with .reveal. Uses IntersectionObserver; respects
   prefers-reduced-motion.
   ========================================================== */
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function enable() {
        var targets = document.querySelectorAll('.reveal, .script-title, .section-title, .featured-drop, .prose-lead');
        if (!targets.length) return;

        // If user prefers reduced motion, just show everything.
        if (reduce || !('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        // Mark targets as not-yet-visible
        targets.forEach(function (el) { el.classList.add('reveal'); });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) { observer.observe(el); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enable);
    } else {
        enable();
    }
})();
