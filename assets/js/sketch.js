/* ============================================================
   Maris Botero — ambient p5.js sketch
   Minimalist floating particles, matching the pastel palette.
   Looks for #p5-ambient; does nothing if the container is missing.
   ============================================================ */

(function () {
  if (typeof window === 'undefined' || typeof p5 === 'undefined') return;

  var container = document.getElementById('p5-ambient');
  if (!container) return;

  // Respect users who prefer reduced motion
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  new p5(function (p) {
    var particles = [];
    var NUM_PARTICLES = 28;
    // palette sampled from main.css
    var palette = [
      [184, 169, 201],  // --color-lavender
      [212, 153, 185],  // --color-accent-soft
      [168, 213, 186],  // --color-mint
      [201, 162, 39]    // --color-gold (rare sparkle)
    ];

    function Particle() {
      this.reset(true);
    }
    Particle.prototype.reset = function (initial) {
      this.x = p.random(p.width);
      this.y = initial ? p.random(p.height) : p.height + 20;
      this.r = p.random(2, 6);
      this.vy = p.random(-0.15, -0.05);
      this.vx = p.random(-0.08, 0.08);
      this.alpha = p.random(40, 120);
      var c = p.random(palette);
      // gold sparkles are rare
      if (c === palette[3] && p.random() > 0.1) c = palette[0];
      this.color = c;
      this.twinkle = p.random(p.TWO_PI);
    };
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.twinkle += 0.02;
      if (this.y < -20 || this.x < -20 || this.x > p.width + 20) {
        this.reset(false);
      }
    };
    Particle.prototype.draw = function () {
      var a = this.alpha + p.sin(this.twinkle) * 25;
      p.noStroke();
      p.fill(this.color[0], this.color[1], this.color[2], a);
      p.circle(this.x, this.y, this.r * 2);
    };

    p.setup = function () {
      var w = container.offsetWidth || window.innerWidth;
      var h = container.offsetHeight || document.documentElement.scrollHeight;
      var c = p.createCanvas(w, h);
      c.parent(container);
      c.style('display', 'block');
      p.noStroke();
      for (var i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());
      if (prefersReducedMotion) p.noLoop();
    };

    p.windowResized = function () {
      var w = container.offsetWidth || window.innerWidth;
      var h = container.offsetHeight || document.documentElement.scrollHeight;
      p.resizeCanvas(w, h);
    };

    p.draw = function () {
      p.clear();
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
    };
  });

  // Keep canvas height in sync with page height on slow-loading content/images
  window.addEventListener('load', function () {
    window.dispatchEvent(new Event('resize'));
  });
})();
