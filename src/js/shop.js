
const recommendationsSection = document.querySelector('.recommendations');
const URLmain = 'http://localhost:3000/api/goods';
const basketWrapper = document.querySelector('.basket__products');
const deliveryInfo = document.querySelector('.delivery-info__img');
const basketResultPriceNew = document.querySelector('.basket__result-price-new');
const basketResultCount = document.querySelector('.basket__result-count');
const basketResultPrice = document.querySelector('.basket__result-price');
const basketResultDiscount = document.querySelector('.basket__result-discount');
const btnBasketDel = document.querySelector('.btn-basket-del');
const basketCheckboxAll = document.querySelector('.basket__checkbox-all');
const hrefSrc = window.location.href.split('/').slice(0, -1).join('/');


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


    // Функци изменения количества товара при нажатии на кнопки
    const ChangingQuantityGoods = () => {

    }

    // Загрузка блока корзины товаров
    const initBasket = (titleProductChange, signProduct) => {
        let basketStorage = JSON.parse(localStorage.getItem('basket')) || null;
        if (basketStorage && basketStorage !== null) {
            if (titleProductChange && signProduct) {
                basketStorage.map((item) => {
                    if (item.titleProduct == titleProductChange){
                        if(signProduct == 'Plus') {
                            item.countProduct++;
                        }
                        if(signProduct == 'Minus') {
                            item.countProduct--;
                        }       
                    }
                })
                localStorage.setItem('basket', JSON.stringify(basketStorage));
                basketWrapper.querySelector('.basket__products-items').remove();
                deliveryInfo.innerHTML = '';
            }

            let resultCountProducts = 0;
            let resultPriceProducts = 0;
            let resultPriceProductsOld = 0;

            const basketDiv  = document.createElement('div');
            basketDiv.classList.add('basket__products-items');

            basketStorage.forEach((item, index) => {
                resultCountProducts += item.countProduct;
                resultPriceProducts += (item.countProduct*item.newpriceProduct);
                resultPriceProductsOld += (item.countProduct*item.oldriceProduct);

                const basketItem  = document.createElement('div');
                basketItem.classList.add('basket__products-item');
                basketItem.insertAdjacentHTML('afterbegin',`
                    <input type="checkbox" name="basket" value="select item">
                    <img src= http://localhost:3000/${item.imageProduct} alt="Картинака товара ${index}">
                    <div class="products-items__info">
                        <h3 class="product-title">${item.titleProduct}</h3>
                        <p>Цвет: черный</p>
                        <p>Оперативная память: 16 ГБ</p>
                    </div>
                    <div class="products-item__count">
                        <button class="btn-subtract"></button>
                        <span class="quantity-goods">${item.countProduct}</span>
                        <button class="btn-increase"></button>
                    </div>
                    <div class="products-item__price">
                        <span class="basket__new-price">${item.newpriceProduct} ₽</span>
                        <span class="basket__old-price">${item.oldriceProduct} ₽</span>
                        <a href="#" class="basket__credit">В кредит от <span>5600 ₽</span></a>
                    </div>`
                );
                basketDiv.appendChild(basketItem);

                const imgDelivery  = document.createElement('img');
                imgDelivery.src = `http://localhost:3000/${item.imageProduct}`;
                deliveryInfo.appendChild(imgDelivery);
            })

            basketWrapper.appendChild(basketDiv)

            //функции при нажатии на кнопки прибавить или уменьшить количество товара
            basketWrapper.querySelectorAll('.products-item__count').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault()
                    const titleTarget = e.target.closest('.basket__products-item').querySelector('.product-title').innerText;
                  if (e.target.classList.contains('btn-subtract') || e.target.closest('btn-subtract'))  {
                    if (e.target.closest('.basket__products-item').querySelector('.quantity-goods').innerText < 2) {
                        return
                    }
                    else{
                        initBasket(titleTarget, 'Minus')
                    }
                  }
                  if (e.target.classList.contains('btn-increase') || e.target.closest('btn-increase'))  {
                    initBasket(titleTarget, 'Plus')
                  }
                })
            })

            basketResultCount.innerText = `Товары, ${resultCountProducts}  шт.`;
            basketResultPriceNew.innerText = `${resultPriceProducts} ₽`;
            basketResultPrice.innerText = `${resultPriceProductsOld} ₽`;
            basketResultDiscount.innerText = resultPriceProductsOld - resultPriceProducts;
         }
         else {
            const basketEmpty  = document.createElement('p');
            basketEmpty.style.color = 'black';
            basketEmpty.style.fontSize = "50px";
            basketEmpty.innerText = 'Корзина пуста';
            basketWrapper.append(basketEmpty);

            basketResultCount.innerText = 'Товары, 0  шт.'
            basketResultPrice.innerText = '0 ₽'
            basketResultPriceNew.innerText = '0 ₽';
            basketResultDiscount.innerText = '0 ₽';
         }
    }
    initBasket(null, null);
    
    // Нажатие на кноку удалить всё из корзины
    btnBasketDel.addEventListener('click', e => {
        e.preventDefault()
        if (basketWrapper.querySelector('.basket__products-items') && basketCheckboxAll.checked) {
            localStorage.removeItem('basket');
            basketWrapper.querySelector('.basket__products-items').remove();
            basketCheckboxAll.checked = false;
            deliveryInfo.innerHTML = '';
            initBasket(null, null);
        }
       
    })