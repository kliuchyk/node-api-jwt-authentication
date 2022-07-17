const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to API!',
  });
});

app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    id: 1,
    name: 'mike',
    email: 'mike@gmail.com',
  };

  jwt.sign({ user }, 'secretKey', { expiresIn: '10h' }, (err, token) => {
    res.json({
      token,
    });
  });
});

// protected route
app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created!',
        authData,
      });
    }
  });
});

// verify token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if token is undefined
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;

    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log('Server started on PORT 5000'));
