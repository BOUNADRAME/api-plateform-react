import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import customerService from "../services/customerService";

const CustomersPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Au chargement du composant, on va chercher les customers
  const fetchCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger les clients");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Gestion de la suppression d'un customer
  const handleDelete = async (id) => {
    // copy du tableau de depart
    const originalCustomers = [...customers];
    // Approche optimiste supprimer du tableau
    setCustomers(customers.filter((customer) => customer.id !== id));

    try {
      await customerService.delete(id);
      toast.success("Le client a bien été supprimé");
    } catch (error) {
      setCustomers(originalCustomers);
      toast.error("La suppression du client n'a pas réussi");
    }
  };

  // Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination des données
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className="md-3 d-flex justify-content-between align-items-center">
        <h1>Liste des Clients</h1>
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
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant Total</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link
                    to={`/customers/${customer.id}`}
                  >
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-primary">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} XOF{" "}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {/* loading */}
      {loading && <TableLoader />}

      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
      <Link
        className="btn btn-danger"
        style={{ position: "fixed", bottom: "25px", right: "25px" }}
        to="/customers/new"
      >
        <i className="fas fa-plus-circle" style={{ size: "89x" }}></i>
      </Link>
    </>
  );
};

export default CustomersPage;
