import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import authService from "../services/authService";

const RegisterPage = ({ history}) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Gestion des inputs du formulaire   
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  // Gestion de la soumission des données du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiErrors = {};
    // contrôle pour la confirmation du Password
    if(user.password !== user.confirmPassword) {
        apiErrors.confirmPassword = "Votre confirmation de mot de passe ne correspond avec le mot de passe original";
        setErrors(apiErrors);
        toast.error("Des erreurs sont survenues dans votre formulaire !");
        return;
    }

    try {
      await authService.createUser(user);
      setErrors({});

      toast.success("Vous êtes désormais inscrit, vous pouvez-vous connecter !");
      history.replace("/login");
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        violations.map(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("Des erreurs sont survenues dans votre formulaire !");
      }
    }
  };

  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          label="Le nom de famille"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          placeholder="Le nom de famille de l'utilisateur"
          error={errors.firstName}
        />
        <Field
          label="Le nom de famille"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          placeholder="Prénom de l'utilisateur"
          error={errors.lastName}
        />
        <Field
          type="email"
          label="Adresse email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Adresse email de l'utilisateur"
          error={errors.email}
        />

        <Field
          type="password"
          label="Mot de passe"
          name="password"
          value={user.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Field
          type="confirmPassword"
          label="Confirmer le mode de passe"
          name="password"
          value={user.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Inscrire
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
