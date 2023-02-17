const articlesWrapper = document.querySelector('.blog__carts');
const blogPagination = document.querySelector('.blog__pagination');
const containerPag = document.querySelector('.container-pagination');
const arrowBtn = document.getElementsByClassName('btn-arrow');



const loadArticles = async (cb ) => {

   const num = window.location.search.substring(6);
   const url = `https://gorest.co.in/public-api/posts?page=${num}`;

    const result = await fetch(url);
    const array = await result.json();
    // const maxPage = array.meta.pagination.page;

    cb(array)
};

const renderArticle = (array) => {
    const data = array.data;
    const cartWrapper = document.createElement('ul');
    cartWrapper.className = 'news-wrapper';
    let numImg = 0;
    const articles = data.map(item => {
        numImg++;

        const card = document.createElement('li');
        card.className = 'news-cart';
        
        card.insertAdjacentHTML(
            'beforeend',
            `<a href="#" class="img-crop">
                <img src="./img/blog-img-${numImg}.png" alt="">
            </a>          
            <div class="news-text__wrapper">
                <a href= "article.html?id= ${item.id}">${item.title}</a>
                <p>29 октября 2020, 12:42</p>
                <div class = "icons-wrapper">
                    <p>1.9K</p>
                    <p>0</p>
                </div>
            </div>
            
            `,);
        return card;
    });
    cartWrapper.append(...articles);
    articlesWrapper.append(cartWrapper)
};

// const eventsBtn = () => {
//    for (let arrow of arrowBtn) {
//         arrow.addEventListener('click', (e) =>{
//             // e.target.classList.add('active');\
//             alert(arrow)
//         })
//   }
// }

const renderPagination = async () => {
    const url = `https://gorest.co.in/public-api/posts?page=1`;
         const result = await fetch(url);
         const array = await result.json();
         const maxPage = array.meta.pagination.pages;

        const urlParam = new URLSearchParams(window.location.search);
        let firstPage = Number(urlParam.get('page')) ;
        if (firstPage <= 0 || firstPage == null) {
            firstPage = 1;
        }
        if (firstPage > maxPage - 3 && maxPage != 1) {
            firstPage = maxPage -3 ;

        }
        // const  firstPage = Number(window.location.search.substring(6)) -1 ;
        containerPag.insertAdjacentHTML(
            'beforeend',
            `<a href="blog.html?page = ${firstPage - 1}" class="btn-arrow-left btn-arrow">
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_0_255)">
                    <path d="M32.375 16.9583H10.5296L16.0487 11.4237L13.875 9.25L4.625 18.5L13.875 27.75L16.0487 25.5763L10.5296 20.0417H32.375V16.9583Z" fill="#8F8F8F"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_0_255">
                    <rect width="37" height="37" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </a>
                <ul class="pagination-list">
                    <li class="pagination-item "><a href="blog.html?page =${firstPage}">${firstPage}</a></li>
                    <li class="pagination-item" ><a href="blog.html?page=${firstPage + 1}">${firstPage + 1}</a></li>
                    <li class="pagination-item"><a href="blog.html?page=${firstPage + 2}">${firstPage + 2}</a></li>
                </ul>
                <a href="blog.html?page=${firstPage + 3}" class = "btn-arrow-right btn-arrow ">
                    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_0_258)">
                    <path d="M4.625 16.9583H26.4704L20.9513 11.4237L23.125 9.25L32.375 18.5L23.125 27.75L20.9513 25.5763L26.4704 20.0417H4.625V16.9583Z" fill="#8F8F8F"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_0_258">
                    <rect width="37" height="37" fill="white" transform="matrix(-1 0 0 1 37 0)"/>
                    </clipPath>
                    </defs>
                    </svg>
                </a>
            `,);
          

            return containerPag;
    };
   
loadArticles(renderArticle);
renderPagination();
// eventsBtn()

