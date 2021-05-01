import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
// import { useHistory } from 'react-router-dom';

const CustomerPageWithPagination = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  // const history = useHistory();

  useEffect(() => {
    fetch(
      `http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
    )
      .then((response) => {
        response.json().then((resp) => {
          setCustomers(resp["hydra:member"]);
          setTotalItems(resp["hydra:totalItems"]);
          setLoading(false);
        });
      })
      .catch((error) => console.log(error));
  }, [currentPage]);

  const handleDelete = (id) => {
    // copy du tableau de depart
    const originalCustomers = [...customers];
    // Approche optimiste supprimer du tableau
    setCustomers(customers.filter((customer) => customer.id !== id));

    fetch(`http://localhost:8000/api/customers/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => console.log("Suppression OK"))
      .catch((error) => {
        setCustomers(originalCustomers);
        console.log(error);
      });
  };

  // connaitre le nombre de page
  const paginatedCustomers = Pagination.getData(
    customers,
    currentPage,
    itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
  };

  return (
    <>
      <h1>Liste des Clients (pagination)</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <td>Id.</td>
            <td>Client</td>
            <td>Email</td>
            <td>Entreprise</td>
            <td className="text-center">Factures</td>
            <td className="text-center">Montant Total</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td>Chargement...</td>
            </tr>
          )}
          {!loading &&
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  {customer.firstName} {customer.lasttName}
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
      </table>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default CustomerPageWithPagination;
