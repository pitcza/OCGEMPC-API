const cors = require('cors');


const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://ocgempcapi-production.up.railway.app/',
    'http://localhost:4200',
    'https://ocgempc.vercel.app/'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);