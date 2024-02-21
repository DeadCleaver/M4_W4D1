const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const authToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQ1MDEyZTljNDM3MDAwMTkzYzM3ZGQiLCJpYXQiOjE3MDg0NTgyODYsImV4cCI6MTcwOTY2Nzg4Nn0.1WmrZJX_BCGJ4WYUtFTFdUhrcOu2J0ryxgeFhlzWhfc"
const prodImg = document.getElementById("my-prod-img");
const prodName = document.getElementById("my-prod-name");
const prodBrand = document.getElementById("my-prod-brand");
const prodDescr = document.getElementById("my-prod-descr");
const prodPrice = document.getElementById("my-prod-price");


const params = new URLSearchParams (location.search);
const id = params.get("q");
console.log(id);

getData();

async function getData() {
    try {
        const res = await fetch(apiUrl + id, { headers: { "Authorization": authToken } });
        const json = await res.json();
        console.log(json);
        loadProduct(json);
    } catch (error) {
        console.log(error);
    }
};

function loadProduct({ name, description, price, imageUrl, brand }) {
    prodImg.src = imageUrl;
    prodImg.alt = name;
    prodName.innerText = name;
    prodBrand.innerText = brand;
    prodDescr.innerText = description;
    prodPrice.innerText = price;
};



