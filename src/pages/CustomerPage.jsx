import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import customerService from "../services/customerService";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);

  // récupère un client 
  const fetchCustomer = async (id) => {
    try {
      // Destructuring
      const { firstName, lastName, email, company } = await customerService.get(
        id
      );
      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      toast.error("Le client n'a pas pu être chargé");
      history.replace("/customers");
    }
  };

  // chargement du composant si besoin au changement du composant ou changement de l'identifiant
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  // Gestion de la soumission des données du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setErrors({});
    try {
      if (editing) {
        await customerService.update(id, customer);
        toast.success("Le client a bien été modifié");
      } else {
        await customerService.add(customer);
        toast.success("Le client a bien été créé");
        history.replace("/customers");
      }

    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.map(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("Des erreurs dans votre formulaires");
      }
    }
  }

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom de famille"
          placeholder="Prénom du client"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Email du client"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />

        <div className="form-group">
          <button className="btn btn-success">
            {(!editing && "Enregistrer") || "Modifier"}
          </button>
          <Link to="/customers" className="btn btn-link">
            Retourner à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
