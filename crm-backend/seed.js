const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/user_model');
const Lead = require('./models/lead_model'); // Au cas où vous voudriez aussi créer des leads de test plus tard

dotenv.config(); // Charger les variables d'environnement
connectDB(); // Connecter à la base de données

const seedUsers = async () => {
  try {
    // Supprimer tous les utilisateurs et leads existants pour un démarrage propre (optionnel)
    await User.deleteMany();
    await Lead.deleteMany();
    console.log('Données existantes supprimées.');

    // Créer un utilisateur Employer
    const employerUser = await User.create({
      name: 'Employer Admin',
      email: 'employer@example.com',
      password: 'password123', // Ce sera haché automatiquement par le middleware de Mongoose
      role: 'employer',
    });
    console.log('Utilisateur Employer créé :', employerUser.email);

    // Créer des utilisateurs Manager
    const manager1 = await User.create({
      name: 'Manager One',
      email: 'manager1@example.com',
      password: 'password123',
      role: 'manager',
    });
    console.log('Utilisateur Manager 1 créé :', manager1.email);

    const manager2 = await User.create({
      name: 'Manager Two',
      email: 'manager2@example.com',
      password: 'password123',
      role: 'manager',
    });
    console.log('Utilisateur Manager 2 créé :', manager2.email);

    // Optionnel : Créer quelques leads et les assigner aux managers
    // Note: Vous devez avoir les IDs des managers pour cela
    // const lead1 = await Lead.create({
    //   contactName: 'Client A',
    //   contactEmail: 'clienta@example.com',
    //   companyName: 'Company A',
    //   status: 'PENDING',
    //   manager: manager1._id,
    //   notes: [{ text: 'Premier contact' }]
    // });
    // console.log('Lead 1 créé :', lead1.contactName);

    // const lead2 = await Lead.create({
    //   contactName: 'Client B',
    //   contactEmail: 'clientb@example.com',
    //   companyName: 'Company B',
    //   status: 'IN_PROGRESS',
    //   manager: manager1._id,
    //   notes: [{ text: 'En discussion' }]
    // });
    // console.log('Lead 2 créé :', lead2.contactName);

    // const lead3 = await Lead.create({
    //   contactName: 'Client C',
    //   contactEmail: 'clientc@example.com',
    //   companyName: 'Company C',
    //   status: 'COMPLETED',
    //   manager: manager2._id,
    //   notes: [{ text: 'Contrat signé' }]
    // });
    // console.log('Lead 3 créé :', lead3.contactName);


    console.log('Processus de seeding terminé avec succès !');
    process.exit(); // Arrêter le script après l'exécution
  } catch (error) {
    console.error('Erreur lors du seeding :', error.message);
    process.exit(1); // Arrêter le script en cas d'erreur
  }
};

seedUsers();