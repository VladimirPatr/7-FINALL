const cardSection = document.querySelector('.card');
const cardDescription = document.querySelector('.card__description');
const recommendationsSection = document.querySelector('.recommendations');
const URLmain = 'http://localhost:3000/api/goods';
const hrefSrc = window.location.href.split('/').slice(0, -1).join('/');

// Функция рендера карточки
const cardRender = (data) => {
    //    заголовок карточки
        const title  = document.createElement('h2');
        title.classList.add('card__name');
        title.innerText = data.title;
    
    // информация карточки
       const cardWrapper  = document.createElement('div');
       cardWrapper.classList.add('card__wrapper');

       let oldPrice = data.price;
       let discount = 0;
       if (data.discount) {
           discount = data.discount;
           oldPrice = Math.round(oldPrice + (oldPrice/100*discount));
         } 

       cardWrapper.insertAdjacentHTML('afterbegin',
                `<div class="card__img">
                     <img loading="lazy" src= http://localhost:3000/${data.image} alt="Картинка товара" width="540" height="303">   
                </div>
                <div class="card__basket-wrapper">
                    <div class="card__prices">
                        <span class="new-price">${data.price} ₽</span>
                        <span class="old-price">${oldPrice} ₽</span>
                    </div>
                    <a href="#" class="card__credit-link">В кредит от 5600 ₽</a>
                    <div class="card__buttons-wrapper">
                        <button class="card__btn-basket">Добавить в корзину</button>
                        <button class="card__btn-favourites"><img src="img/icon-favourites.svg" alt=""></button>   
                    </div>
                    <div class="card__info-wrapper">
                        <div class="card__info-item">
                            <span>Доставка</span>
                            <span class="card__info-date">1-3 января</span>
                        </div> 
                        <div class="card__info-item">
                            <span>Продавец</span>
                            <span class="card__info-seller">ShopOnline</span>
                        </div> 
                    </div>
                    <a href="#" class="card__bell-link"><img src="img/icon-bell.svg" alt="">Узнать о снижении цены</a>
                </div>`
                )
                if (data.discount) {
                    cardWrapper.querySelector('.card__img').classList.add('card__img-discount');
                    cardWrapper.querySelector('.card__img').dataset.text = `${data.discount}%`;
                  } 
                  
                // функция добавления товара в корзину по клику
                const btnBasket = cardWrapper.querySelector('.card__btn-basket');

                btnBasket.addEventListener('click', (e) => {
                    let basketStorage = JSON.parse(localStorage.getItem('basket')) || [];

                    const titleProduct = data.title;
                    const newpriceProduct = data.price;
                    const oldriceProduct = oldPrice;
                    const imageProduct = data.image;
                    let countProduct = 1;
                    const newArr = [...basketStorage];

                    if (basketStorage.length && basketStorage !== []) {
                        basketStorage.map((item, index) => {
                            if (item.titleProduct == titleProduct) {
                                countProduct = item.countProduct;
                                newArr.splice(newArr.findIndex(item => item.field === "titleProduct"), 1);
                                countProduct++;
                            }
                        })
                    };
                    const card = {titleProduct, imageProduct, newpriceProduct, oldriceProduct, countProduct};
                    localStorage.setItem('basket', JSON.stringify([...newArr, card]))
                });
                
 
        // описание карточки
        const cardText  = document.createElement('p');
        cardText.classList.add('card__description-text');
        cardText.innerText = data.description;
        
        cartFull = {title, cardWrapper, cardText};
        return cartFull
    }


// Загрузка данных карточки при загрузке
const init = () => {
    const downloadableProduct = JSON.parse(localStorage.getItem('downloadableProduct'));
    localStorage.removeItem('downloadableProduct');

    fetch(URLmain)
    .then((response) => response.json())
    .then((data) => data.filter(item => item.title == downloadableProduct))
    .then((item) => cardRender(item[0]))
    .then((full) => 
     cardSection.prepend(full.title, full.cardWrapper) &
     cardDescription.append(full.cardText)
    )
    .catch((err) => {
        console.log(err)
    })
}
init()



// Функция рендера карточек для секции Рекомендуемые
const cardsRenderRecom = (data) => {
    if(data) {
       const listWrapper  = document.createElement('ul');
       listWrapper.classList.add('sale__list');
        
        data.forEach((item, index) => {  
          const li  = document.createElement('li');
          li.classList.add('sale__item', `sale__item_${index+1}`);
          // переход на страницу карточки по клику
          li.addEventListener('click', (e) => {
            localStorage.setItem('downloadableProduct', JSON.stringify(item.title));
            window.location.href = `${hrefSrc}/card.html`;
          })

            let oldPrice = data[index].price;
            let discount = 0;
            if (data[index].discount) {
                discount = data[index].discount;
                oldPrice = Math.round(oldPrice + (oldPrice/100*discount));
                li.classList.add('sale__item-discount');
                li.dataset.text = `${data[index].discount}%`;
              }   

            li.insertAdjacentHTML('afterbegin',`
                <img loading="lazy" src= http://localhost:3000/${item.image} alt="Картинка скидок" class="stock__img" width="325" height="295">
                <div class="sale__wrapper-prices">
                    <span class="price-sale">${data[index].price} ₽</span>
                    <span class="price-full">${oldPrice} ₽</span>
                </div>
                <p class="sale__description">${data[index].title}</p>`
            );
            listWrapper.appendChild(li);
           
        });
        return listWrapper
    }
}

// Загрузка блока рекомендаций при загрузке
const initRecommendation = () => {
    fetch(URLmain)
    .then((response) => response.json())
    .then((data) => data.slice(0, 8))
    .then((items) => cardsRenderRecom(items))
    .then((cards) => recommendationsSection.append(cards))
    .catch((err) => {
        console.log(err)
    })
}
initRecommendation()



