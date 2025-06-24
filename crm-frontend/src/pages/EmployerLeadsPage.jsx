// crm-frontend/src/pages/EmployerLeadsPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

function EmployerLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [managers, setManagers] = useState([]); // Pour la liste déroulante des managers
  const [newLead, setNewLead] = useState({
    contactName: '',
    contactEmail: '',
    companyName: '',
    managerId: '' // Pour assigner un manager
  });
  const [editingLead, setEditingLead] = useState(null); // Pour stocker le lead en cours d'édition
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Options de statut pour la sélection
  const statusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];

  useEffect(() => {
    fetchLeads();
    fetchManagersForDropdown();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await API.get('/employer/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeads(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des leads.');
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      }
      console.error("Fetch leads error:", err);
    }
  };

  const fetchManagersForDropdown = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await API.get('/employer/managers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setManagers(res.data);
    } catch (err) {
      console.error("Fetch managers for dropdown error:", err);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      await API.post('/employer/leads', newLead, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Lead créé avec succès !');
      setNewLead({ contactName: '', contactEmail: '', companyName: '', managerId: '' });
      fetchLeads();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du lead.');
      console.error("Create lead error:", err);
    }
  };

  // Logique de suppression d'un lead
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) {
      return;
    }
    try {
      const token = localStorage.getItem('jwtToken');
      await API.delete(`/employer/leads/${leadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Lead supprimé avec succès !');
      fetchLeads();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression du lead.');
      console.error("Delete lead error:", err);
    }
  };

  // Logique de modification d'un lead
  const handleEditClick = (lead) => {
    // Charger les infos du lead pour l'édition
    setEditingLead({
      _id: lead._id,
      contactName: lead.contactName,
      contactEmail: lead.contactEmail,
      companyName: lead.companyName,
      status: lead.status,
      managerId: lead.manager?._id || '', // Gérer le cas où manager n'est pas défini
    });
    setNewLead({ contactName: '', contactEmail: '', companyName: '', managerId: '' }); // Vider le formulaire de création
    setSuccess('');
    setError('');
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      await API.put(`/employer/leads/${editingLead._id}`, editingLead, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Lead mis à jour avec succès !');
      setEditingLead(null); // Quitter le mode édition
      fetchLeads();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du lead.');
      console.error("Update lead error:", err);
    }
  };


  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestion des Leads</h1>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/employer/dashboard')}>
        Retour au Dashboard
      </button>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Formulaire de création/modification de Lead */}
      <div className="card mb-4">
        <div className="card-header">{editingLead ? 'Modifier Lead' : 'Créer un nouveau Lead'}</div>
        <div className="card-body">
          <form onSubmit={editingLead ? handleUpdateLead : handleCreateLead}>
            <div className="mb-3">
              <label className="form-label">Nom du Contact</label>
              <input
                type="text"
                className="form-control"
                value={editingLead ? editingLead.contactName : newLead.contactName}
                onChange={(e) => editingLead ? setEditingLead({ ...editingLead, contactName: e.target.value }) : setNewLead({ ...newLead, contactName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email du Contact</label>
              <input
                type="email"
                className="form-control"
                value={editingLead ? editingLead.contactEmail : newLead.contactEmail}
                onChange={(e) => editingLead ? setEditingLead({ ...editingLead, contactEmail: e.target.value }) : setNewLead({ ...newLead, contactEmail: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nom de l'Entreprise</label>
              <input
                type="text"
                className="form-control"
                value={editingLead ? editingLead.companyName : newLead.companyName}
                onChange={(e) => editingLead ? setEditingLead({ ...editingLead, companyName: e.target.value }) : setNewLead({ ...newLead, companyName: e.target.value })}
                required
              />
            </div>
            {editingLead && ( // Afficher le statut seulement en mode édition
                <div className="mb-3">
                    <label className="form-label">Statut</label>
                    <select
                        className="form-select"
                        value={editingLead.status}
                        onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value })}
                        required
                    >
                        {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            )}
            <div className="mb-3">
              <label className="form-label">Assigner au Manager</label>
              <select
                className="form-select"
                value={editingLead ? editingLead.managerId : newLead.managerId}
                onChange={(e) => editingLead ? setEditingLead({ ...editingLead, managerId: e.target.value }) : setNewLead({ ...newLead, managerId: e.target.value })}
                required
              >
                <option value="">Sélectionner un manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name} ({manager.email})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {editingLead ? 'Mettre à jour Lead' : 'Créer Lead'}
            </button>
            {editingLead && (
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingLead(null)}>
                Annuler
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Liste des Leads existants */}
      <div className="card">
        <div className="card-header">Liste de tous les Leads</div>
        <div className="card-body">
          {leads.length === 0 ? (
            <p>Aucun lead trouvé.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Entreprise</th>
                    <th>Statut</th>
                    <th>Manager Assigné</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead._id}>
                      <td>{lead.contactName} ({lead.contactEmail})</td>
                      <td>{lead.companyName}</td>
                      <td>{lead.status}</td>
                      <td>{lead.manager?.name || 'Non assigné'}</td>
                      <td>
                        <button className="btn btn-info btn-sm me-2" onClick={() => handleEditClick(lead)}>Modifier</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteLead(lead._id)}>Supprimer</button>
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

export default EmployerLeadsPage;