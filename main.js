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
