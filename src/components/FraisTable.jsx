import React, { useState, useEffect } from "react";
import fraisData from "../data/frais.json";
import "../styles/FraisTable.css";

function FraisTable() {
  const [frais, setFrais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFrais(fraisData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="frais-table-container">
      <h2>Liste des Frais</h2>
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
          {frais.map(f => (
            <tr key={f.id_frais}>
              <td>{f.id_frais}</td>
              <td>{f.id_etat}</td>
              <td>{f.anneemois}</td>
              <td>{f.id_visiteur}</td>
              <td>{f.nbjustificatifs}</td>
              <td>{f.datemodification}</td>
              <td>{f.montantvalide !== null ? f.montantvalide + ' €' : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FraisTable;
