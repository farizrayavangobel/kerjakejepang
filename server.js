const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security & Performance Middleware ──
app.use(compression()); // Gzip compression
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://fonts.cdnfonts.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
          'https://fonts.cdnfonts.com',
        ],
        imgSrc: ["'self'", 'data:', 'blob:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// ── Static Files ──
app.use(
  express.static(__dirname, {
    maxAge: '1d', // cache static assets for 1 day
    etag: true,
  })
);

// ── Routes ──

// Landing page utama
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'kerja-jepang-landing.html');

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('<h1>404 – File landing page tidak ditemukan.</h1>');
  }

  res.sendFile(filePath);
});

// Health check (berguna untuk deploy di Railway / Render / VPS)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Redirect semua route lain ke halaman utama
app.use((req, res) => {
  res.redirect('/');
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`✅  Server berjalan di http://localhost:${PORT}`);
  console.log(`📄  Landing page: http://localhost:${PORT}/`);
  console.log(`🔍  Health check: http://localhost:${PORT}/health`);
  console.log(`\nTekan CTRL+C untuk menghentikan server.\n`);
});
