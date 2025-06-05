const cors = require('cors');


const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://ocgempc.vercel.app/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);