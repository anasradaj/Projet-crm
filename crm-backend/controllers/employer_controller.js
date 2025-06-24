const User = require('../models/user_model');
const Lead = require('../models/lead_model');

// --- Managers ---

// @desc    Liste tous les managers
// @route   GET /api/employer/managers
// @access  Private/Employer
const getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('-password');
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer un nouveau manager
// @route   POST /api/employer/managers
// @access  Private/Employer
const createManager = async (req, res) => {
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
      role: 'manager'
    });
    res.status(201).json({
      _id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mettre à jour un manager
// @route   PUT /api/employer/managers/:managerId
// @access  Private/Employer
const updateManager = async (req, res) => {
  const { managerId } = req.params;
  const { name, email, password } = req.body;

  try {
    const manager = await User.findById(managerId);

    if (!manager || manager.role !== 'manager') {
      return res.status(404).json({ message: 'Manager non trouvé' });
    }

    manager.name = name || manager.name;
    manager.email = email || manager.email;

    if (password) {
      manager.password = password; // Le middleware pre('save') hashra le nouveau mot de passe
    }

    const updatedManager = await manager.save();
    res.json({
      _id: updatedManager._id,
      name: updatedManager.name,
      email: updatedManager.email,
      role: updatedManager.role
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Supprimer un manager
// @route   DELETE /api/employer/managers/:managerId
// @access  Private/Employer
const deleteManager = async (req, res) => {
  const { managerId } = req.params;
  try {
    const manager = await User.findById(managerId);

    if (!manager || manager.role !== 'manager') {
      return res.status(404).json({ message: 'Manager non trouvé' });
    }

    // Optionnel : Vous pourriez aussi supprimer les leads assignés à ce manager ici
    await Lead.deleteMany({ manager: managerId });

    await manager.deleteOne(); // Utiliser deleteOne() sur l'instance trouvée
    res.json({ message: 'Manager et ses leads supprimés avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// --- Leads ---

// @desc    Obtenir tous les leads (avec filtres optionnels)
// @route   GET /api/employer/leads
// @access  Private/Employer
const getLeads = async (req, res) => {
  try {
    const filter = {};
    if (req.query.managerId) {
      filter.manager = req.query.managerId;
    }
    if (req.query.status) {
      filter.status = req.query.status.toUpperCase();
    }
    const leads = await Lead.find(filter).populate('manager', 'name email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer un nouveau lead
// @route   POST /api/employer/leads
// @access  Private/Employer
const createLead = async (req, res) => {
  const { contactName, contactEmail, companyName, status, managerId } = req.body;
  try {
    const lead = await Lead.create({
      contactName,
      contactEmail,
      companyName,
      status: status || 'PENDING',
      manager: managerId
    });
    const populatedLead = await Lead.findById(lead._id).populate('manager', 'name email');
    res.status(201).json(populatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mettre à jour les détails d'un lead
// @route   PUT /api/employer/leads/:leadId
// @access  Private/Employer
const updateLead = async (req, res) => {
  const { leadId } = req.params;
  const { contactName, contactEmail, companyName, status, managerId, notes } = req.body; // Ajouter 'notes' si elles peuvent être éditées ici aussi

  try {
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({ message: 'Lead non trouvé' });
    }

    lead.contactName = contactName || lead.contactName;
    lead.contactEmail = contactEmail || lead.contactEmail;
    lead.companyName = companyName || lead.companyName;
    lead.status = status ? status.toUpperCase() : lead.status;
    lead.manager = managerId || lead.manager;
    lead.notes = notes || lead.notes; // Pourrait être une fusion si vous voulez juste ajouter une note

    const updatedLead = await lead.save();
    // Populer le manager dans la réponse
    const populatedLead = await Lead.findById(updatedLead._id).populate('manager', 'name email');
    res.json(populatedLead);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Supprimer un lead
// @route   DELETE /api/employer/leads/:leadId
// @access  Private/Employer
const deleteLead = async (req, res) => {
  const { leadId } = req.params;
  try {
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({ message: 'Lead non trouvé' });
    }

    await lead.deleteOne(); // Utiliser deleteOne() sur l'instance trouvée
    res.json({ message: 'Lead supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Dashboard ---

// @desc    Obtenir les statistiques du tableau de bord pour l'employeur
// @route   GET /api/employer/dashboard-stats
// @access  Private/Employer
const getDashboardStats = async (req, res) => {
  try {
    // Compter les leads par statut
    const leadsInProgress = await Lead.countDocuments({ status: 'IN_PROGRESS' });
    const leadsCompleted = await Lead.countDocuments({ status: 'COMPLETED' });
    const leadsCanceled = await Lead.countDocuments({ status: 'CANCELED' });
    const totalLeads = await Lead.countDocuments(); // Compte total de tous les leads

    res.json({
      totalLeads,
      leadsInProgress,
      leadsCompleted,
      leadsCanceled,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getManagers,
  createManager,
  updateManager,
  deleteManager,
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getDashboardStats,
};