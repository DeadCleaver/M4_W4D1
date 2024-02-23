// dichiaro le variabili e le costanti, acchiappo gli elementi del dom generali
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

const alertBody = document.getElementById("my-alert");

closeModalImg.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
addProdBtn.addEventListener("click", addProduct);
savChangesBtn.addEventListener("click", ()=> { saveChanges(idProdToSave)} );

let idProdToSave;

//carico i prodotti sulla pagina edit e sulla galleria principale tutte insieme
syncProducts();

// funzione per aggiungere i prodotti
async function addProduct() {

    if (prodNameField.value && prodDescrField.value && prodBrandField.value && prodImgField.value && prodPriceField.value) {
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
        // console.log("Devi inserire tutti e 5 i campi obbligatori!");

        alertBody.classList.toggle("d-none");

        setTimeout(() => {
           alertBody.classList.toggle("d-none");
        }, 5000);

    }
};

// funzione generale per sincronizzare prodotti nella pagina edit e nella galleria, insieme
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
        alert(error);
    }
    loadingSpinner.classList.toggle("d-none");
};

//funzione per creare una row relativa al prodotto aggiunto con gli elementi DOM relativi

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

    let rowImg = document.createElement("td");
    rowImg.classList.add("d-flex", "justify-content-center");

    let rowImgThumb = document.createElement("img");
    rowImgThumb.classList.add("img-thumbnail");
    rowImgThumb.src = imageUrl;
    rowImg.appendChild(rowImgThumb);

    let opsBtns = document.createElement("td");

    // Tasto di modifica:
    let editBtn = document.createElement("a");
    editBtn.classList.add("btn", "btn-warning", "btn-sm", "m-2");
    let editImg = document.createElement("ion-icon");
    editImg.setAttribute("name", "pencil");

    editBtn.appendChild(editImg);
    editBtn.addEventListener("click", () => {
        showModal(_id);
    });

    // Tasto di cancellazione:
    let delBtn = document.createElement("a");
    delBtn.classList.add("btn", "btn-danger", "btn-sm", "m-2");
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

// funzione per creare elemento dom della card
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
    prodName.classList.add("text-ellipsis");

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
    prodShowBtn.target = "_blank";

    cardFooter.appendChild(priceTag);
    cardFooter.appendChild(prodShowBtn);

    cardBody.appendChild(prodName);
    cardBody.appendChild(cardFooter);
    prodCard.appendChild(prodImg);
    prodCard.appendChild(cardBody);
    cardContainer.appendChild(prodCard);

    prodsGallery.appendChild(cardContainer);
};

//funzione per cancellare un prodotto dalla pagina edit
async function deleteProduct(_id) {
    const confirmation = confirm("sei sicuro di voler procedere alla cancellazione del prodotto?");

    if (confirmation) {
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
               alert("Errore durante la cancellazione del prodotto");
            }
    
        } catch (error) {
            alert(error);
        }
    } else {
        alert("cancellazione annullata");
    };
};

//funzione per mostrare il modale, e valorizzarne i campi interni usando l'id del relativo eventlistener
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
       alert(error);
    }
};

//funzione per salvare le modifiche dalla pagina dal modale di edit
async function saveChanges(_id) {

    if (editName.value && editDescr.value && editBrand.value && editImg.value && editPrice.value) {

    const savedProd = {
        "name": editName.value,
        "description": editDescr.value,
        "brand": editBrand.value,
        "imageUrl": editImg.value,
        "price": editPrice.value
    }

    try {
        
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
           alert("Errore durante il salvataggio delle modifiche");
        }

    } catch (error) {
        alert(error);
    };

    } else {
        alert("Devi inserire tutti e 5 i campi obbligatori");
    }

};

//funzione per chiudere il modale
function closeModal() {
    editFormModal.classList.remove("show", "fade");
    editFormModal.style.display = "none";
    document.body.classList.toggle("modal-open");
    const backDrop = document.querySelector(".modal-backdrop");
    backDrop.remove();
};

