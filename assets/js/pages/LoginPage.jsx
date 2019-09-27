import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

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
        <div className="form-group">
          <label htmlFor="username">Adresse Email</label>
          <input
            value={credentials.username}
            onChange={handelChange}
            type="email"
            placeholder="Adresse mail de connexion"
            name="username"
            id="username"
            className={"form-control" + (error && " is-invalid")}
          />
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            value={credentials.password}
            onChange={handelChange}
            type="password"
            className="form-control"
            placeholder="Mot de passe"
            name="password"
            id="password"
          />
        </div>
        <div className="form-group">
          <button className="btn btn-success">Je me connecte !</button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
