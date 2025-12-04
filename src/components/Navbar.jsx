import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar(){
    const { token, logoutUser } = useAuth();
    return(
        <nav className="navbar">
            <span className="logo">GSB Frais</span>
            <div className="links-left">
                <Link to="/">Accueil</Link>
                {token && <Link to="/dashboard">Tableau de bord</Link>}
                {token && <Link to="/frais/ajouter">Ajouter un frais</Link>}
            </div>
            <div className="links-right">
                {token ? (
                  <button onClick={logoutUser} style={{background:"none",border:"none",color:"white",cursor:"pointer"}}>Déconnexion</button>
                ) : (
                  <Link to="/login">Connexion</Link>
                )}
            </div>
        </nav>
    );
}
export default Navbar;
