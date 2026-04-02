import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/FraisTable.css";

const API_URL = 'http://localhost:8000/api/';

export default function Activite() {
  const { id } = useParams();
  const { token } = useAuth();
  const [activiteList, setActiviteList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await axios.get(`${API_URL}listerActVi/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setActiviteList(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des activités:", err);
        setError("Impossible de récupérer les activités du visiteur.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivites();
  }, [id, token]);

  if (loading) {
    return <p>Chargement des activités…</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="frais-table-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Activités du visiteur #{id}</h2>
        <Link to="/visiteur" style={{ color: '#61dafb', textDecoration: 'underline' }}>Retour liste visiteurs</Link>
      </div>
      {activiteList.length === 0 ? (
        <p>Aucune activité trouvée.</p>
      ) : (
        <table className="frais-table">
          <thead>
            <tr>
              <th>ID visiteur</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Laboratoire</th>
              <th>ID activité</th>
              <th>Motif</th>
              <th>Date activité</th>
            </tr>
          </thead>
          <tbody>
            {activiteList.map((a) => (
              <tr key={`${a.id_visiteur}-${a.id_activite_compl}-${a.date_activite}`}>
                <td>{a.id_visiteur}</td>
                <td>{a.nom_visiteur}</td>
                <td>{a.prenom_visiteur}</td>
                <td>{a.nom_laboratoire || a.laboratoire}</td>
                <td>{a.id_activite_compl}</td>
                <td>{a.motif_activite}</td>
                <td>{a.date_activite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
