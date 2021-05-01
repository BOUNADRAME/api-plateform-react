import axios from "axios";
import { INVOICES_API } from "../config";

/**
 * récupère la liste des Invoices selon l'utilisateur connecté selon la config API
 * @returns Collections
 */
function getInvoices() {
  return axios
    .get(INVOICES_API)
    .then((response) => response.data["hydra:member"]);
}

/**
 * Permet d'ajouter une facture
 * @param {Object} invoice
 * @returns
 */
function addInvoice(invoice) {
  return axios.post(INVOICES_API, {
    ...invoice,
    customer: `api/customers/${invoice.customer}`
  });
}

/**
 * Retorune un invoice à travers son ID
 * @param {integer} id
 * @returns
 */
function find(id) {
  return axios
    .get(INVOICES_API +`/${id}`)
    .then((response) => response.data);
}

/**
 * Permet de mettre à jour les informations du invoice
 * @param {integer} id ID du client
 * @param {object} invoice les informations du client
 * @returns
 */
function update(id, invoice) {
  return axios
    .put(INVOICES_API +`/${id}`, {
      ...invoice, customer: `api/customers/${invoice.customer}`
    })
    .then((response) => response.data);
}

/**
 * Permet de supprimer une facture
 * @param {number} id
 * @returns
 */
function deleteInvoice(id) {
  return axios.delete(INVOICES_API +`/${id}`);
}

export default {
  getInvoices,
  add: addInvoice,
  find,
  update,
  delete: deleteInvoice,
};
