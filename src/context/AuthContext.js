import { createContext, useContext, useState, useEffect } from "react";
import { signIn, logout as apiLogout, getCurrentUser, getAuthToken } from "../services/authService";

const AuthContext = createContext(null);

//Fournisseur du contexte (AuthProvider)
export function AuthProvider({ children }) {
  // État local pour stocker l'utilisateur (null = non connecté)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    const storedToken = getAuthToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // ToDo : affecter la valeur nulle
  
  // 3. Fonction de connexion
  const loginUser = async (login, password) => {
    const data = await signIn(login, password);
    setUser(data.visiteur);
    setToken(data.access_token);
    return data;
  };

  // 4. Fonction de déconnexion
  const logoutUser = () => {
    apiLogout();
    setUser(null);
    setToken(null);
  };

  // 5. Valeurs exposées aux composants enfants
  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser }}>
      {children} {/* Rend les composants enfants (ex: App) */}
    </AuthContext.Provider>
  );
}

// 6. Hook personnalisé pour utiliser le contexte facilement
export function useAuth() {
  return useContext(AuthContext);
}
