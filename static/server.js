const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

// Store tokens and associated URLs (use a database in production)
const oneTimeLinks = {};

app.use(express.json());

// Endpoint to create a one-time link
app.post('/api/generate-once', (req, res) => {
  const { searchUrl } = req.body;
  const token = crypto.randomBytes(16).toString('hex');
  oneTimeLinks[token] = { url: searchUrl, used: false };
  res.json({ oneTimeUrl: `/once/${token}` });
});

// Endpoint to access the one-time link
app.get('/once/:token', (req, res) => {
  const record = oneTimeLinks[req.params.token];
  if (!record) return res.status(404).send('Invalid or expired link.');
  if (record.used) return res.status(410).send('This link has already been used.');
  record.used = true;
  // Redirect to the actual search URL
  res.redirect(record.url);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
