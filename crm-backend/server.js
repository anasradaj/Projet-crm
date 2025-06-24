const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import de cors
const connectDB = require('./config/db'); // Import de la fonction de connexion à la DB

// Charger les variables d'environnement depuis .env
dotenv.config();

// Connecter à la base de données
connectDB();

const app = express();

// 1. Configuration CORS explicite (DOIT VENIR AVANT express.json() si 'credentials' est utilisé)
const corsOptions = {
  origin: 'http://localhost:5173', // L'URL de votre frontend Vite
  credentials: true, // Autorise l'envoi de cookies et d'en-têtes d'authentification
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes HTTP autorisés
};
app.use(cors(corsOptions)); // Utilisez cors avec les options définies


// Middleware pour parser le JSON des requêtes (équivalent de body-parser)
app.use(express.json());


// Route de test simple
app.get('/', (req, res) => {
  res.send('API CRM en cours de fonctionnement !');
});

// Définition du port
const PORT = process.env.PORT || 5000; // Utilise le port du .env ou 5000 par défaut

const authRoutes = require('./routes/auth_routes');
const employerRoutes = require('./routes/employer_routes');
const managerRoutes = require('./routes/manager_routes');

// Utiliser les routes
app.use('/api/auth', authRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/manager', managerRoutes);

// Lancer le serveur
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));