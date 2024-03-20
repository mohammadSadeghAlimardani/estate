
/* ==== ACCORDION ==== */
/* =================== */

let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("currentActive");
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    });
}

/* ==== SIDEBAR ==== */
/* ================= */

const showSidebarBtn = document.querySelector(".show-sidebar-btn");
const sidebar = document.querySelector(".sidebar");
const hideSidebarBtn = document.querySelector(".hide-sidebar-btn");
const mask = document.querySelector(".mask");

showSidebarBtn.addEventListener("click", function(e){
    e.preventDefault();
    mask.classList.add("show");
    sidebar.classList.add("show");
})
hideSidebarBtn.addEventListener("click", function(e){
    e.preventDefault();
    mask.classList.remove("show");
    sidebar.classList.remove("show");
})



//-----------------------
/* ===== COUNT UP ===== */

const projectsStatisticDOM = document.querySelector(".projects-statistic");

let projectsStatisticFinal = [19000, 25000, 12, 125000];
let projectsStatisticPrimary = [0, 0, 0, 0];

window.addEventListener("scroll", function(e){

    if(window.scrollY >= projectsStatisticDOM.getBoundingClientRect().y + 300){
        
        let increase = setInterval(() => {
            projectsStatisticPrimary.map((item, index) => {
                if(index == 0){
                    if(projectsStatisticPrimary[index] == projectsStatisticFinal[index]){
                        document.querySelectorAll(".projects-statistic div h2")[index].textContent = projectsStatisticFinal[index] + "+";
                    }else{
                        increaseNumber(2, index);
                    }
                }else if(index == 1){
                    if(projectsStatisticPrimary[index] == projectsStatisticFinal[index]){
                        document.querySelectorAll(".projects-statistic div h2")[index].textContent = projectsStatisticFinal[index] + "+";
                    }else{
                        increaseNumber(2, index);
                    }
                }else if(index == 2){
                    if(projectsStatisticPrimary[index] >= projectsStatisticFinal[index]){
                        document.querySelectorAll(".projects-statistic div h2")[index].textContent = projectsStatisticFinal[index] + "+";
                    }else{
                        increaseNumber(0.001, index);
                    }
                }else{
                    if(projectsStatisticPrimary[index] == projectsStatisticFinal[index]){
                        document.querySelectorAll(".projects-statistic div h2")[index].textContent = projectsStatisticFinal[index] + "+";
                        clearInterval(increase);
                    }else{
                        increaseNumber(10, index);
                    }
                }
            })
        }, 1);
    }
})

function increaseNumber(step, index){

    projectsStatisticPrimary[index] = projectsStatisticPrimary[index] + step;
    document.querySelectorAll(".projects-statistic div h2")[index].textContent = parseInt(projectsStatisticPrimary[index]) + "+";
}


// -------------------
/* ===== POPULAR ITEMS ===== */

const popularItemsURL = './api/popular-items.json';
const popularItemsDOM = document.querySelector(".popular-items");

async function fetchPopularItems(){
    const response = await fetch(popularItemsURL);
    const data = await response.json();
    displayPopularItems(data);
}

function displayPopularItems(popularItems){

    const activeField = document.querySelector(".popularList .popularList-container > section ul li.active a");
    

    popularItemsDOM.innerHTML = popularItems.map(popularItem => {

        const {price, address, image, components, area, field} = popularItem;
        const {province, country} = address;
        const {bed, bath} = components;

        if(field == activeField.dataset.field){

            return  `<article>
                    <div class="popular-item-image">
                        <img src="${image}" />
                    </div>
                    <ul>
                        <li>$${price}</li>
                        <li>
                            <i class="fa-solid fa-arrow-up"></i>
                        </li>
                    </ul>
                    <section>
                        <div>
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${province}<br/>${country}</span>
                        </div>
                        <ul>
                            <li>
                                <i class="fa-solid fa-bed"></i> ${bed}
                                <h6>Beds</h6>
                            </li>
                            <li>
                                <i class="fa-solid fa-toilet"></i> ${bath}
                                <h6>Baths</h6>
                            </li>
                            <li>
                                <i class="fa-regular fa-square"></i> ${area}
                                <h6>Sq.Ft</h6>
                            </li>
                        </ul>
                    </section>
                </article>`
        }

    }).join("");
}

