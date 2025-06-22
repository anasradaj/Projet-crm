const User = require('../models/user_model'); // Import du modèle User
const generateToken = require('../utils/generateToken'); // Import de l'utilitaire de token

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Vérifier si l'utilisateur existe par son email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // 2. Si l'utilisateur existe et le mot de passe correspond, générer un token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role), // Générer et envoyer le token
    });
  } else {
    // 3. Sinon, renvoyer une erreur
    res.status(401).json({ message: 'Email ou mot de passe invalide' });
  }
};

// @desc    Get user profile
// @route   GET /api/me
// @access  Private
const getMe = async (req, res) => {
  // L'utilisateur est déjà dans req.user grâce au middleware d'authentification
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};


module.exports = {
  loginUser,
  getMe,
};