import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

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
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Recuperation des invoices aupres de l'API
  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures")
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
      toast.success("La facture a bien été supprimée !")
    } catch (error) {
      toast.error("Une erreur est survenue !")
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
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link className="btn btn-primary" to="/invoices/new">
          Créer une facture
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
        {!loading && <tbody>
          {paginetedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                <Link to={"/customers/" + invoice.customer.id}>
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </Link >
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
                <Link
                  to={"/invoices/" + invoice.id}
                  className="btn btn-sm btn-primary mr-2"
                >
                  Editer
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handelDelete(invoice.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>}
      </table>

      {loading && <TableLoader />}

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
