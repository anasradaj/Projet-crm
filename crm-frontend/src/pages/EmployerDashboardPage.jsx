// crm-frontend/src/pages/EmployerDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

function EmployerDashboardPage() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsInProgress: 0,
    leadsCompleted: 0,
    leadsCanceled: 0,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await API.get('/employer/dashboard-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques du dashboard.');
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      }
      console.error("Fetch dashboard stats error:", err);
    }
  };

  // Optionnel: Récupérer le nom de l'utilisateur pour l'afficher sur le dashboard
  const userName = localStorage.getItem('userName') || 'Utilisateur';

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Bienvenue, {userName} !</h1>
      <p className="lead">Vue d'ensemble de vos leads.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h3 className="card-title">{stats.totalLeads}</h3>
              <p className="card-text">Total Leads</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card text-center bg-info text-white">
            <div className="card-body">
              <h3 className="card-title">{stats.leadsInProgress}</h3>
              <p className="card-text">Leads En Cours</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h3 className="card-title">{stats.leadsCompleted}</h3>
              <p className="card-text">Leads Complétés</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card text-center bg-danger text-white">
            <div className="card-body">
              <h3 className="card-title">{stats.leadsCanceled}</h3>
              <p className="card-text">Leads Annulés</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />
      <h2 className="mb-3">Accès Rapide</h2>
      <div className="d-grid gap-2 d-md-flex justify-content-md-start">
        <button className="btn btn-outline-primary btn-lg" onClick={() => navigate('/employer/managers')}>
          Gérer les Managers
        </button>
        <button className="btn btn-outline-success btn-lg" onClick={() => navigate('/employer/leads')}>
          Gérer les Leads
        </button>
      </div>
    </div>
  );
}

export default EmployerDashboardPage;