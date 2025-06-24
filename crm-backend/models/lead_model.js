// crm-backend/models/lead.model.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: [true, 'Le nom du contact est requis']
  },
  contactEmail: {
    type: String,
    required: [true, 'L\'email du contact est requis'],
    match: [/.+@.+\..+/, 'Veuillez entrer un email valide']
  },
  companyName: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est requis']
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'], 
    default: 'PENDING' 
  },
  manager: { // Référence au manager à qui ce lead est assigné
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Fait référence au modèle 'User'
    required: [true, 'Un lead doit être assigné à un manager']
  },
  notes: [ // Array de chaînes de caractères pour les notes
    {
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true // Ajoute createdAt et updatedAt
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;