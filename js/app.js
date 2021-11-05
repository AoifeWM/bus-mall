'use strict'

const container = document.getElementById('productImages');
const button = document.getElementById('button');
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

function product(imageName, fileExtension = 'jpg'){
    this.name = imageName;
    this.src = `img/${imageName}.${fileExtension}`;
    this.views = 0;
    this.likes = 0;
    products.push(this);
}

function initProducts(){
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
    if (selections > Math.floor(products.length/2)) { 
        selections = Math.floor(products.length/2);
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
    // for(let i = 0; i < selections; i++){
    //     let random = Math.round(Math.random() * (products.length - 1));
    //     while(randomNumbers.includes(random)){
    //         random = Math.round(Math.random() * (products.length - 1));
    //     }
    //     randomNumbers.push(random);
    // }
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
        button.addEventListener('click', handleButtonClick);
        button.className = 'clicks-allowed';
        return;
    }
    renderImages();
}

function handleButtonClick(){
    // let ul = document.createElement('ul');
    // results.appendChild(ul);
    // for (let i = 0; i < products.length; i++){
    //     let sView = 's';
    //     if(products[i].views === 1){
    //         sView = '';
    //     }
    //     let sLike = 's';
    //     if(products[i].likes === 1){
    //         sLike = '';
    //     }
    //     let percent = Math.round(100 * (products[i].likes/products[i].views));
    //     let percentMessage = ` (${percent}% of the time it was available)`;
    //     if(isNaN(percent)){
    //         percentMessage = '';
    //     }

    //     let li = document.createElement('li');
    //     li.textContent = `${products[i].name} was viewed ${products[i].views} time${sView} and selected ${products[i].likes} time${sLike}${percentMessage}.`
    //     ul.appendChild(li);
    // }
    let chartRawCanvas = document.createElement('canvas');
    let chartPercentCanvas = document.createElement('canvas');
    results.appendChild(chartRawCanvas);
    results.appendChild(chartPercentCanvas);
    // chartRawCanvas.height = 200;
    // chartPercentCanvas.height = 200;
    // chartRawCanvas.width = 400;
    // chartPercentCanvas.width = 400;
    const chartRaw = new Chart(chartRawCanvas, generateRawChartConfig());
    const chartPercent = new Chart(chartPercentCanvas, generatePercentChartConfig());
    
    button.removeEventListener('click', handleButtonClick);
    button.className = '';
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