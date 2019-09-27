import axios from "axios";
import jwtDecode from "jwt-decode";

function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur axios
 * @param {object} credentials
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then(response => response.data.token)
    .then(token => {
      // Je stocke le tocken ds localstorage
      window.localStorage.setItem("authToken", token);

      //on prévient Axios qu'on à maintenant un header par defaut sur toutes nos futures requetes HTTP
      setAxiosToken(token);

      //return true;

      //CustomersAPI.findAll.then(data => console.log(data));
    });
}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token Le token JWT
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'appli
 */
function setup() {
  // Voir si on a un token
  const token = window.localStorage.getItem("authToken");

  // Si le token est valide
  if (token) {
    // on destrcuture
    //const jwtData = jwtDecode(token);
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function IsAuthenticated() {
  // Voir si on a un token
  const token = window.localStorage.getItem("authToken");

  // Si le token est valide
  if (token) {
    // on destrcuture
    //const jwtData = jwtDecode(token);
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}
export default {
  authenticate,
  logout,
  setup,
  IsAuthenticated
};
