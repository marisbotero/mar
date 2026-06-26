(function () {
    function initMagicButton() {
        var button = document.querySelector('.theme-dot');
        if (!button) return;

        button.addEventListener('click', function () {
            document.body.classList.toggle('extra-magic');
        });
    }

    function initActiveNav() {
        var links = document.querySelectorAll('.main-nav a[href^="#"]');
        if (!links.length) return;

        links.forEach(function (link) {
            link.addEventListener('click', function () {
                links.forEach(function (item) {
                    item.classList.remove('active');
                });
                link.classList.add('active');
            });
        });
    }

    function initPlayground() {
        var canvas = document.getElementById('magic-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var countInput = document.getElementById('particle-count');
        var speedInput = document.getElementById('particle-speed');
        var paletteInput = document.getElementById('particle-palette');
        var randomButton = document.getElementById('randomize-art');
        var particles = [];
        var frame = 0;
        var palettes = {
            pastel: ['#9a70d7', '#ee6aaa', '#5b9bdc', '#f3c76f'],
            aurora: ['#6a5cff', '#00b8d9', '#ff7ac8', '#79d8a7'],
            starry: ['#171330', '#6f5bd7', '#2e9bea', '#f6d58b']
        };

        function resizeCanvas() {
            var rect = canvas.getBoundingClientRect();
            var ratio = window.devicePixelRatio || 1;
            canvas.width = Math.max(320, Math.floor(rect.width * ratio));
            canvas.height = Math.max(240, Math.floor(rect.height * ratio));
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            createParticles();
        }

        function randomBetween(min, max) {
            return min + Math.random() * (max - min);
        }

        function createParticles() {
            var rect = canvas.getBoundingClientRect();
            var colors = palettes[paletteInput.value] || palettes.pastel;
            var total = parseInt(countInput.value, 10) || 90;
            particles = [];

            for (var i = 0; i < total; i += 1) {
                particles.push({
                    x: randomBetween(0, rect.width),
                    y: randomBetween(0, rect.height),
                    radius: randomBetween(1.2, 3.8),
                    angle: randomBetween(0, Math.PI * 2),
                    orbit: randomBetween(12, Math.min(rect.width, rect.height) * 0.42),
                    color: colors[i % colors.length],
                    drift: randomBetween(0.002, 0.012)
                });
            }
        }

        function draw() {
            var rect = canvas.getBoundingClientRect();
            var speed = (parseInt(speedInput.value, 10) || 4) * 0.002;
            frame += 1;

            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.fillStyle = 'rgba(255, 253, 252, 0.72)';
            ctx.fillRect(0, 0, rect.width, rect.height);

            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            particles.forEach(function (particle, index) {
                particle.angle += speed + particle.drift;
                var wobble = Math.sin(frame * 0.01 + index) * 18;
                var x = centerX + Math.cos(particle.angle) * (particle.orbit + wobble);
                var y = centerY + Math.sin(particle.angle * 1.4) * (particle.orbit * 0.52 + wobble * 0.2);

                ctx.beginPath();
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = 0.64;
                ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
                ctx.fill();

                if (index % 5 === 0) {
                    ctx.beginPath();
                    ctx.strokeStyle = particle.color;
                    ctx.globalAlpha = 0.16;
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(draw);
        }

        countInput.addEventListener('input', createParticles);
        paletteInput.addEventListener('change', createParticles);
        randomButton.addEventListener('click', createParticles);
        window.addEventListener('resize', resizeCanvas);

        resizeCanvas();
        draw();
    }

    function init() {
        initMagicButton();
        initActiveNav();
        initPlayground();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
