// crm-backend/routes/employer.routes.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
// Importer les fonctions depuis le contrôleur
const { getManagers, createManager, updateManager, deleteManager,
       getLeads, createLead, updateLead, deleteLead, getDashboardStats
 } = require('../controllers/employer_controller');
// Pour les leads, nous les ajouterons une fois les fonctions correspondantes dans le contrôleur
// const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/employer.controller');


const router = express.Router();

// ----------------------------------------------------
// Routes pour les Managers (Employer peut les gérer)
// ----------------------------------------------------

router.route('/managers')
  .get(protect, authorize('employer'), getManagers) // Utilise la fonction getManagers du contrôleur
  .post(protect, authorize('employer'), createManager); // Utilise la fonction createManager du contrôleur

router.route('/managers/:managerId')
  .put(protect, authorize('employer'), updateManager) // Utilise la fonction updateManager
  .delete(protect, authorize('employer'), deleteManager); // Utilise la fonction deleteManager


// ----------------------------------------------------
// Placeholders pour les Routes des Leads (Nous les ajouterons plus tard)
// ----------------------------------------------------
router.route('/leads')
  .get(protect, authorize('employer'), getLeads)
  .post(protect, authorize('employer'), createLead);

router.route('/leads/:leadId')
  .put(protect, authorize('employer'), updateLead)
  .delete(protect, authorize('employer'), deleteLead);

// --- Routes pour le Dashboard Employer ---
// @desc    Obtenir les statistiques du tableau de bord
// @route   GET /api/employer/dashboard-stats
// @access  Private/Employer
router.get('/dashboard-stats', protect, authorize('employer'), getDashboardStats);


module.exports = router;