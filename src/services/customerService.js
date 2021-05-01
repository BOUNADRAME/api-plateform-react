import axios from "axios";
import { CUSTOMERS_API } from "../config";
import cache from "./cache";

async function getCustomers() {
  // cache
  const cachedCustomers = await cache.get("customers");

  if (cachedCustomers !== null) return cachedCustomers;

  return axios
    .get(CUSTOMERS_API +"?pagination=false")
    .then((response) => {
      const customers = response.data["hydra:member"];
      cache.set("customers", customers);
      return customers;
    });
}

/**
 * Permet d'ajouter un client
 * @param {Object} customer
 * @returns
 */
function addCustomer(customer) {
  return axios
    .post(CUSTOMERS_API, customer)
    .then(async (response) => {
      const cachedCustomers = await cache.get("customers");

      if (cachedCustomers) {
        cache.set("customers", [...cachedCustomers, response.data]);
      }

      return response;
    });
}

/**
 * Retorune un client à travers son ID
 * @param {integer} id
 * @returns
 */
async function getCustomer(id) {
  const cachedCustomer = await cache.get("customers." + id);
  if(cachedCustomer) return cachedCustomer;

  return axios
    .get(CUSTOMERS_API + `/${id}`)
    .then(response => {
      const customer = response.data;
      cache.set("customers." + id, customer);

      return customer;
    });
}

/**
 * Permet de mettre à jour les informations du client
 * @param {integer} id ID du client
 * @param {object} customer les informations du client
 * @returns
 */
function updateCustomer(id, customer) {
  return axios
    .put(CUSTOMERS_API + `/${id}`, customer)
    .then(async response => {
      const cachedCustomers = await cache.get("customers");
      const cachedCustomer = await cache.get("customers."+ id);

      if(cachedCustomer) cache.set("customers." + id, response.data);
      
      if (cachedCustomers) {
        const index = cachedCustomers.findIndex(c => c.id === +id);
        cachedCustomers[index] = response.data;
      }

      return response;
    });
}

/**
 * Permet de supprimer un client
 * @param {integer} id ID du client
 * @returns
 */
function deleteCustomer(id) {
  return axios
    .delete(CUSTOMERS_API +`/${id}`)
    .then(async (response) => {
      const cachedCustomers = await cache.get("customers");

      if (cachedCustomers) {
        cache.set(
          "customers",
          cachedCustomers.filter((c) => c !== id)
        );
      }

      return response;
    });
}

export default {
  getCustomers,
  delete: deleteCustomer,
  add: addCustomer,
  get: getCustomer,
  update: updateCustomer,
};
