import { useState, useContext } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import AuthContext from "../contexts/AuthContext";
import authService from "../services/authService";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const history = useHistory();
  const { setIsAuthenticated } = useContext(AuthContext);

  // Gestion des champs
  const handleChange = ({ currentTarget }) => {
    // const value = currentTarget.value;
    // const name = currentTarget.name;
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion du submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await authService.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.success("Vous êtes désormais connecté !");
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse ou les Informations ne correspondent pas"
      );
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <>
      <h1>Connexion à notre application</h1>
      <form onSubmit={handleSubmit}>
        <Field
          type="email"
          label="Adresse email"
          name="username"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Adresse email de connexion"
          error={error}
        />

        <Field
          type="password"
          label="Mot de passe"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
        
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
