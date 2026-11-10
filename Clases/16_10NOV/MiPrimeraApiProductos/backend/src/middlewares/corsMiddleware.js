const cors = require('cors');

module.exports = cors({
  origin: 'https://localhost:5051',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});