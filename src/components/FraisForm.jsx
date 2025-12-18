import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getAuthToken } from "../services/authService";
import "../styles/FraisForm.css";

const API_URL = 'http://gsb.julliand.etu.lmdsio.com/api/';

function FraisForm({ frais = null }) {
  const [idFrais, setIdFrais] = useState(frais ? frais.id_frais : null);
  const [anneeMois, setAnneeMois] = useState(frais ? frais.anneemois : "");
  const [nbJustificatifs, setNbJustificatifs] = useState(frais ? frais.nbjustificatifs : "");
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (frais) {
      setIdFrais(frais.id_frais);
      setMontant(
        frais.montantvalide !== undefined && frais.montantvalide !== null && frais.montantvalide !== ""
          ? String(frais.montantvalide)
          : (frais.montant !== undefined && frais.montant !== null && frais.montant !== ""
              ? String(frais.montant)
              : "")
      );
      setAnneeMois(frais.anneemois || "");
      setNbJustificatifs(frais.nbjustificatifs !== undefined && frais.nbjustificatifs !== null ? String(frais.nbjustificatifs) : "");
    }
  }, [frais]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token non défini, veuillez vous connecter.");
      const user = getCurrentUser();
      if (!user) throw new Error("Utilisateur non défini, veuillez vous connecter.");
      const idVisiteur = frais ? frais.id_visiteur : user.id_visiteur;
      const montantValue = montant !== "" ? parseFloat(montant) : 0;
      if (frais) {
        const params = new URLSearchParams({
          id_frais: idFrais,
          id_visiteur: idVisiteur,
          anneemois: anneeMois,
          nbjustificatifs: nbJustificatifs,
          montantvalide: montantValue
        }).toString();
        const response = await axios.get(`${API_URL}frais/modifier?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        navigate('/dashboard');
      } else {
        const fraisData = {
          id_visiteur: idVisiteur,
          anneemois: anneeMois,
          nbjustificatifs: parseInt(nbJustificatifs, 10),
          montant: montantValue
        };
        const response = await axios.post(`${API_URL}frais/ajout`, fraisData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.id_frais) {
          localStorage.setItem('lastFraisAjoute', JSON.stringify({
            id_frais: response.data.id_frais,
            montant: fraisData.montant
          }));
        }
        console.log(response);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="frais-form-container">
      <h2>{frais ? 'Modifier le frais' : 'Saisir un frais'}</h2>
      <form onSubmit={handleSubmit} className="frais-form">
        <div className="form-group">
          <label>Année/Mois : </label>
          <input
            type="text"
            value={anneeMois}
            onChange={e => setAnneeMois(e.target.value)}
            placeholder="ex: 202310"
            required
          />
        </div>
        <div className="form-group">
          <label>Nombre de justificatifs : </label>
          <input
            type="number"
            value={nbJustificatifs}
            onChange={e => setNbJustificatifs(e.target.value)}
            min="0"
            required
          />
        </div>
        <div className="form-group">
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
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : (frais ? 'Mettre à jour' : 'Ajouter')}
        </button>
      </form>
    </div>
  );
}

export default FraisForm;
