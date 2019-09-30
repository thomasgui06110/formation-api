import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import usersAPI from "../services/usersAPI";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    fistName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    fistName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  // Gestion des changements des imputs dans le formulaire
  const handelChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    setUser({ ...user, [name]: value });
  };

  const handelSubmit = async event => {
    event.preventDefault();
    const apiErrors = {};

    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm = "Vos mots de passe ne correspondent pas !";
      setErrors(apiErrors);
      return;
    }

    try {
      await usersAPI.register(user);
      //console.log(response);
      setErrors({});
      history.replace("/login");

    } catch (error) {
      const { violations } = error.response.data;

      if (violations) {
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
    }
    console.log(user);
  };
  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handelSubmit}>
        <Field
          name="fistName"
          label="Prénom"
          placeholder="Votre prénom"
          error={errors.fistName}
          value={user.fistName}
          onChange={handelChange}
        />

        <Field
          name="lastName"
          label="Nom"
          placeholder="Votre Nom de famille"
          error={errors.lastName}
          value={user.lastName}
          onChange={handelChange}
        />

        <Field
          name="email"
          label="email"
          placeholder="Votre email"
          type="email"
          error={errors.email}
          value={user.email}
          onChange={handelChange}
        />

        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handelChange}
        />
        <Field
          name="passwordConfirm"
          label="Confirmation du mot de passe"
          placeholder="Confirmez votre mot de passe"
          type="password"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handelChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
