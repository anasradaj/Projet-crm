// crm-frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Import de la page de login
import EmployerManagersPage from './pages/EmployerManagersPage';
import EmployerLeadsPage from './pages/EmployerLeadsPage';
import ManagerLeadsPage from './pages/ManagerLeadsPage';
import Navbar from './components/Navbar';
import EmployerDashboard from './pages/EmployerDashboardPage'; // 

// Placeholder pour les futures pages
// const EmployerManagers = () => <div>Employer Managers</div>;
const EmployerLeads = () => <div>Employer Leads</div>;
const ManagerLeads = () => <div>Manager Leads</div>;

// Composant pour protéger les routes
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" />; // Pas de token, rediriger vers login
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Mauvais rôle, rediriger (créer une page unauthorized plus tard)
  }

  return children; // Rendre le composant enfant si autorisé
};

function App() {
  const isAuthenticated = localStorage.getItem('jwtToken') !== null;

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar />} {/* Affiche la Navbar si l'utilisateur est connecté */}
        <div className="main-content"> {/* Optionnel: pour le stylisme du contenu principal sous la navbar */}
          </div>
        <Routes>
          {/* Route de login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" />} /> {/* Rediriger la racine vers login */}
          <Route path="/unauthorized" element={<div>Accès non autorisé</div>} />

          {/* Routes de l'employeur (protégées) */}
          <Route path="/employer/dashboard" element={<PrivateRoute allowedRoles={['employer']}><EmployerDashboard /></PrivateRoute>} />
          <Route path="/employer/managers" element={<PrivateRoute allowedRoles={['employer']}><EmployerManagersPage /></PrivateRoute>} />
          <Route path="/employer/leads" element={<PrivateRoute allowedRoles={['employer']}><EmployerLeadsPage /></PrivateRoute>} />

          {/* Routes du manager (protégées) */}
          <Route path="/manager/leads" element={<PrivateRoute allowedRoles={['manager']}><ManagerLeadsPage /></PrivateRoute>} />

          {/* Route pour toutes les autres URL non définies */}
          <Route path="*" element={<div>404 - Page non trouvée</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;