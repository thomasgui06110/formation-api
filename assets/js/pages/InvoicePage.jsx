import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import customersAPI from "../services/customersAPI";
import axios from "axios";
import { match } from "minimatch";
import InvoicesAPI from "../services/invoicesAPI";
import invoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT"
  });

  const [customers, setCustomers] = useState([]);

  const [editing, setEditting] = useState(false);

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      console.log(data);

      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      console.log(error.response);
    }
  };
  const fetchInvoice = async id => {
    try {
      const { amount, status, customer } = await invoicesAPI.find(id);

      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      //console.log(error.response);
      history.replace("/invoices");
    }
  };

  // Récupération de la liste des clients à chaque chargement des composants
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Récupération de la bonne facture quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditting(true);
      fetchInvoice(id);
    }
  }, [id]);
  // Gestion des changements des imputs dans le formulaire
  const handelChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    setInvoice({ ...invoice, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handelSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        await invoicesAPI.update(id, invoice);
      } else {
        const response = await invoicesAPI.create(invoice);

        history.replace("/invoices");
      }
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      {(editing && <h1>Modification d'une facture</h1>) || (
        <h1>Création d'une facture</h1>
      )}

      <form onSubmit={handelSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handelChange}
          value={invoice.amount}
          error={errors.amount}
          onChange={handelChange}
        />
        <Select
          name="customer"
          label="client"
          value={invoice.customer}
          onChange={handelChange}
          error={errors.customer}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="status"
          value={invoice.status}
          error={errors.status}
          onChange={handelChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCED">Annulée</option>
        </Select>

        <div className="form-group">
          <button className="btn btn-success" type="submit">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
