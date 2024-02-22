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
const loadingSpinner = document.getElementById("loading-spinner");

const editFormModal = document.getElementById("edit-form-modal");
const editName = document.getElementById("edit-name");
const editBrand = document.getElementById("edit-brand");
const editDescr = document.getElementById("edit-description");
const editImg = document.getElementById("edit-img-url");
const editPrice = document.getElementById("edit-price");

const closeModalImg = document.querySelector(".btn-close");
const closeModalBtn = document.getElementById("edit-close-btn");
const savChangesBtn = document.getElementById("save-edit-btn");


closeModalImg.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
addProdBtn.addEventListener("click", addProduct);
savChangesBtn.addEventListener("click", ()=> { saveChanges(idProdToSave)} );

let idProdToSave;

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
    loadingSpinner.classList.toggle("d-none");

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
    loadingSpinner.classList.toggle("d-none");
};

function createProductRow({ name, description, brand, price, imageUrl, _id }) {

    let tableRow = document.createElement("tr");

    let rowName = document.createElement("th");
    rowName.innerText = name;
    let rowDesc = document.createElement("td");
    rowDesc.innerText = description;
    let rowBrand = document.createElement("td");
    rowBrand.innerText = brand;
    let rowPrice = document.createElement("td");
    rowPrice.innerText = price;

   // <img src="..." class="img-thumbnail" alt="..."></img>
    let rowImg = document.createElement("td");
    rowImg.classList.add("d-flex", "justify-content-center");

    let rowImgThumb = document.createElement("img");
    rowImgThumb.classList.add("img-thumbnail");
    rowImgThumb.src = imageUrl;
    rowImg.appendChild(rowImgThumb);

    let opsBtns = document.createElement("td");

    // Tasto di modifica:
    let editBtn = document.createElement("a");
    editBtn.classList.add("btn", "btn-warning", "btn-sm");
    let editImg = document.createElement("ion-icon");
    editImg.setAttribute("name", "pencil");

    editBtn.appendChild(editImg);
    editBtn.addEventListener("click", () => {
        showModal(_id);
    });

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
    tableRow.appendChild(rowImg);
    tableRow.appendChild(opsBtns);

    editTabBody.appendChild(tableRow);
};

function createProductCard({ name, imageUrl, price, _id }) {

    let cardContainer = document.createElement("div");

    let prodCard = document.createElement("div");
    prodCard.classList.add("card", "shadow");

    let prodImg = document.createElement("img");
    prodImg.classList.add("card-img-top", "img-sizing");
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
    prodShowBtn.href = `details.html?q=${_id}`;

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
        const res = await fetch(apiUrl + _id, {
            method: "DELETE", headers: {
                "Content-type": "application/json",
                "Authorization": authToken
            }
        });
        if (res.ok) {
            syncProducts();
        } else {
            console.log("Errore durante la cancellazione del prodotto");
        }

    } catch (error) {
        console.log(error);
    }
};

async function showModal(_id) {
    editFormModal.classList.add("show", "fade");
    editFormModal.style.display = "block";

    document.body.classList.toggle("modal-open");
    const backDrop = document.createElement("div");
    backDrop.classList.add("modal-backdrop", "fade", "show");
    document.body.appendChild(backDrop);

    idProdToSave = _id;

    try {
        const res = await fetch(apiUrl + _id, { headers: { "Authorization": authToken } });
        const json = await res.json();

        editName.value = json.name;
        editBrand.value = json.brand;
        editDescr.value = json.description;
        editImg.value = json.imageUrl;
        editPrice.value = json.price;

    } catch (error) {
        console.log(error);
    }
};

async function saveChanges(_id) {

    try {
        const savedProd = {
            "name": editName.value,
            "description": editDescr.value,
            "brand": editBrand.value,
            "imageUrl": editImg.value,
            "price": editPrice.value
        }

        const res = await fetch(apiUrl + _id, {
            method: "PUT", 
            headers: {
                "Content-type": "application/json",
                "Authorization": authToken
            },
            body: JSON.stringify(savedProd)
        });
        if (res.ok) {
            syncProducts();
            closeModal(); 
        } else {
            console.log("Errore durante il salvataggio delle modifiche");
        }

    } catch (error) {
        console.log(error);
    };
};

function closeModal() {
    editFormModal.classList.remove("show", "fade");
    editFormModal.style.display = "none";
    document.body.classList.toggle("modal-open");
    const backDrop = document.querySelector(".modal-backdrop");
    backDrop.remove();
};
