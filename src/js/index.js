const menuBtn = document.querySelector('.header__menu');
const navMenu = document.querySelector('.navbar-menu');
const saleMain = document.querySelector('.sale__main');
const URLmain = 'http://localhost:3000/api/goods';
const hrefSrc = window.location.href.split('/').slice(0, -1).join('/');


// Открытие меню по клику
menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    menuBtn.classList.toggle('header__menu--active');
    navMenu.classList.toggle('navbar-menu--active')
})


// Функция рендера карточек
const cardsRender = (data) => {
    if(data) {
       const listWrapper  = document.createElement('ul');
       listWrapper.classList.add('sale__list', 'sale__list-main');
        
        data.forEach((item, index) => {  
          const li  = document.createElement('li');
          li.classList.add('sale__item', `sale__item_${index+1}`);

            let oldPrice = data[index].price;
            let discount = 0;
            // переход на страницу карточки по клику
            li.addEventListener('click', (e) => {
                localStorage.setItem('downloadableProduct', JSON.stringify(item.title));
                window.location.href = `${hrefSrc}/card.html`;
            })

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
// Загрузка данных карточек при загрузке
  const init = () => {
        fetch(URLmain)
        .then((response) => response.json())
        .then((data) => cardsRender(data))
        .then((cards) => saleMain.querySelector('.container').append(cards))
        .catch((err) => {
            console.log(err)
        })
  }
 init()


