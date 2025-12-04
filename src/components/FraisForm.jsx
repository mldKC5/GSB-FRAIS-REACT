import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getAuthToken } from "../services/authService";

const API_URL = 'http://gsb.julliand.etu.lmdsio.com/api/';

function FraisForm() {
  const [idFrais, setIdFrais] = useState(null);
  const [anneeMois, setAnneeMois] = useState("");
  const [nbJustificatifs, setNbJustificatifs] = useState("");
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token non défini, veuillez vous connecter.");
      const user = getCurrentUser();
      if (!user) throw new Error("Utilisateur non défini, veuillez vous connecter.");
      const fraisData = {
        anneemois: anneeMois,
        nbjustificatifs: parseInt(nbJustificatifs, 10),
        montant: parseFloat(montant), // ajout du champ montant
        montantvalide: parseFloat(montant), // champ montantvalide pour l'affichage
        id_visiteur: user["id_visiteur"]
      };
      const response = await axios.post(`${API_URL}frais/ajout`, fraisData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="frais-form">
      <div>
        <label>Année/Mois : </label>
        <input
          type="text"
          value={anneeMois}
          onChange={e => setAnneeMois(e.target.value)}
          placeholder="ex: 202310"
          required
        />
      </div>
      <div>
        <label>Nombre de justificatifs : </label>
        <input
          type="number"
          value={nbJustificatifs}
          onChange={e => setNbJustificatifs(e.target.value)}
          min="0"
          required
        />
      </div>
      <div>
        <label>Montant : </label>
        <input
          type="number"
          step="0.01"
          value={montant}
          onChange={e => setMontant(e.target.value)}
          min="0"
          required
        />
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Ajouter'}
      </button>
    </form>
  );
}

export default FraisForm;
