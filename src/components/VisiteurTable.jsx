import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/FraisTable.css";

const API_URL = 'http://localhost:8000/api/';

function VisiteurTable() {
  const [visiteurList, setVisiteurList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVisiteurs = async () => {
      try {
        const response = await axios.get(`${API_URL}visiteur/liste`);
        setVisiteurList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des visiteurs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisiteurs();
  }, []);

  if (loading) {
    return <p>Chargement des visiteurs…</p>;
  }

  let filteredVisiteurs = visiteurList.filter(visiteur =>
    visiteur.nom_visiteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visiteur.prenom_visiteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visiteur.laboratoire && visiteur.laboratoire.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="frais-table-container">
      <h2>Liste des Visiteurs</h2>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher par nom ou laboratoire..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      
      <table className="frais-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Adresse</th>
            <th>Code postal</th>
            <th>Ville</th>
            <th>Date d'embauche</th>
            <th>Activité</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisiteurs.map(v => (
            <tr key={v.id_visiteur}>
              <td>{v.nom_visiteur}</td>
              <td>{v.prenom_visiteur}</td>
              <td>{v.adresse_visiteur}</td>
              <td>{v.cp_visiteur}</td>
              <td>{v.ville_visiteur}</td>
              <td>{v.date_embauche}</td>
              <td><Link to={`/activite/${v.id_visiteur}`}>Voir activité</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VisiteurTable;
