const crypto = require('crypto');

// Use a 32-byte key for AES-256. In production, store this securely (e.g., env variable)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 chars
const IV_LENGTH = 16; // AES block size

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Return iv + encrypted data, both base64 encoded
  return iv.toString('base64') + ':' + encrypted.toString('base64');
}

// Middleware to encrypt JSON responses
function encryptResponseMiddleware(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    const jsonString = JSON.stringify(data);
    const encrypted = encrypt(jsonString);
    // Send as { encrypted: ... } for frontend to handle
    return originalJson.call(this, { encrypted });
  };
  next();
}

module.exports = encryptResponseMiddleware;
