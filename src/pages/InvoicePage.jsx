import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import FormContentLoader from "../components/loaders/FormContentLoader";
import customerService from "../services/customerService";
import invoiceService from "../services/invoiceService";

const InvoicePage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customers, setCustomers] = useState([]);
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
      setLoading(false);
      // sélectionner le premier élement de la liste
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      toast.error("Impossible de charger les clients");
    }
  };

  // récupère un invoice
  const fetchInvoice = async (id) => {
    try {
      const { amount, customer, status } = await invoiceService.find(id);
      setInvoice({ amount, customer: customer.id, status });
      setLoading(false);
    } catch ({ response }) {
      toast.error("Impossible de charger la facture demandée");
      history.replace("/invoices");
    }
  };

  useEffect(() => {
    fetchCustomers();
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  // Gestion de la soumission des données du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({});

    try {
      if (editing) {
        await invoiceService.update(id, invoice);
        toast.success("La facture a bien été modifiée");
      } else {
        await invoiceService.add(invoice);
        toast.success("La facture a bien été enregistée");
        history.replace("/invoices");
      }
    } catch ({ response }) {
      console.log(response);
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.map(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
      toast.error("Des erreurs dans votre formulaire");
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (
        <h1>Modification d'une facture</h1>
      )}
      {loading && <FormContentLoader />}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="amount"
            type="number"
            label="Montant"
            placeholder="Monatant de la facture"
            value={invoice.amount}
            onChange={handleChange}
            error={errors.amount}
          />

          <Select
            name="customer"
            label="Client"
            value={invoice.customer}
            error={errors.customer}
            onChange={handleChange}
          >
            {customers.map(({ id, firstName, lastName }) => (
              <option key={id} value={id}>
                {" "}
                {firstName} {lastName}{" "}
              </option>
            ))}
          </Select>

          <Select
            name="status"
            label="Status"
            value={invoice.status}
            error={errors.status}
            onChange={handleChange}
          >
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
          </Select>

          <div className="form-group">
            <button className="btn btn-success">
              {(!editing && "Enregistrer") || "Modifier"}
            </button>
            <Link to="/invoices" className="btn btn-link">
              Retourner à la liste
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default InvoicePage;
