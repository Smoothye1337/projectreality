/* ═══════════════════════════════════════════════════════════
   PROJECT REALITY — MTA San Andreas Roleplay
   JavaScript v1.0
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── NAVBAR SCROLL ───────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── HAMBURGER MENU ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
    spans[1].style.cssText = 'opacity: 0';
    spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

// ─── COPY ADDRESS ────────────────────────────────────────
function copyAddr() {
  const addr = document.getElementById('serverAddr')?.textContent;
  if (!addr) return;
  navigator.clipboard.writeText(addr).then(() => {
    const btn = document.getElementById('copyBtn');
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => btn.innerHTML = orig, 1800);
  });
}
window.copyAddr = copyAddr;

// ─── SMOOTH REVEAL ON SCROLL ─────────────────────────────
function initReveal() {
  const items = document.querySelectorAll(
    '.status-card, .feature-card, .server-strip-item, .cta-content'
  );
  items.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(el => observer.observe(el));
}

// ─── ANIMATED COUNTER ────────────────────────────────────
function animateCounter(el, target, duration = 1800, suffix = '') {
  if (!el) return;
  const start = performance.now();
  const from = parseInt(el.textContent.replace(/\D/g, '')) || 0;
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (target - from) * ease) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ─── LIVE DATA SIMULATION ────────────────────────────────
let playerCount = 847;
function simulateLiveData() {
  const delta = Math.floor(Math.random() * 7) - 3;
  playerCount = Math.max(500, Math.min(1000, playerCount + delta));

  const heroEl = document.getElementById('heroPlayers');
  const cardEl = document.getElementById('cardPlayerNum');
  const pingEl = document.getElementById('cardPing');

  if (heroEl) heroEl.textContent = playerCount;
  if (cardEl) cardEl.textContent = playerCount;
  if (pingEl) pingEl.textContent = Math.floor(Math.random() * 8) + 20;

  // update progress bar
  const fill = document.querySelector('.fill-gold');
  if (fill) fill.style.width = (playerCount / 10) + '%';
  const pLabel = document.querySelector('.progress-label');
  if (pLabel) pLabel.textContent = (playerCount / 10).toFixed(1) + '% capacity';
}

// ─── PARTICLE SYSTEM ─────────────────────────────────────
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  function spawnParticle() {
    const p = document.createElement('div');
    const isGold = Math.random() > 0.5;
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 4;
    const dur = Math.random() * 6 + 6;

    p.style.cssText = `
      position: absolute;
      bottom: 0;
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${isGold ? 'rgba(255,194,70,0.8)' : 'rgba(0,255,136,0.8)'};
      box-shadow: 0 0 ${size * 4}px ${isGold ? 'rgba(255,194,70,0.6)' : 'rgba(0,255,136,0.6)'};
      animation: particleFly ${dur}s ${delay}s ease-in infinite;
      pointer-events: none;
    `;
    container.appendChild(p);

    // limit particles
    const particles = container.querySelectorAll('div');
    if (particles.length > 60) particles[0].remove();
  }

  for (let i = 0; i < 20; i++) spawnParticle();
  setInterval(spawnParticle, 800);
}

// ─── LINE CHARTS ─────────────────────────────────────────
function drawChart(canvasId, color, glowColor, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const w = rect.width;
  const h = rect.height;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = { top: 10, bottom: 10, left: 4, right: 4 };

  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const step = iw / (data.length - 1);

  const points = data.map((v, i) => ({
    x: pad.left + i * step,
    y: pad.top + ih - ((v - min) / range) * ih
  }));

  // Gradient fill
  const fillGrad = ctx.createLinearGradient(0, pad.top, 0, h);
  fillGrad.addColorStop(0, glowColor.replace(')', ', 0.25)').replace('rgb', 'rgba'));
  fillGrad.addColorStop(1, 'rgba(0,0,0,0)');

  // Draw fill area
  ctx.beginPath();
  ctx.moveTo(points[0].x, h);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h);
  ctx.closePath();
  ctx.fillStyle = fillGrad;
  ctx.fill();

  // Glow line (wide)
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Bright center line
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.4;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Dot at end
  const last = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fill();
}

// Generate realistic-looking chart data
function genPlayerData() {
  const base = [620, 680, 710, 740, 790, 820, 810, 835, 847, 860, 850, 865, 840, 855, 870, 847, 830, 845, 860, 847, 820, 810, 800, 810];
  return base.map(v => v + (Math.random() - 0.5) * 20);
}

function genPingData() {
  return Array.from({ length: 24 }, () => 20 + Math.random() * 12);
}

function initCharts() {
  const playerData = genPlayerData();
  const pingData = genPingData();

  drawChart('chartPlayers', '#ffc246', 'rgb(255,194,70)', playerData);
  drawChart('chartPerf', '#00ff88', 'rgb(0,255,136)', pingData);

  // Redraw on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawChart('chartPlayers', '#ffc246', 'rgb(255,194,70)', playerData);
      drawChart('chartPerf', '#00ff88', 'rgb(0,255,136)', pingData);
    }, 150);
  });
}

// Animate charts drawing in
function animateChartDraw(canvasId, color, glowColor, data) {
  let frame = 0;
  const totalFrames = 60;

  function tick() {
    const progress = Math.min(frame / totalFrames, 1);
    const ease = 1 - Math.pow(1 - progress, 2);
    const endIndex = Math.max(2, Math.floor(ease * data.length));
    drawChart(canvasId, color, glowColor, data.slice(0, endIndex));
    if (frame < totalFrames) { frame++; requestAnimationFrame(tick); }
    else drawChart(canvasId, color, glowColor, data);
  }
  tick();
}

// ─── CHART CANVAS RESIZE OBSERVER ────────────────────────
function observeChartCanvases() {
  const playerData = genPlayerData();
  const pingData = genPingData();
  let drawn = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !drawn) {
        drawn = true;
        setTimeout(() => {
          animateChartDraw('chartPlayers', '#ffc246', 'rgb(255,194,70)', playerData);
          animateChartDraw('chartPerf', '#00ff88', 'rgb(0,255,136)', pingData);
        }, 300);
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const statusSection = document.getElementById('status');
  if (statusSection) observer.observe(statusSection);
}

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  createParticles();
  observeChartCanvases();

  // Live data updates
  setInterval(simulateLiveData, 5000);

  // Animate hero player count on load
  setTimeout(() => {
    animateCounter(document.getElementById('heroPlayers'), 847, 1600);
  }, 600);
});
