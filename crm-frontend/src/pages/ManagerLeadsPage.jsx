import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

function ManagerLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [noteInput, setNoteInput] = useState({}); // Pour stocker la note à ajouter pour chaque lead

  const navigate = useNavigate();

  // Options de statut pour la sélection
  const statusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];

  useEffect(() => {
    fetchManagerLeads();
  }, []);

  const fetchManagerLeads = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await API.get('/manager/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeads(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement de vos leads.');
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      }
      console.error("Fetch manager leads error:", err);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await API.patch(`/manager/leads/${leadId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Statut du lead mis à jour !');
      fetchManagerLeads(); // Recharger les leads pour voir le changement
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut.');
      console.error("Update lead status error:", err);
    }
  };

  // Nouvelle fonction pour ajouter une note
  const handleAddNote = async (leadId) => {
    const noteText = noteInput[leadId]; // Récupérer la note spécifique pour ce lead
    if (!noteText) {
      setError('Veuillez entrer une note.');
      return;
    }
    try {
      const token = localStorage.getItem('jwtToken');
      await API.patch(`/manager/leads/${leadId}`, { note: noteText }, { // Envoi de la note
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Note ajoutée avec succès !');
      setNoteInput(prev => ({ ...prev, [leadId]: '' })); // Vider le champ de note pour ce lead
      fetchManagerLeads(); // Recharger les leads pour voir la nouvelle note
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout de la note.');
      console.error("Add note error:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Mes Leads Assignés</h1>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/login')}>
        Déconnexion (provisoire)
      </button> {/* Un bouton de déconnexion simple pour l'instant */}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-header">Liste de mes Leads</div>
        <div className="card-body">
          {leads.length === 0 ? (
            <p>Aucun lead assigné pour le moment.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Entreprise</th>
                    <th>Statut</th>
                    <th>Notes</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead._id}>
                      <td>
                        <strong>{lead.contactName}</strong> <br />
                        <small>{lead.contactEmail}</small>
                      </td>
                      <td>{lead.companyName}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {lead.notes && lead.notes.length > 0 && (
                          <ul className="list-unstyled small mb-1">
                            {lead.notes.map((note, idx) => (
                              <li key={idx}>- {note.text} ({new Date(note.date).toLocaleDateString()})</li>
                            ))}
                          </ul>
                        )}
                        <div className="input-group input-group-sm mt-1">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ajouter une note..."
                            value={noteInput[lead._id] || ''}
                            onChange={(e) => setNoteInput(prev => ({ ...prev, [lead._id]: e.target.value }))}
                          />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => handleAddNote(lead._id)}>
                            Ajouter
                          </button>
                        </div>
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

export default ManagerLeadsPage;