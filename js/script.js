/* ── CURSOR ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const dot = document.getElementById('cursor-dot');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function loop() {
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  rx += (mx - rx) * .13; ry += (my - ry) * .13;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, .proj-card, .sk-card, .edu-card, .cert-item, .exp-bullet, .c-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width = '20px'; cur.style.height = '20px';
    cur.style.background = 'var(--gold)';
    ring.style.width = '58px'; ring.style.height = '58px';
    ring.style.borderColor = 'rgba(232,184,75,.5)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width = '12px'; cur.style.height = '12px';
    cur.style.background = 'var(--teal)';
    ring.style.width = '40px'; ring.style.height = '40px';
    ring.style.borderColor = 'rgba(15,212,200,.4)';
  });
});

/* ── STARFIELD CANVAS ── */
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

const stars = Array.from({ length: 160 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.1 + .2,
  a: Math.random(),
  da: (.001 + Math.random() * .003) * (Math.random() > .5 ? 1 : -1),
  speed: Math.random() * .12 + .025,
  isTeal: Math.random() > .55
}));

function draw() {
  ctx.clearRect(0, 0, W, H);
  stars.forEach(s => {
    s.a += s.da;
    if (s.a > 1 || s.a < 0) s.da *= -1;
    s.y -= s.speed;
    if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.isTeal
      ? `rgba(15,212,200,${s.a * .65})`
      : `rgba(232,184,75,${s.a * .45})`;
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();

/* ── FLOATING PARTICLES ── */
const pc = document.getElementById('particle-container');
function spawnParticle() {
  const p = document.createElement('div');
  p.className = 'fp';
  p.style.left = Math.random() * 100 + 'vw';
  const dur = 12 + Math.random() * 14;
  p.style.animationDuration = dur + 's';
  p.style.animationDelay = (Math.random() * 6) + 's';
  const s = .8 + Math.random() * 2.5;
  p.style.width = s + 'px'; p.style.height = s + 'px';
  const isTeal = Math.random() > .45;
  p.style.background = isTeal ? 'rgba(15,212,200,.55)' : 'rgba(232,184,75,.45)';
  if (s > 1.8) p.style.boxShadow = `0 0 ${s * 3}px ${isTeal ? 'rgba(15,212,200,.35)' : 'rgba(232,184,75,.3)'}`;
  pc.appendChild(p);
  setTimeout(() => p.remove(), (dur + 8) * 1000);
}
setInterval(spawnParticle, 700);

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.r-up, .r-left, .r-rgt');
const ro = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const idx = [...revealEls].indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('vis'), idx % 4 * 90);
      ro.unobserve(entry.target);
    }
  });
}, { threshold: .08 });
revealEls.forEach(el => ro.observe(el));

/* ── SKILL BARS ── */
document.querySelectorAll('.bar-fill').forEach(b => {
  b.style.width = (parseFloat(b.dataset.w) * 100) + '%';
});
const barsBox = document.getElementById('barsBox');
const bo = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach((b, i) => {
        setTimeout(() => b.classList.add('in'), i * 130 + 300);
      });
      bo.unobserve(e.target);
    }
  });
}, { threshold: .25 });
if (barsBox) bo.observe(barsBox);

/* ── NAV ACTIVE ── */
const secEls = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  secEls.forEach(s => { if (window.scrollY >= s.offsetTop - 180) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--teal-l)' : '';
  });
}, { passive: true });

/* ── CODE CARD TILT ── */
document.querySelectorAll('.code-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});