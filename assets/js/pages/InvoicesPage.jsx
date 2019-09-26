import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "info",
  CANCED: "danger"
};

const STATUS_LABELS = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCED: "Annulée"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  // Recuperation des invoices aupres de l'API
  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // Charger les invoices au chargement du composant
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Gestion de la suppression d'un invoice
  const handelDelete = async id => {
    const originalInvoices = [...invoices];

    setInvoices(invoices.filter(invoice => invoice.id !== id));
    try {
      await InvoicesAPI.delete(id);
    } catch (error) {
      setInvoices(originalInvoices);
    }
  };

  // Gestion du changement de page
  const handelPageChange = page => setCurrentPage(page);

  // Gestion de la recherche
  const handelSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Gestion du format de date
  const formatDate = str => moment(str).format("DD/MM/YYYY");

  // Filtrage des invoices en fonction de la recherche
  const filteredInvoices = invoices.filter(
    i =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // Pagination des données
  const paginetedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des factures</h1>
      <div className="form-group">
        <input
          type="text"
          onChange={handelSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <table className="table tabme-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Status</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginetedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                <a href="">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-right">
                {invoice.amount.toFixed(2).toLocaleString()} €
              </td>
              <td>
                <button className="btn btn-sm btn-primary mr-2">Editer</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handelDelete(invoice.id)}
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
        onPageChanged={handelPageChange}
        length={filteredInvoices.length}
      />
    </>
  );
};

export default InvoicesPage;
