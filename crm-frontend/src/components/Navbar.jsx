import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Récupérer le rôle de l'utilisateur

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login'); // Rediriger vers la page de login après déconnexion
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">CRM App</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {userRole === 'employer' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/managers">Managers</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/leads">Leads (Employer)</Link>
                </li>
              </>
            )}
            {userRole === 'manager' && (
              <li className="nav-item">
                <Link className="nav-link" to="/manager/leads">Mes Leads (Manager)</Link>
              </li>
            )}
          </ul>
          {userRole && ( // Afficher le bouton de déconnexion si un rôle est défini (utilisateur connecté)
            <div className="d-flex">
              <button className="btn btn-outline-light" onClick={handleLogout}>Déconnexion</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;