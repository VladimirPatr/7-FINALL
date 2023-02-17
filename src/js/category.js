
const section = document.querySelector('.recommendations');
const arrCategory = [];
const hrefSrc = window.location.href.split('/').slice(0, -1).join('/');

// Рендер карточек и заголовков по категориям
const categoryRender = async (category) => {
    category.forEach((item) => {
        const title  = document.createElement('h3');
        title.classList.add('recommendations__title');
        title.innerText = item;
        section.append(title);

        const ul  = document.createElement('ul');
        ul.classList.add('sale__list');

       fetch(`http://localhost:3000/api/goods/category/${item}`)
        .then((response) => response.json())
        .then((data) => data.forEach((item, index) => {

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
            ul.appendChild(li)
        })) 
        .catch((err) => {
            console.log(err)
        })
        section.appendChild(ul)
        
    })
    
}

// Загрузка карточек по категориям при загрузке
const init = () => {
    fetch('http://localhost:3000/api/category')
    .then((response) => response.json())
    .then((data) => data.forEach(item => {
        arrCategory.push(item)
    }))
    .then(() => categoryRender(arrCategory))
    .catch((err) => {
        console.log(err)
    })
}
init()
