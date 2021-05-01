import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API, USERS_API } from "../config";

/**
 * Déconnexion (suppression du token sur localStorage et sur Axios)
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token sur le localStorage et sur Axios
 * @param {Object} credentials
 * @returns
 */
function authenticate(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // je stock le token sur mon local Storage
      window.localStorage.setItem("authToken", token);
      // on pévient maintenant Axios qu'on a un header par défaut sur toutes nos futurs requêtes HTTP
      setAxiosToken(token);
    });
}

/**
 * Positionne le Token JWT sur Axios
 * @param {string} token Le Token JWT
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place du token lors du chargement de l'application
 */
function setup() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de tester si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Permet d'inscrire un utilisateur
 * @param {object} user 
 * @returns 
 */
function createUser(user) {
  return axios
    .post(USERS_API, user)
    .then((response) => response.data);
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
  createUser
};
