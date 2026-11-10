const cors = require('cors');

module.exports = cors({
  origin: ['http://localhost:5052', 'http://127.0.0.1:5052'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});