const DEFAULT_TIMEOUT_INPUT_IN_MILIS = 1000;
const sortTypeElement = document.getElementById("sort-type");
const filterBrandElement = document.getElementById("filter-brand");
const filterTypeElement = document.getElementById("filter-type");
const filterNameElement = document.getElementById("filter-name");
const catalogElement = document.getElementById("catalog");

let products = [];
let filteredProducts = [];
let brands = [];
let types = [];

async function init() {
  products = await searchProducts();
  filteredProducts = [...products];
  sortTypeElement.addEventListener("change", renderProdutcs, false);
  loadTypesBrands();
  renderProdutcs();
}
init();

function loadTypesBrands() {
  brands = products
    .map(p => p.brand)
    .filter((value, index, self) => value && self.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b));

  for (b of brands) {
    const option = document.createElement("option");
    option.textContent = b;
    option.value = b;
    filterBrandElement.appendChild(option);
  }
  filterBrandElement.addEventListener("change", filterProducts);

  types = products
    .map(p => p.product_type)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b));

  for (t of types) {
    const option = document.createElement("option");
    option.textContent = t;
    option.value = t;
    filterTypeElement.appendChild(option);
  }
  filterTypeElement.addEventListener("change", filterProducts);

  filterNameElement.addEventListener(
    "input",
    filterWithDelay(filterProducts, DEFAULT_TIMEOUT_INPUT_IN_MILIS)
  );
}

function filterProducts(evt) {
  if (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  filteredProducts = [...products];

  if (filterBrandElement.value != "T") {
    filteredProducts = filteredProducts.filter(
      (p, index, self) => p.brand === filterBrandElement.value
    );
  }
  if (filterTypeElement.value != "T") {
    filteredProducts = filteredProducts.filter(
      (p, index, self) => p.product_type === filterTypeElement.value
    );
  }
  if (filterNameElement.value != "") {
    filteredProducts = filteredProducts.filter(
      (p, index, self) =>
        p.name.toLowerCase().indexOf(filterNameElement.value.toLowerCase()) > -1
    );
  }

  renderProdutcs();
}

function renderProdutcs(evt) {
  if (evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }
  let productsItensHtml = [];
  sortProducts();
  for (const p of filteredProducts) {
   productsItensHtml.push(loadProductItem(p));
  }
  catalogElement.innerHTML = productsItensHtml.join("");
}

function sortProducts() {
  const sortTypeValue = sortTypeElement.value;

  switch (sortTypeValue) {
    case "ratingDesc":
      sort("rating", "desc");
      break;

    case "priceAsc":
      sort("price", "asc");
      break;

    case "priceDesc":
      sort("price", "desc");
      break;

    case "AZ":
      sort("name", "asc");
      break;

    case "ZA":
      sort("name", "desc");
      break;

    default:
      sort("rating", "asc");
      break;
  }
}

function sort(field, type) {
  filteredProducts.sort((a, b) => {
    let aValue, bValue;

    if (field == "price" || field == "rating") {
      aValue = a[field] ? +a[field] : 0;
      bValue = b[field] ? +b[field] : 0;
      return type == "asc" ? aValue - bValue : bValue - aValue;
    } else if (field == "name") {
      return type == "asc"
        ? a[field].localeCompare(b[field])
        : b.name.localeCompare(a.name);
    }
  });
}

function loadProductItem(product) {
  const convertedPrice = priceConverter(product.price);
  const itemDetails = loadProductDetails(product, convertedPrice);
  return `
   <div 
      class="product" 
      data-name="${product.name}" 
      data-brand="${product.brand}" 
      data-type="${product.product_type}" 
      tabindex="${product.id}">
      <figure class="product-figure">
         <img 
            src="${product.image_link}" 
            width="215" 
            height="215" 
            alt="${product.name}" 
            onerror="javascript:this.src='img/unavailable.png'">
      </figure>
      <section class="product-description">
         <h1 class="product-name">${product.name}</h1>
         <div class="product-brands">
            <span class="product-brand background-brand">${product.brand}</span>
            <span class="product-brand background-price">${convertedPrice}</span>
         </div>
      </section>
      ${itemDetails}
   </div>`;
}


function loadProductDetails(product, convertedPrice) {
  return `
   <section class="product-details">
      <div class="details-row">
         <div>Brand</div>
         <div class="details-bar">
            <div class="details-bar-bg" style="width= 250">
               ${product.brand ? product.brand : "&nbsp;"}
            </div>
         </div>
      </div>
      
      <div class="details-row">
         <div>Price</div>
         <div class="details-bar">
            <div class="details-bar-bg" style="width= 250">${convertedPrice}</div>
         </div>
      </div>

      <div class="details-row">
         <div>Rating</div>
         <div class="details-bar">
            <div class="details-bar-bg" style="width= 250">
               ${product.rating ? product.rating : "&nbsp;"}
            </div>
         </div>
      </div>
      
      <div class="details-row">
         <div>Category</div>
         <div class="details-bar">
            <div class="details-bar-bg" style="width= 250">
               ${product.category ? product.category : "&nbsp;"}
            </div>
         </div>
      </div>
      
      <div class="details-row">
         <div>Product_type</div>
         <div class="details-bar">
            <div class="details-bar-bg" style="width= 250">
               ${product.product_type ? product.product_type : "&nbsp;"}
            </div>
         </div>
      </div>
   </section>`;
}
