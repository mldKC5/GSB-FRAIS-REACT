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

  // Pré-remplir le formulaire si on modifie un frais existant
  useEffect(() => {
    if (frais) {
      setIdFrais(frais.id_frais);
      setMontant(frais.montantvalide !== undefined && frais.montantvalide !== null ? String(frais.montantvalide) : "");
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
      // Création de l'objet fraisData avec les attributs communs
      const fraisData = {
        anneemois: anneeMois,
        nbjustificatifs: parseInt(nbJustificatifs, 10),
      };
      if (frais) {
        // Mise à jour d'un frais existant (UPDATE)
        fraisData["id_frais"] = idFrais;
        fraisData["montantvalide"] = parseFloat(montant);
        // TODO : adapter l'URL selon la doc API, ici on tente /frais/modifier
        const response = await axios.post(`${API_URL}frais/modifier`, fraisData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        navigate('/dashboard');
      } else {
        // Ajout d'un nouveau frais (CREATE)
        fraisData["id_visiteur"] = user["id_visiteur"];
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
