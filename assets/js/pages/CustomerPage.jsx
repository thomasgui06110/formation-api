import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";

import customersAPI from "../services/customersAPI";

import { toast } from "react-toastify";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  //   if(id !== "new") {
  //       console.log(id);
  //   }
  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    compagny: ""
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    compagny: ""
  });

  const [editing, setEditing] = useState(false);

  const fetchCustomer = async id => {
    try {
      const { firstName, lastName, email, compagny } = await customersAPI.find(
        id
      );
      //console.log(data);

      setCustomer({ firstName, lastName, email, compagny });
    } catch (error) {
      console.log(error.response);
      history.replace("/customers");
    }
  };

  /**
   * Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
   */
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // Gestion des changements des imputs dans le formulaire
  const handelChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    setCustomer({ ...customer, [name]: value });
  };

  const handelSubmit = async event => {
    event.preventDefault();

    try {
      if (editing) {
        await customersAPI.update(id, customer);
        toast.success("Le client a bien été modifié ")

      } else {
       await customersAPI.create(customer);
        toast.success("Le client a bieb été créé")
        history.replace("/customers");
        
      }
      setErrors({});
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
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      <form onSubmit={handelSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          onChange={handelChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prnom"
          placeholder="Prénom du client"
          value={customer.firstName}
          onChange={handelChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Adresse mail du client"
          type="email"
          value={customer.email}
          onChange={handelChange}
          error={errors.email}
        />
        <Field
          name="compagny"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.compagny}
          onChange={handelChange}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste{" "}
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
