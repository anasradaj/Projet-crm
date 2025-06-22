const express = require('express');
const { protect } = require('../middleware/auth'); // Middleware d'authentification
const { authorize } = require('../middleware/role'); // Middleware d'autorisation
const User = require('../models/user_model'); // Pour créer/gérer les managers
const Lead = require('../models/lead_model'); // Pour créer/gérer les leads

const router = express.Router();

// ----------------------------------------------------
// Routes pour les Managers (Employer peut les gérer)
// ----------------------------------------------------

// @desc    Liste tous les managers
// @route   GET /api/employer/managers
// @access  Private/Employer
router.get('/managers', protect, authorize('employer'), async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('-password'); // Exclure les mots de passe
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Créer un nouveau manager
// @route   POST /api/employer/managers
// @access  Private/Employer
router.post('/managers', protect, authorize('employer'), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }
    const manager = await User.create({
      name,
      email,
      password,
      role: 'manager' // S'assurer que le rôle est bien 'manager'
    });
    // Ne pas renvoyer le mot de passe haché dans la réponse
    res.status(201).json({
      _id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----------------------------------------------------
// Routes pour les Leads (Employer a un contrôle total)
// ----------------------------------------------------

// @desc    Obtenir tous les leads (avec filtres optionnels)
// @route   GET /api/employer/leads
// @access  Private/Employer
router.get('/leads', protect, authorize('employer'), async (req, res) => {
  try {
    // Les filtres peuvent être ajoutés ici si nécessaire, ex: par managerId ou status
    const filter = {};
    if (req.query.managerId) {
      filter.manager = req.query.managerId;
    }
    if (req.query.status) {
      filter.status = req.query.status.toUpperCase(); // Assurer que le statut est en majuscules
    }

    const leads = await Lead.find(filter).populate('manager', 'name email'); // Populer le manager pour obtenir son nom et email
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Créer un nouveau lead
// @route   POST /api/employer/leads
// @access  Private/Employer
router.post('/leads', protect, authorize('employer'), async (req, res) => {
  const { contactName, contactEmail, companyName, status, managerId } = req.body;
  try {
    const lead = await Lead.create({
      contactName,
      contactEmail,
      companyName,
      status: status || 'PENDING', // Statut par défaut si non fourni
      manager: managerId // Doit être un ID de manager valide
    });
    // Populer le manager dans la réponse
    const populatedLead = await Lead.findById(lead._id).populate('manager', 'name email');
    res.status(201).json(populatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Pour la mise à jour et la suppression des managers/leads, nous les ajouterons si le temps le permet,
// car Login, Création, Liste, et Vue par manager sont prioritaires pour un MVP.

module.exports = router;