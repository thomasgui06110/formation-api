import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = props => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Permet d'aller récupérer les customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch {
      toast.error("Impossible de charger les clients ");
    }
  };

  // Au chargement du composant on va chechcer les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Gestion de la suppression d'un customer
  const handelDelete = async id => {
    const originalCustomers = [...customers];

    setCustomers(customers.filter(customer => customer.id !== id));

    try {
      await CustomersAPI.delete(id);
      toast.success("Le client a bien été supprimé 🙂");
    } catch (error) {
      toast.error("Erreur  lors de la suppression du client");
      setCustomers(originalCustmers);
    }
  };

  // Gestion du changement de page
  const handelPageChange = page => setCurrentPage(page);

  // Gestion de la recherche
  const handelSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  // console.log(pages);

  // console.log(pagesCount);

  // Filtrage des customer en fonction de la recherche
  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.compagny && c.compagny.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination des données
  const paginetedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des Clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handelSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <table className="table hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginetedCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id }>
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.compagny}</td>
                <td className="text-center">
                  <span className="badge badge-primary">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-right">
                  {customer.totalAmount.toFixed(2).toLocaleString()} €
                </td>
                <td>
                  <button
                    onClick={() => handelDelete(customer.id)}
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
      {loading && <TableLoader />}
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handelPageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
