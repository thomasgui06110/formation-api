import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  // Gestion des champs
  const handelChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    //Déstrucure la fonction
    //const value = currentTarget.value;
    //const name = currentTarget.name;

    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion submit
  const handelSubmit = async event => {
    event.preventDefault();

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possede cette adresse ou les informations ne correspondent pas"
      );
    }

    console.log(credentials);
  };
  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handelSubmit}>
        <Field
          label="Adresse email"
          name="username"
          value={credentials.username}
          onChange={handelChange}
          placeholder="Adresse email de connexion"
          error={error}
        />

        <Field
          label="Mot de passe"
          name="password"
          value={credentials.password}
          onChange={handelChange}
          type="password"
          id="password"
        />

        <div className="form-group">
          <button className="btn btn-success">Je me connecte !</button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
