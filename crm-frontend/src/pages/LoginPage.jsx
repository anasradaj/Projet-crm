import React, { useState } from 'react';
import API from '../api/axios'; // Import de l'instance axios configurée
import { useNavigate } from 'react-router-dom'; // Pour la redirection

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    try {
      // Appel à l'API de login
      const res = await API.post('/auth/login', { email, password });

      // Stocker le token (par exemple, dans le localStorage)
      localStorage.setItem('jwtToken', res.data.token);
      // Stocker les infos de l'utilisateur (rôle, nom, email)
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('userName', res.data.name);

      // Rediriger l'utilisateur en fonction de son rôle
      if (res.data.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (res.data.role === 'manager') {
        navigate('/manager/leads');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.');
      console.error("Login error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h2>Connexion CRM</h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Se connecter</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;