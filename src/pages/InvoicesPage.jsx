import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import formatDate from "../helpers/date-format";
import invoiceService from "../services/invoiceService";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger",
};

const STATUS_LABELS = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée",
};

const InvoicesPage = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Au chargement du composant, on va chercher les données des invoices
  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Gestion de la suppression d'un invoice
  const handleDelete = async (id) => {
    // copy du tableau de depart
    const originalInvoices = [...invoices];
    // Approche optimiste supprimer du tableau
    setInvoices(invoices.filter((customer) => customer.id !== id));

    try {
      await invoiceService.delete(id);
      toast.success("La facture a bien été supprimée !");
    } catch (error) {
      setInvoices(originalInvoices);
      toast.error("Une erreur est survenue !");
    }
  };

  // Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // filtrage des invoices en fonction de la recherche
  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().toLowerCase().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // Pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className="md-3 d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        {!loading && <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                {invoice.customer.firstName} {invoice.customer.lastName}
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">
                {invoice.amount.toLocaleString()} XOF
              </td>
              <td>
              <Link to={`/invoices/${invoice.id}`} className="btn btn-sm btn-primary mr-1">Editer</Link>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>}
      </table>
      
      {loading && <TableLoader />}

      {itemsPerPage < filteredInvoices.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredInvoices.length}
          onPageChanged={handlePageChange}
        />
      )}

      <Link
        className="btn btn-danger"
        style={{ position: "fixed", bottom: "25px", right: "25px" }}
        to="/invoices/new"
      >
        <i className="fas fa-plus-circle" style={{ size: "89x" }}></i>
      </Link>
    </>
  );
};

export default InvoicesPage;
