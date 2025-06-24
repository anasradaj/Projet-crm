// crm-frontend/src/pages/EmployerManagersPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

function EmployerManagersPage() {
  const [managers, setManagers] = useState([]);
  const [newManager, setNewManager] = useState({ name: '', email: '', password: '' });
  const [editingManager, setEditingManager] = useState(null); // Pour stocker le manager en cours d'édition
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await API.get('/employer/managers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setManagers(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des managers.');
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      }
      console.error("Fetch managers error:", err);
    }
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      await API.post('/employer/managers', newManager, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Manager créé avec succès !');
      setNewManager({ name: '', email: '', password: '' });
      fetchManagers();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du manager.');
      console.error("Create manager error:", err);
    }
  };

  // Logique de suppression
  const handleDeleteManager = async (managerId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce manager et tous les leads qui lui sont assignés ?')) {
      return; // Annuler si l'utilisateur ne confirme pas
    }
    try {
      const token = localStorage.getItem('jwtToken');
      await API.delete(`/employer/managers/${managerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Manager supprimé avec succès !');
      fetchManagers(); // Recharger la liste
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression du manager.');
      console.error("Delete manager error:", err);
    }
  };

  // Logique de modification
  const handleEditClick = (manager) => {
    setEditingManager({ ...manager, password: '' }); // Charger les infos du manager pour l'édition (mot de passe vide pour ne pas afficher le haché)
    setNewManager({ name: '', email: '', password: '' }); // Vider le formulaire de création
    setSuccess(''); // Vider les messages de succès/erreur
    setError('');
  };

  const handleUpdateManager = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      await API.put(`/employer/managers/${editingManager._id}`, editingManager, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Manager mis à jour avec succès !');
      setEditingManager(null); // Quitter le mode édition
      fetchManagers(); // Recharger la liste
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du manager.');
      console.error("Update manager error:", err);
    }
  };


  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestion des Managers</h1>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/employer/dashboard')}>
        Retour au Dashboard
      </button>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Formulaire de création/modification de manager */}
      <div className="card mb-4">
        <div className="card-header">{editingManager ? 'Modifier Manager' : 'Créer un nouveau Manager'}</div>
        <div className="card-body">
          <form onSubmit={editingManager ? handleUpdateManager : handleCreateManager}>
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                value={editingManager ? editingManager.name : newManager.name}
                onChange={(e) => editingManager ? setEditingManager({ ...editingManager, name: e.target.value }) : setNewManager({ ...newManager, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={editingManager ? editingManager.email : newManager.email}
                onChange={(e) => editingManager ? setEditingManager({ ...editingManager, email: e.target.value }) : setNewManager({ ...newManager, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mot de passe (Laisser vide si inchangé)</label>
              <input
                type="password"
                className="form-control"
                value={editingManager ? editingManager.password : newManager.password}
                onChange={(e) => editingManager ? setEditingManager({ ...editingManager, password: e.target.value }) : setNewManager({ ...newManager, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingManager ? 'Mettre à jour Manager' : 'Créer Manager'}
            </button>
            {editingManager && (
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingManager(null)}>
                Annuler
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Liste des managers */}
      <div className="card">
        <div className="card-header">Liste des Managers Existants</div>
        <div className="card-body">
          {managers.length === 0 ? (
            <p>Aucun manager trouvé.</p>
          ) : (
            <div className="table-responsive"> {/* Ajout pour le responsive sur les petites écrans */}
              <table className="table table-striped table-hover"> {/* Classes Bootstrap pour la table */}
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map(manager => (
                    <tr key={manager._id}> {/* Chaque manager est une ligne de tableau */}
                      <td>{manager.name}</td>
                      <td>{manager.email}</td>
                      <td>
                        <button className="btn btn-info btn-sm me-2" onClick={() => handleEditClick(manager)}>Modifier</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteManager(manager._id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerManagersPage;