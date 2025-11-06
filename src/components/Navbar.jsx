import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar(){
    return(
        <nav className="navbar">
            <span className="logo">GSB Frais</span>
            <div className="links-left">
                <Link to="/">Accueil</Link>
                <Link to="/dashboard">Tableau de bord</Link>
            </div>
            <div className="links-right">
                <Link to="">Déconnexion</Link>
                <Link to="/login">Connexion</Link>
            </div>
        </nav>
    );
}
export default Navbar;
