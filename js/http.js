const baseUrl = "../data/products.json";
//const baseUrl = "http://makeup-api.herokuapp.com/api/v1/products.json";

function fetchJson(url, options) {
   return fetch(url, options)
     .then((r) => {
       if (r.ok) {
         return r.json();
       } else {
         throw new Error(r.statusText);
       }
     })
     .catch((error) => {
       showError("Error loading data", error);
       throw error;
     });
}

function searchProducts() {
   return fetchJson(`${baseUrl}`);
 }