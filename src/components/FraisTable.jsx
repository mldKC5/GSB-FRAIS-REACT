import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/FraisTable.css";

const API_URL = 'http://gsb.julliand.etu.lmdsio.com/api/';

function FraisTable() {
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [minMontant, setMinMontant] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFrais = async () => {
      try {
        if (!user || !token) return;
        const response = await axios.get(`${API_URL}frais/liste/${user.id_visiteur}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFraisList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des frais:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFrais();
  }, [user, token]);

  if (loading) {
    return <p>Chargement des frais…</p>;
  }

  // Récupère le dernier frais ajouté (stocké dans le localStorage)
  let lastFraisAjoute = null;
  try {
    lastFraisAjoute = JSON.parse(localStorage.getItem('lastFraisAjoute'));
  } catch {}

  let filteredFrais = fraisList.filter(frais =>
    frais.anneemois.includes(searchTerm) ||
    String(frais.id_visiteur).includes(searchTerm)
  );
  if (filterNonNull) {
    filteredFrais = filteredFrais.filter(frais =>
      frais.montantvalide !== null ||
      (lastFraisAjoute && frais.id_frais === lastFraisAjoute.id_frais)
    );
  }
  if (minMontant !== "") {
    filteredFrais = filteredFrais.filter(frais =>
      (frais.montantvalide !== null && frais.montantvalide >= Number(minMontant)) ||
      (lastFraisAjoute && frais.id_frais === lastFraisAjoute.id_frais && lastFraisAjoute.montant >= Number(minMontant))
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce frais ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}frais/supprimer/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFraisList(fraisList.filter((frais) => frais.id_frais !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div className="frais-table-container">
      <h2>Liste des Frais</h2>
      <div className="filter-container">
        <label>
          <input
            type="checkbox"
            checked={filterNonNull}
            onChange={() => setFilterNonNull(!filterNonNull)}
          />
          Afficher uniquement les montants validés
        </label>
      </div>
      <div className="search-container">
        <input
        className="search-input"
          type="text"
          placeholder="Rechercher par date ou visiteur..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        /><br />
        <input
        className="search-input"
          type="number"
          placeholder="Montant minimum"
          value={minMontant}
          onChange={e => setMinMontant(e.target.value)}
          style={{ width: 155 }}
        />
      </div>
      
      <table className="frais-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>État</th>
            <th>Année-Mois</th>
            <th>Visiteur</th>
            <th>Justificatifs</th>
            <th>Date modif.</th>
            <th>Montant validé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFrais.map(f => (
            <tr key={f.id_frais}>
              <td>{f.id_frais}</td>
              <td>{f.id_etat}</td>
              <td>{f.anneemois}</td>
              <td>{f.id_visiteur}</td>
              <td>{f.nbjustificatifs}</td>
              <td>{f.datemodification}</td>
              <td>{ 
                f.montantvalide !== null && f.montantvalide !== undefined
                  ? f.montantvalide + ' €'
                  : (lastFraisAjoute && f.id_frais === lastFraisAjoute.id_frais
                      ? lastFraisAjoute.montant + ' €'
                      : "—")
              }</td>
              <td>
                <button onClick={() => navigate(`/frais/modifier/${f.id_frais}`)} className="edit-button">Modifier</button>
                <button onClick={() => handleDelete(f.id_frais)} className="delete-button">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FraisTable;
