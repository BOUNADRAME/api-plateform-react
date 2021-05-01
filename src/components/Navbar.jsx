
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContext';
import authService from '../services/authService';

const Navbar = () => {
  const history = useHistory();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    toast.info("Vous êtes désormais déconnecté 😃");
    history.replace("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/" className="navbar-brand"> SymReact !</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor03"
        aria-controls="navbarColor03"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor03">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/customers" className="nav-link"> Clients </Link>
          </li>
          <li className="nav-item">
            <Link to="/invoices" className="nav-link"> Factures </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          {(!isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Incription</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="btn btn-success">Connexion</Link>
              </li>
            </>
          )) || (
          <li className="nav-item">
            <button onClick={handleLogout} className="btn btn-danger">Déconnexion</button>
          </li>)}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
