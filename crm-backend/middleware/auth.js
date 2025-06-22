const jwt = require('jsonwebtoken');
const User = require('../models/user_model'); // Import du modèle User

// Middleware pour protéger les routes
const protect = async (req, res, next) => {
  let token;

  // Vérifier si un token est présent dans l'en-tête Authorization (Bearer Token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraire le token (sans "Bearer")
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trouver l'utilisateur correspondant au token décodé et l'attacher à l'objet req
      // Exclure le mot de passe
      req.user = await User.findById(decoded.id).select('-password');
      req.user.role = decoded.role; // Assurez-vous que le rôle est aussi attaché

      next(); // Passer au middleware ou à la route suivante
    } catch (error) {
      console.error('Token non autorisé, échec du token', error.message);
      res.status(401).json({ message: 'Non autorisé, token invalide ou expiré' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Non autorisé, pas de token' });
  }
};

module.exports = { protect };