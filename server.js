const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Use compression to gzip assets
app.use(compression());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'publicfiles')));

// Serve index.html for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'publicfiles', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
