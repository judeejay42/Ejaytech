import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Parse JSON bodies (required for API requests)
app.use(express.json());

// Resolve static files directory based on running environment
const staticPath = fs.existsSync(path.join(__dirname, 'index.html')) ? __dirname : process.cwd();
console.log(`[Static Server] Serving content from ${staticPath}`);

app.use(express.static(staticPath));
app.use('/admin', express.static(staticPath));

// Secure Admin Authentication Endpoint
app.post('/api/admin/authenticate', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  if (email.toLowerCase() !== 'ejaytechadmin@gmail.com') {
    return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
  }

  // Hash password using secure SHA-256
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const expectedHash = '787e37c94c881a0896822145d4c7d1a77a2327e6eaddd0cda84fc2db5016e19f';

  if (hash === expectedHash) {
    return res.json({ success: true, message: 'Authentication approved.' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
  }
});

// Explicit root route
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Explicit routes for pages
const pages = ['about', 'services', 'courses', 'student', 'admin', 'student-dashboard', 'admin-dashboard', 'admin-portals', 'admin-super-admin', 'admin-centre-admin', 'admin-admissions', 'admin-finance', 'admin-instructor'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(staticPath, `${page}.html`));
  });
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(staticPath, `${page}.html`));
  });
});

// Direct role-based URLs
app.get('/admin/super-admin', (req, res) => {
  res.sendFile(path.join(staticPath, 'admin-super-admin.html'));
});
app.get('/admin/centre-admin', (req, res) => {
  res.sendFile(path.join(staticPath, 'admin-centre-admin.html'));
});
app.get('/admin/admissions', (req, res) => {
  res.sendFile(path.join(staticPath, 'admin-admissions.html'));
});
app.get('/admin/finance', (req, res) => {
  res.sendFile(path.join(staticPath, 'admin-finance.html'));
});
app.get('/admin/instructor', (req, res) => {
  res.sendFile(path.join(staticPath, 'admin-instructor.html'));
});
app.get('/admin/portals', (req, res) => {
  res.sendFile(path.join(staticPath, 'admin-portals.html'));
});

// Map student directory and registrations pages to serve the admin dashboard
const adminSubPages = ['students', 'registrations'];
adminSubPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(staticPath, 'admin-dashboard.html'));
  });
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(staticPath, 'admin-dashboard.html'));
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`EJaytech Concepts development server running at http://0.0.0.0:${PORT}`);
});
