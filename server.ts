import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Resolve static files directory based on running environment
const staticPath = fs.existsSync(path.join(__dirname, 'index.html')) ? __dirname : process.cwd();
console.log(`[Static Server] Serving content from ${staticPath}`);

app.use(express.static(staticPath));

// Explicit root route
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Explicit routes for pages
const pages = ['about', 'services', 'courses', 'portal', 'student-dashboard', 'admin-dashboard', 'secret-admin-login'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(staticPath, `${page}.html`));
  });
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(staticPath, `${page}.html`));
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`EJaytech Concepts development server running at http://0.0.0.0:${PORT}`);
});
