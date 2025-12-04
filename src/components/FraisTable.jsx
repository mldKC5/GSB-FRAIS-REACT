import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/FraisTable.css";

const API_URL = 'http://gsb.julliand.etu.lmdsio.com/api/';

function FraisTable() {
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [minMontant, setMinMontant] = useState("");
  const { user, token } = useAuth();

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

  let filteredFrais = fraisList.filter(frais =>
    frais.anneemois.includes(searchTerm) ||
    String(frais.id_visiteur).includes(searchTerm)
  );
  if (filterNonNull) {
    filteredFrais = filteredFrais.filter(frais => frais.montantvalide !== null);
  }
  if (minMontant !== "") {
    filteredFrais = filteredFrais.filter(frais =>
      frais.montantvalide !== null && frais.montantvalide >= Number(minMontant)
    );
  }

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
                  : (f.montant !== null && f.montant !== undefined
                      ? f.montant + ' €'
                      : "—")
              }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FraisTable;
