// crm-backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Pour charger les variables d'environnement

const connectDB = async () => {
  try {
    // Le strictQuery est une option Mongoose pour gérer les requêtes avec des champs non définis dans le schéma
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connectée avec succès !');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error.message);
    // Arrêter le processus en cas d'erreur de connexion à la base de données
    process.exit(1);
  }
};

module.exports = connectDB;