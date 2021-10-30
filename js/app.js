'use strict'

const container = document.getElementById('productImages');
const button = document.getElementById('button');
const results = document.getElementById('results');
let imgElements = [];
let products = [];
const selections = 9;
let clicks = 0;
const totalClicks = 25;


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
}

function chooseRandom(){
    let randomNumbers = [];
    for(let i = 0; i < selections; i++){
        let random = Math.round(Math.random() * (products.length - 1));
        while(randomNumbers.includes(random)){
            random = Math.round(Math.random() * (products.length - 1));
            console.log('rerolled random as ' + random);
        }
        randomNumbers.push(random);
        console.log(`array ${randomNumbers}`)
    }
    return randomNumbers;
}

function renderImages(){
    let randomArray = chooseRandom();
    for(let i = 0; i < randomArray.length; i++){
        imgElements[i].src = products[randomArray[i]].src;
        imgElements[i].alt = products[randomArray[i]].name;
        products[randomArray[i]].views++;
        console.log(`array at render time is ${randomArray}`);
        console.log(`rendered image ${products[randomArray[i]].name} at spot ${i} due to roll ${randomArray[i]}`);
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
    let ul = document.createElement('ul');
    results.appendChild(ul);
    for (let i = 0; i < products.length; i++){
        let sView = 's';
        if(products[i].views === 1){
            sView = '';
        }
        let sLike = 's';
        if(products[i].likes === 1){
            sLike = '';
        }
        let percent = Math.round(100 * (products[i].likes/products[i].views));
        let percentMessage = ` (${percent}% of the time it was available)`;
        if(isNaN(percent)){
            percentMessage = '';
        }

        let li = document.createElement('li');
        li.textContent = `${products[i].name} was viewed ${products[i].views} time${sView} and selected ${products[i].likes} time${sLike}${percentMessage}.`
        ul.appendChild(li);
    }
    button.removeEventListener('click', handleButtonClick);
    button.className = '';
}

generateImageElements();
initProducts();
renderImages();
container.addEventListener('click', handleProductClick);