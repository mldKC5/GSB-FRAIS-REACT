import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FraisForm from "../components/FraisForm";
import { getAuthToken } from "../services/authService";

const API_URL = 'http://gsb.julliand.etu.lmdsio.com/api/';

function FraisEdit() {
  const { id } = useParams();
  const [frais, setFrais] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFrais = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}frais/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFrais(response.data);
      } catch (err) {
        setError("Erreur lors du chargement du frais.");
      } finally {
        setLoading(false);
      }
    };
    fetchFrais();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!frais) return <div>Aucun frais trouvé.</div>;

  return (
    <div>
      <h1>Modifier un frais</h1>
      <FraisForm frais={frais} />
    </div>
  );
}

export default FraisEdit;
