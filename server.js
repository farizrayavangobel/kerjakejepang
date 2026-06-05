/**
 * ╔══════════════════════════════════════════════════════╗
 *  Server — Kerja ke Jepang Jalur Mandiri Landing Page
 *  Oleh : Fariz Raya Van Gobel
 *  Checkout : http://lynk.id/tamplates.lab/66e36eek8mrz/checkout
 * ╚══════════════════════════════════════════════════════╝
 *
 * Cara pakai:
 *   npm install          → install dependensi
 *   npm start            → jalankan production
 *   npm run dev          → jalankan dengan auto-reload (nodemon)
 *
 * Environment variables (opsional):
 *   PORT=3000            → port server (default: 3000)
 *   NODE_ENV=production  → mode production
 */

const express    = require('express');
const compression = require('compression');
const helmet     = require('helmet');
const path       = require('path');
const fs         = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;
const ENV  = process.env.NODE_ENV || 'development';

// ─────────────────────────────────────────
//  MIDDLEWARE
// ─────────────────────────────────────────

// Gzip — kompres semua respons agar lebih cepat
app.use(compression());

// Helmet — security headers (CSP, XSS protection, dll)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc : ["'self'"],
        styleSrc   : [
          "'self'", "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://fonts.cdnfonts.com',
        ],
        fontSrc    : [
          "'self'",
          'https://fonts.gstatic.com',
          'https://fonts.cdnfonts.com',
        ],
        imgSrc     : ["'self'", 'data:', 'blob:'],
        scriptSrc  : ["'self'", "'unsafe-inline'"],
        connectSrc : ["'self'"],
        // Izinkan redirect ke lynk.id saat tombol diklik (frame-ancestors)
        frameSrc   : ["'none'"],
      },
    },
    // Izinkan browser membuka lynk.id dari link target="_blank"
    crossOriginOpenerPolicy: false,
  })
);

// Static files — cache 1 hari di production, no-cache di development
const cacheAge = ENV === 'production' ? '1d' : 0;
app.use(
  express.static(__dirname, {
    maxAge : cacheAge,
    etag   : true,
    index  : false, // kita handle sendiri di route bawah
  })
);

// Logger sederhana
app.use((req, res, next) => {
  const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  console.log(`[${now}]  ${req.method}  ${req.url}`);
  next();
});

// ─────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────

/**
 * GET /
 * Halaman landing page utama
 */
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'kerja-jepang-landing.html');

  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`
      <h1 style="font-family:sans-serif;color:#C1121F;">404 — File tidak ditemukan</h1>
      <p>Pastikan file <strong>kerja-jepang-landing.html</strong> ada di folder yang sama dengan server.js</p>
    `);
  }

  res.sendFile(filePath);
});

/**
 * GET /health
 * Health check — berguna untuk deploy di Railway / Render / VPS
 */
app.get('/health', (req, res) => {
  res.json({
    status    : 'ok',
    env       : ENV,
    uptime_s  : Math.floor(process.uptime()),
    timestamp : new Date().toISOString(),
  });
});

/**
 * Semua route lain → redirect ke halaman utama
 */
app.use((req, res) => {
  res.redirect(301, '/');
});

// ─────────────────────────────────────────
//  ERROR HANDLER
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).send('<h1>500 — Terjadi kesalahan pada server.</h1>');
});

// ─────────────────────────────────────────
//  START
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('  🗾  Kerja ke Jepang — Landing Page Server');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`  ✅  Mode       : ${ENV}`);
  console.log(`  🌐  URL        : http://localhost:${PORT}`);
  console.log(`  🔍  Health     : http://localhost:${PORT}/health`);
  console.log(`  🛒  Checkout   : http://lynk.id/tamplates.lab/66e36eek8mrz/checkout`);
  console.log('');
  console.log('  Tekan CTRL+C untuk menghentikan server.');
  console.log('');
});
