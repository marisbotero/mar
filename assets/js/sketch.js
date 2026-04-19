/* ============================================================
   Maris Botero — ambient p5.js sketch
   Gentle falling pastel stars. Minimalist, with soft twinkle.
   Looks for #p5-ambient; does nothing if the container is missing.
   ============================================================ */

(function () {
  if (typeof window === 'undefined' || typeof p5 === 'undefined') return;

  var container = document.getElementById('p5-ambient');
  if (!container) return;

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  new p5(function (p) {
    var stars = [];
    var NUM_STARS = 32;

    // Soft pastel palette
    var palette = [
      [245, 194, 214],  // pink
      [212, 197, 227],  // lavender
      [197, 227, 212],  // mint
      [245, 212, 184],  // peach
      [240, 215, 135],  // pastel gold
      [197, 212, 227],  // soft blue
      [227, 197, 218]   // rose
    ];

    function drawStar(x, y, r1, r2, npoints, angleOffset) {
      var angle = p.TWO_PI / npoints;
      var half = angle / 2;
      p.beginShape();
      for (var a = -p.PI / 2 + angleOffset; a < p.TWO_PI - p.PI / 2 + angleOffset; a += angle) {
        p.vertex(x + p.cos(a) * r2, y + p.sin(a) * r2);
        p.vertex(x + p.cos(a + half) * r1, y + p.sin(a + half) * r1);
      }
      p.endShape(p.CLOSE);
    }

    function Star() {
      this.reset(true);
    }
    Star.prototype.reset = function (initial) {
      this.x = p.random(p.width);
      this.y = initial ? p.random(p.height) : -20;
      this.size = p.random(4, 10);
      this.vy = p.random(0.2, 0.6);                // gentle fall
      this.drift = p.random(-0.15, 0.15);          // slight horizontal
      this.phase = p.random(p.TWO_PI);
      this.rotation = p.random(p.TWO_PI);
      this.rotSpeed = p.random(-0.01, 0.01);
      this.alpha = p.random(140, 220);
      this.color = p.random(palette);
      this.points = p.random() > 0.75 ? 4 : 5;     // mostly 5-point, some 4
    };
    Star.prototype.update = function () {
      this.phase += 0.025;
      this.y += this.vy;
      this.x += this.drift + p.sin(this.phase) * 0.15;
      this.rotation += this.rotSpeed;
      if (this.y > p.height + 20 || this.x < -30 || this.x > p.width + 30) {
        this.reset(false);
      }
    };
    Star.prototype.draw = function () {
      var twinkle = 0.75 + p.sin(this.phase * 1.5) * 0.25;
      var a = this.alpha * twinkle;
      p.noStroke();
      p.fill(this.color[0], this.color[1], this.color[2], a);
      drawStar(this.x, this.y, this.size * 0.45, this.size, this.points, this.rotation);
    };

    p.setup = function () {
      var w = container.offsetWidth || window.innerWidth;
      var h = container.offsetHeight || document.documentElement.scrollHeight;
      var c = p.createCanvas(w, h);
      c.parent(container);
      c.style('display', 'block');
      for (var i = 0; i < NUM_STARS; i++) stars.push(new Star());
      if (prefersReducedMotion) p.noLoop();
    };

    p.windowResized = function () {
      var w = container.offsetWidth || window.innerWidth;
      var h = container.offsetHeight || document.documentElement.scrollHeight;
      p.resizeCanvas(w, h);
    };

    p.draw = function () {
      p.clear();
      for (var i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }
    };
  });

  // Re-measure after images finish loading (so canvas covers full page)
  window.addEventListener('load', function () {
    window.dispatchEvent(new Event('resize'));
  });
})();
