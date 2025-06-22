const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Le token expirera après 1 heure
  });
};

module.exports = generateToken;