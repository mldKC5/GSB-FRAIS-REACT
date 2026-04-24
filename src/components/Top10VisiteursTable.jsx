import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FraisTable.css";

const API_URL = 'http://localhost:8000/api/';

function Top10VisiteursTable() {
  const [top10List, setTop10List] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTop10 = async () => {
      try {
        const response = await axios.get(`${API_URL}top10Visiteurs`, {
          headers: {
            Accept: "application/json"
          },
        });

        let data = response.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (_e) {
            console.warn('Top10: réponse HTML reçue, vérifier le controller Laravel pour retourner JSON.');
            data = [];
          }
        }

        setTop10List(Array.isArray(data) ? data : (data.visiteurs || []));
      } catch (err) {
        console.error("Erreur lors de la récupération du top 10:", err);
        const detail = err.response?.data?.message || err.response?.statusText || err.message;
        setError(`Impossible de récupérer le top 10 des visiteurs : ${detail}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTop10();
  }, []);

  if (loading) {
    return <p>Chargement du top 10…</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="frais-table-container">
      <h2>Top 10 des Visiteurs - Praticiens invités</h2>
      {top10List.length === 0 ? (
        <p>Aucune donnée disponible.</p>
      ) : (
        <table className="frais-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Nombre de praticiens invités</th>
              <th>Laboratoire</th>
            </tr>
          </thead>
          <tbody>
            {top10List.map((visiteur, index) => (
              <tr key={visiteur.id_visiteur}>
                <td>{index + 1}</td>
                <td>{visiteur.nom_visiteur}</td>
                <td>{visiteur.prenom_visiteur}</td>
                <td>{visiteur.nb_praticiens || visiteur.count || visiteur.nombre_praticiens || "—"}</td>
                <td>{visiteur.laboratoire || visiteur.nom_laboratoire || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Top10VisiteursTable;
