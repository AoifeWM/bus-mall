'use strict'

const container = document.getElementById('productImages');
const resultsButton = document.getElementById('resultsButton');
const clearButton = document.getElementById('clearButton');
const results = document.getElementById('results');
let imgElements = [];
let products = [];
let prev = [];
let selections = 3;
let clicks = 0;
const totalClicks = 25;

init();

function init(){
    initProducts();
    generateImageElements();
    renderImages();
    container.addEventListener('click', handleProductClick);
}

function generateImageElements(){
    for(let i = 0; i < selections; i++){
        let img = document.createElement('img');
        img.className = 'imgClickable';
        container.appendChild(img);
        imgElements.push(img);
    }
}

function product(imageName, fileExtension = 'jpg', views = 0, likes = 0){
    this.name = imageName;
    this.src = `img/${imageName}.${fileExtension}`;
    this.fileExtension = fileExtension;
    this.views = views;
    this.likes = likes;
    products.push(this);
}

function initProducts(){
    if(localStorage.getItem('products')){
        retrieveProducts();
        clearButton.className = 'clicks-allowed';
        clearButton.addEventListener('click', handleClearButtonClick);
    }else{
        new product('bag');
        new product('banana');
        new product('bathroom');
        new product('boots');
        new product('breakfast');
        new product('bubblegum');
        new product('chair');
        new product('cthulhu');
        new product('dog-duck');
        new product('dragon');
        new product('pen');
        new product('pet-sweep');
        new product('scissors');
        new product('shark');
        new product('sweep', 'png');
        new product('tauntaun');
        new product('unicorn');
        new product('water-can');
        new product('wine-glass');
    }
    if (selections > Math.floor(products.length/2)) { 
        selections = Math.floor(products.length/2);
    }
}

function retrieveProducts(){
    let retrieved = localStorage.getItem('products');
    let parsed = JSON.parse(retrieved);
    for (let prod of parsed){
        let name = prod.name;
        let fileExtension = prod.fileExtension;
        let views = prod.views;
        let likes = prod.likes;
        new product(name, fileExtension, views, likes);
    }
}

function chooseRandom(){
    let randomNumbers = [];
    while(randomNumbers.length < selections){
        let random = Math.round(Math.random() * (products.length - 1));
        if(!randomNumbers.includes(random) && !prev.includes(random)){
            randomNumbers.push(random);
        }
    }
    prev = randomNumbers;
    return randomNumbers;
}

function renderImages(){
    let randomArray = chooseRandom();
    for(let i = 0; i < randomArray.length; i++){
        imgElements[i].src = products[randomArray[i]].src;
        imgElements[i].alt = products[randomArray[i]].name;
        products[randomArray[i]].views++;
    }
}

function handleProductClick(event){
    if (event.target === container){
        return;
    }
    clicks++;
    let selectedProduct = event.target.alt;
    for (let i = 0; i < products.length; i++){
        if (selectedProduct === products[i].name) {
            products[i].likes++;
            break;
        }
    }
    if (clicks >= totalClicks){
        //clear the selection box
        container.removeEventListener('click', handleProductClick);
        for(let i = 0; i < imgElements.length; i++){
            imgElements[i].src = '';
            imgElements[i].alt = '';
            imgElements[i].classList = '';
        }
        //make button clickable
        resultsButton.addEventListener('click', handleResultsButtonClick);
        resultsButton.className = 'clicks-allowed';
        return;
    }
    renderImages();
}

function handleClearButtonClick(){
    localStorage.removeItem('products');
    clearButton.className = '';
    clearButton.removeEventListener('click', handleClearButtonClick);
}

function handleResultsButtonClick(){
    let chartRawCanvas = document.createElement('canvas');
    let chartPercentCanvas = document.createElement('canvas');
    results.appendChild(chartRawCanvas);
    results.appendChild(chartPercentCanvas);
    const chartRaw = new Chart(chartRawCanvas, generateRawChartConfig());
    const chartPercent = new Chart(chartPercentCanvas, generatePercentChartConfig());
    storeProducts();
    resultsButton.removeEventListener('click', handleResultsButtonClick);
    resultsButton.className = '';
}

function storeProducts(){
    let stringifiedProducts = JSON.stringify(products);
    localStorage.setItem('products', stringifiedProducts);
}

function generateRawChartConfig(){
    let productNames = [];
    let productViews = [];
    let productLikes = [];
    for (let i = 0; i < products.length; i++){
        productNames.push(products[i].name);
        productViews.push(products[i].views);
        productLikes.push(products[i].likes);
    }
    const data = {
        labels: productNames,
        datasets: [{
            label: 'Likes',
            data: productLikes,
            backgroundColor: [
                'rgba(0,204,102,0.6)'
            ],
            borderColor: [
                'rgb(25,150,90)'
            ],
            borderWidth: 3
        },
        {
            label: 'Views',
            data: productViews,
            backgroundColor: [
                'rgba(102, 179, 205,0.6)'
            ],
            borderColor: [
                'rgb(25, 75, 175)'
            ],
            borderWidth: 3
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    };

    return config;
}

function generatePercentChartConfig(){
    let productNames = [];
    let productPercents = [];

    for (let i = 0; i < products.length; i++){
        let percent = Math.round(100 * (products[i].likes/products[i].views));
        productNames.push(products[i].name);
        productPercents.push(percent);
    }

    const data = {
        labels: productNames,
        datasets: [{
            label: 'Percent approval',
            data: productPercents,
            backgroundColor: [
                'rgba(229,43,80,0.6)'
            ],
            borderColor: [
                'rgb(164,0,42)'
            ],
            borderWidth: 3,
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        },
    };

    return config;
}

function storeProducts(){
    let stringifiedProducts = JSON.stringify(products);
    localStorage.setItem('products', stringifiedProducts);
    clearButton.className = 'clicks-allowed';
    clearButton.addEventListener('click', handleClearButtonClick);
}