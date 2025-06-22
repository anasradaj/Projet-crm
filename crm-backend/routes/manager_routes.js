const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const Lead = require('../models/lead_model');

const router = express.Router();

// @desc    Obtenir les leads assignés au manager connecté
// @route   GET /api/manager/leads
// @access  Private/Manager
router.get('/leads', protect, authorize('manager'), async (req, res) => {
  try {
    // req.user._id est l'ID du manager connecté, attaché par le middleware 'protect'
    const leads = await Lead.find({ manager: req.user._id }).populate('manager', 'name email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mettre à jour le statut ou ajouter une note à un lead assigné
// @route   PATCH /api/manager/leads/:id
// @access  Private/Manager
router.patch('/leads/:id', protect, authorize('manager'), async (req, res) => {
  const { status, note } = req.body;
  const { id } = req.params;

  try {
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead non trouvé' });
    }

    // Vérifier si le lead est bien assigné au manager connecté
    if (lead.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé, ce lead ne vous est pas assigné' });
    }

    if (status) {
      if (!['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'].includes(status.toUpperCase())) {
        return res.status(400).json({ message: 'Statut invalide' });
      }
      lead.status = status.toUpperCase();
    }

    if (note) {
      lead.notes.push({ text: note }); // Ajoute une nouvelle note
    }

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;