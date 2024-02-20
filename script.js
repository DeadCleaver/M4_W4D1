const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const authToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQ1MDEyZTljNDM3MDAwMTkzYzM3ZGQiLCJpYXQiOjE3MDg0NTgyODYsImV4cCI6MTcwOTY2Nzg4Nn0.1WmrZJX_BCGJ4WYUtFTFdUhrcOu2J0ryxgeFhlzWhfc"

const editTabBody = document.getElementById("edit-tab-body");
const prodsGallery = document.getElementById("products-gallery");

const prodNameField = document.getElementById("name-fld");
const prodDescrField = document.getElementById("description-fld");
const prodBrandField = document.getElementById("brand-fld");
const prodImgField = document.getElementById("image-fld");
const prodPriceField = document.getElementById("price-fld");
const addProdBtn = document.getElementById("add-product-button");

addProdBtn.addEventListener("click", addProduct);
syncProducts();

async function addProduct() {
    // Verifica di validazione:

    if (prodNameField.value && prodDescrField.value && prodBrandField.value && prodImgField.value && prodPriceField.value) {
        // Acquisisco i valori degli input per l'aggiunta del nuovo prodotto:
        let newProduct = { "name": prodNameField.value, "description": prodDescrField.value, "brand": prodBrandField.value, "imageUrl": prodImgField.value, "price": prodPriceField.value };

        try {
            const res = await fetch(apiUrl, {
                method: "POST", body: JSON.stringify(newProduct), headers: {
                    "Content-type": "application/json;charset=UTF-8",
                    "Authorization": authToken
                }
            });
            syncProducts();
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Devi inserire tutti e 5 i campi obbligatori!");
    }
};

async function syncProducts() {
    editTabBody.innerHTML = "";
    prodsGallery.innerHTML = "";
    
    try {
        const res = await fetch(apiUrl, { headers: { "Authorization": authToken } });
        const json = await res.json();

        json.forEach((product) => {
            createProductRow(product);
            createProductCard(product);
        });
    } catch (error) {
        console.log(error);
    }

};

function createProductRow({ name, description, brand, price, _id }) {

    let tableRow = document.createElement("tr");

    let rowName = document.createElement("th");
    rowName.innerText = name;
    let rowDesc = document.createElement("td");
    rowDesc.innerText = description;
    let rowBrand = document.createElement("td");
    rowBrand.innerText = brand;
    let rowPrice = document.createElement("td");
    rowPrice.innerText = price;

    let opsBtns = document.createElement("td");

    // Tasto di modifica:
    let editBtn = document.createElement("a");
    editBtn.classList.add("btn", "btn-warning", "btn-sm");
    let editImg = document.createElement("ion-icon");
    editImg.setAttribute("name", "pencil")

    editBtn.appendChild(editImg);

    // Tasto di cancellazione:
    let delBtn = document.createElement("a");
    delBtn.classList.add("btn", "btn-danger", "btn-sm", "ms-3");
    let delImg = document.createElement("ion-icon");
    delImg.setAttribute("name", "trash-bin");
    delBtn.addEventListener("click", () => deleteProduct(_id));

    delBtn.appendChild(delImg);

    opsBtns.appendChild(editBtn);
    opsBtns.appendChild(delBtn);


    tableRow.appendChild(rowName);
    tableRow.appendChild(rowDesc);
    tableRow.appendChild(rowBrand);
    tableRow.appendChild(rowPrice);
    tableRow.appendChild(opsBtns);

    editTabBody.appendChild(tableRow);
};

function createProductCard({ name, imageUrl, price }) {

    let cardContainer = document.createElement("div");

    let prodCard = document.createElement("div");
    prodCard.classList.add("card", "shadow");

    let prodImg = document.createElement("img");
    prodImg.classList.add("card-img-top");
    prodImg.src = imageUrl;
    prodImg.alt = name;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let prodName = document.createElement("h5");
    prodName.innerText = name;

    let cardFooter = document.createElement("div");
    cardFooter.classList.add("d-flex", "justify-content-between", "align-items-center", "pt-auto");

    let priceTag = document.createElement("h6");
    let prodPrice = document.createElement("span");
    priceTag.classList.add("fw-bold");
    prodPrice.classList.add("fw-light");
    priceTag.innerText = "Price: ";
    prodPrice.innerText = price;
    priceTag.appendChild(prodPrice);

    let prodShowBtn = document.createElement("a");
    prodShowBtn.classList.add("btn", "btn-warning", "btn-sm");
    prodShowBtn.innerText = "Show details";

    cardFooter.appendChild(priceTag);
    cardFooter.appendChild(prodShowBtn);

    cardBody.appendChild(prodName);
    cardBody.appendChild(cardFooter);
    prodCard.appendChild(prodImg);
    prodCard.appendChild(cardBody);
    cardContainer.appendChild(prodCard);
    
    prodsGallery.appendChild(cardContainer);
};

async function deleteProduct(_id) {
    try {
        const res = await fetch(apiUrl + _id, { method: "DELETE", headers: { 
            "Content-type": "application/json",
            "Authorization": authToken } });
        if (res.ok) {
            syncProducts();
        } else {
            console.log("Errore durante la cancellazione del prodotto");
        }

    } catch (error) {
        console.log(error);
    }
};