const filterBtns = document.querySelectorAll(".popularList .popularList-container > section ul li a");
filterBtns.forEach(filterBtn => {
    const field = filterBtn.dataset.field;
    filterBtn.addEventListener("click", async(e)=>{
        e.preventDefault();
        const response = await fetch(popularItemsURL);
        const data = await response.json();
        const newpopularItems = data.filter(popularItem => {
            return popularItem.field == field;
        })
        changeActiveLink(e.target);
        displayPopularItems(newpopularItems);
    })
})


function changeActiveLink(currentLink){
    const listItems = document.querySelectorAll(".popularList .popularList-container > section ul li");
    listItems.forEach(listItem => {
        listItem.classList.remove("active");
    })
    currentLink.parentElement.classList.add("active");
}


// -------------------
/* ===== USER-COMMENTS ===== */

let activeIndex = 1;
const userCommentsURL = "./api/user-comments.json";
const commentsDOM = document.querySelector(".comments");

async function fetchUserComments(){
    const response = await fetch(userCommentsURL);
    const data = await response.json();
    displayUserComments(data);
}

function displayUserComments(comments){

    commentsDOM.innerHTML = comments.map((comment, index) => {

        const {image, userName, userJob, userText, userStars} = comment;

        return  `<article>
                    <div class="user-image">
                        <img src="${image}" alt="${userName}"/>
                        <div class="user-stars">
                            <i class="fa-solid fa-star"></i>
                            ${userStars}
                        </div>
                    </div>
                    <h2 class="user-name">${userName}</h2>
                    <h3 class="user-job">${userJob}</h3>
                    <p class="user-text">
                        "${userText}"
                    </p>
                </article>`;

    }).join("");

    const articles = document.querySelectorAll(".userComments .comments article");
    articles.forEach((article, index) => {
        article.style.transform = `translateX(${index * 100}%)`;
    })

    let scrollWidth = commentsDOM.getBoundingClientRect().width;
    let maxActiveIndex;
    let minActiveIndex;
    if(window.innerWidth > 1170){
        scrollWidth = scrollWidth / 3;
        maxActiveIndex = articles.length - 3;
        minActiveIndex = 2;
    }else if(window.innerWidth < 1170 && window.innerWidth > 840){
        scrollWidth = scrollWidth / 2;
        maxActiveIndex = articles.length - 2;
        minActiveIndex = 1;
    }else{
        scrollWidth = scrollWidth;
        maxActiveIndex = articles.length - 1;
        minActiveIndex = 0;
    }

    const btns = document.querySelectorAll(".userComments-container ul li a");
    btns.forEach(btn => {
        btn.addEventListener("click", function(e){
            e.preventDefault();
            if(btn.classList.contains("prev-btn")){
                if(activeIndex >= minActiveIndex){
                    activeIndex--;
                    commentsDOM.scrollBy({
                        left: -scrollWidth,
                        behavior: "smooth",
                    });
                    // changeActiveUserComment("prev") 
                }
            }else {
                if(activeIndex <= maxActiveIndex){
                    activeIndex++;
                    commentsDOM.scrollBy({
                        left: scrollWidth,
                        behavior: "smooth",
                    });
                    // changeActiveUserComment("next")
                }
            }      
        })
    })
}

// function changeActiveUserComment(type){
//     const articles = document.querySelectorAll(".userComments .comments article");
//     let secondActiveArticle;
//     articles.forEach(article => {
//         if(article.classList.contains("active")){
//             if(type == "next"){
//                 secondActiveArticle = article.nextElementSibling;
//             }else{
//                 secondActiveArticle = article.previousElementSibling;
//             }
//         }
//         article.classList.remove("active");
//     });
//     secondActiveArticle.classList.add("active");
// }

window.addEventListener("DOMContentLoaded", fetchPopularItems);
window.addEventListener("DOMContentLoaded", fetchUserComments);
