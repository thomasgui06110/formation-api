import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPageWithPagination = props => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then(response => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
      })
      .catch(error => console.log(error.response));
  }, [currentPage]);

  const handelDelete = id => {
    const originalCustomers = [...customers];

    // L'approche optimiste on supprime de suite avant réponse serveur
    setCustomers(customers.filter(customer => customer.id !== id));
    // L'approche pessimiste
    axios
      .delete("http://localhost:8000/api/customers/" + id)
      .then(
        response => console.log("OK")
        //setCustomers(customers.filter(customer => customer.id !== id))
      )
      .catch(error => {
        setCustomers(originalCustomers);
        console.log(error.response);
      });
  };

  const handelPageChange = page => {
    setCustomers([]);
    setCurrentPage(page);
  };

  // console.log(pages);

  // console.log(pagesCount);

  const paginetedCustomers = Pagination.getData(
    customers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des Clients( PAgination)</h1>

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
        <tbody>
          {customers.length === 0 && (
            <tr>
              <td>Chargement ...</td>
            </tr>
          )}
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="#">
                  {customer.firstName} {customer.lastName}
                </a>
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
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handelPageChange}
      />
    </>
  );
};

export default CustomersPageWithPagination;
