import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/FraisTable.css";

const API_URL = 'http://localhost:8000/api/';

function ActiviteTable() {
  const { id } = useParams();
  const { token } = useAuth();
  const [activiteList, setActiviteList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Identifiant visiteur manquant.");
      setLoading(false);
      return;
    }

    const fetchActivites = async () => {
      try {
        const response = await axios.get(`${API_URL}listerActVi/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            Accept: "application/json"
          },
        });

        // Si le backend retourne une vue HTML (embêtant), on tente de parser JSON si possible.
        let data = response.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (_e) {
            // Reste sur la chaîne HTML et on transforme en liste vide sauf si l'API fournit JSON.
            console.warn('Activites: réponse HTML reçue, vérifier le controller Laravel pour retourner JSON.');
            data = [];
          }
        }

        setActiviteList(Array.isArray(data) ? data : (data.visiteurs || []));
      } catch (err) {
        console.error("Erreur lors de la récupération des activités:", err);
        const detail = err.response?.data?.message || err.response?.statusText || err.message;
        setError(`Impossible de récupérer les activités du visiteur : ${detail}`);
      } finally {
        setLoading(false);
      }
    };

    setError(null);
    setLoading(true);
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

export default ActiviteTable;
