const express = require('express');
const { loginUser, getMe } = require('../controllers/auth_controller'); // Importer les contrôleurs
const { protect } = require('../middleware/auth'); // Importer le middleware de protection

const router = express.Router();

// Route de login (publique)
router.post('/login', loginUser);

// Route pour obtenir le profil de l'utilisateur authentifié (protégée)
router.get('/me', protect, getMe);

module.exports = router;