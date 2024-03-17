import Navigo from "navigo"
import { getHeader } from "./components/header/header";
import { getPageContainer } from "./components/pageContainer/pageContainer";
import  Swiper from "swiper";
import { Navigation, Pagination } from 'swiper/modules';
import './../css/swiper.min.css';


import { initializeApp } from "firebase/app";

import { getDatabase, ref, set, child, get, update, remove } from "firebase/database";
import { getSidebar } from "./components/sidebar/sidebar";
import { getMobileNavigation } from "./components/mobileNavigation/mobileNavigation";
import { getTopbar } from "./components/topbar/topbar";
import { createElement } from "./components/element/element";
import { getLoad } from "./components/load/load";
import { getAuthModal } from "./components/authModal/authModal";

export const router = new Navigo('/');

const wrapper = document.getElementById('wrapper');


const header = getHeader();
const sidebar = getSidebar();
const load = getLoad();
export const authModal = getAuthModal();

const mobileNav = getMobileNavigation();
const pageContainer = getPageContainer();

export const auth = true;

export function getInfo() {
    let userName = '';
    let userToken = '';
   if (!sessionStorage.getItem('user-creds')) {
        userName = '';
        userToken = '';
   } else {
        let userCreds = JSON.parse(sessionStorage.getItem('user-creds'));
        let userInfo = JSON.parse(sessionStorage.getItem('user-info'));
        userName = userInfo.login;
        userToken = userCreds.uid;
   }
    
    return { userToken, userName };
}


export function isAuth() {
    if (getInfo().userToken === '' || getInfo().userToken === undefined) {
        return false;
    } else {
        return true;
    } 
}

const tagList = ['tag 1', 'tag 2', 'tag 3', 'tag 4'];

const topbar = getTopbar();

export function getUserName() {
    return getInfo().userName;
}

export function getUserToken() {
    return getInfo().userToken;
}

export function getTagList() {
    return tagList;
}

let arrayOfItems = [];

if (!isAuth()) {
    authModal.openAuthModal();
}

router.on('/', async () => {
    pageContainer.innerHTML = '';
    const moduleHome = await import("/src/js/pages/home/home.js")
    const mainPage = moduleHome.getHomePage();
    pageContainer.append(topbar.topbar);
    pageContainer.append(mainPage)
    pageContainer.append(sidebar.sidebar);
    sidebar.setActiveMenuLink("home");
    mobileNav.setActiveMenuLink("home");
    clearList();
    getItemsList();
});
  
 
router.on('/creator', async () => {
    pageContainer.innerHTML = ""
    const moduleCreator = await import("/src/js/pages/creator/creator.js");
    const creatorPage = moduleCreator.getCreatorPage()
    pageContainer.append(topbar.topbar);
    pageContainer.append(creatorPage)
    pageContainer.append(sidebar.sidebar);
    sidebar.setActiveMenuLink("creator");
    mobileNav.setActiveMenuLink("creator");
});

router.on('/profile', async () => {
    pageContainer.innerHTML = ""
    const moduleProfile = await import("/src/js/pages/profile/profile.js");
    const profilePage = moduleProfile.getProfilePage()
    pageContainer.append(topbar.topbar);
    pageContainer.append(profilePage)
    pageContainer.append(sidebar.sidebar);
    sidebar.setActiveMenuLink("profile");
    mobileNav.setActiveMenuLink("profile");
});


// wrapper.append(header.header, pageContainer);

wrapper.append(load, authModal.modal, pageContainer, mobileNav.mobileNav);



const firebaseConfig = {
  apiKey: "AIzaSyCz9gYkCp2rWRHj9nwjtCWuTtd6uSiemhI",
  authDomain: "test-js-ee85e.firebaseapp.com",
  databaseURL: "https://test-js-ee85e-default-rtdb.firebaseio.com",
  projectId: "test-js-ee85e",
  storageBucket: "test-js-ee85e.appspot.com",
  messagingSenderId: "929772718193",
  appId: "1:929772718193:web:b09eff62b73237eb5d33d0"
};




export const app = initializeApp(firebaseConfig);



export const realdb = getDatabase();



function getItemsList() {
    arrayOfItems.length = 0;
    const itemsList = document.querySelector('.home__list');
    itemsList.innerHTML = '';
    const dbref = ref(realdb);

    get(child(dbref, "MemItems"))
    .then((snapshot) => {
        snapshot.forEach(item => {
            arrayOfItems.push(item.val());
        });
        renderItems(itemsList);
    })
}

function renderItems(itemsList) {
    let i = 0;
    arrayOfItems.forEach(item => {
        console.log(item);
        let template = itemToHtml(item, i)
        itemsList.append(template);
    });
}

function itemToHtml(item, index) {
    const classes = ['item-red', 'item-yellow', 'item-white', 'item-green', 'item-pink'];
    const randomIndex = Math.floor(Math.random() * classes.length);
    const randomClass = classes[randomIndex];


    let newItem = document.createElement('li');
    const itemTitle = createElement('h3', 'item__title');
    itemTitle.innerText = item.title;

    const itemText = createElement('h3', 'item__text');
    itemText.innerText = item.text;

    const itemActions = createElement('div', 'item__actions');
    const itemInfo = createElement('div', 'item__info');
    const authorLink = createElement('a', 'item__author');
    authorLink.href = '/';
    authorLink.innerText = item.userName;
    const spanDivide = createElement('span');
    spanDivide.innerText = ' / ';
    const spanDate = createElement('span', 'item__date');
    spanDate.innerText = item.date;

    const imagesContainer = createElement('div', 'item__images');
    let currentSwiper = getImages(item.linksOfImagesArray, index);
    
    const likeDiv = createElement('div', 'item__like');

    const likeBtn = createElement('button', 'btn-like', 'btn-reset');

    let { likedByUsers } = item;

    if (likedByUsers == undefined) {
        likedByUsers = [];
    }

    for (let i = 0; i < likedByUsers.length; i++) {
        if (likedByUsers[i] == getInfo().userToken) {
            likeBtn.classList.add('active');
        }
    }

    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.945 22C11.835 22 11.7249 22 11.6149 21.887H11.5049C9.08422 20.6441 3.3627 17.1412 1.38217 11.6045C1.05208 10.5876 0.281877 6.40678 2.70252 3.80791C4.1329 2.22599 5.45325 2 6.33349 2C8.42405 2 10.6246 3.24294 11.945 5.05085C13.2653 3.12994 15.2459 2 17.5565 2C18.4367 2 19.7571 2.22599 21.2975 3.80791C23.7181 6.40678 22.9479 10.7006 22.6178 11.6045C20.6373 17.2542 14.8057 20.6441 12.4951 21.887C12.2751 22 12.055 22 11.945 22Z" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    const likesCount = createElement('span');
    likesCount.innerText = item.likes;

    likeBtn.insertAdjacentHTML('beforeend', svg);

    likeBtn.addEventListener('click', () => {
        if (isAuth()) {
            likeItem(likeBtn, item);
        } else {
            authModal.openAuthModal();
        }
        
    });
    newItem.classList.add('item');
    newItem.classList.add(randomClass);
    newItem.setAttribute('data-id', item.id)
    
    imagesContainer.append(currentSwiper);
    itemInfo.append(authorLink, spanDivide, spanDate);
    likeDiv.append(likeBtn, likesCount);
    itemActions.append(itemInfo, likeDiv);
    newItem.append(itemTitle, itemText, imagesContainer, itemActions);

    if (imagesContainer.innerHTML == '') {
        imagesContainer.style.display = 'none';
    }
    
    return newItem;
}

function getImages(array, index) {
    if (array == undefined) array = []; 
    if (array.length != 0) {
        const swiperContainer = createElement('div', 'swiper-container');
        const swiperWrapper = createElement('div', 'swiper-wrapper');
        const swiperPagination = createElement('div', 'swiper-pagination');

        const images = array.map(img => `<div  class="swiper-slide card">
        <img loading="lazy" src="${img}" data-number="${index}">
        </div>`).join('');
        swiperWrapper.insertAdjacentHTML('beforeend', images);
        swiperContainer.append(swiperWrapper, swiperPagination);
        
        let postSwiper = new Swiper(swiperContainer, {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: false,
            modules: [Navigation, Pagination],
            pagination: {
                el: swiperPagination,
                type: 'fraction',
                clickable: true
            }
        });
        return swiperContainer;
    } else {
        return ``;
    }
}

function clearList() {
    const itemsList = document.querySelector('.home__list');
    const items = itemsList.querySelectorAll('.items');
    
    items.forEach(item => {
        item.remove()
    })
}

function mobileRezolution() {
    const main = document.querySelector('.main');
    
    if (window.innerWidth <= 768) {
        main.classList.add('mobile');
        
    } else {
        main.classList.remove('mobile');
        
    }
}

function likeItem(btn, targetItem) {
    
    currentEl = btn.closest('li');
    currentId = currentEl.dataset.id;

    let action = '';

    if (btn.classList.contains('active')) {
        action = 'substuct';
    } else {
        action = 'add';
    }

    updateLikeToServer(targetItem, action);
    btn.classList.toggle('active');
}

function updateLikeToServer(targetItem, action) {
    let {id, title, text, userName, userToken, date, likes, linksOfImagesArray, tags, likedByUsers} = targetItem;

    // const dbref = ref(realdb);
    // let array = [];

    // get(child(dbref, "MemItems"))
    // .then((snapshot) => {
    //     snapshot.forEach(item => {
    //         array.push(item.val());
    //         console.log(array)
    //     });
    // });
    // let likes = 0;

    // for (let i = 0; i < array.length; i++) {
    //     if (array[i].id == id) {
    //         likes = array[i].likes;
    //         console.log(likes);
    //     }
    // }

    if (tags == undefined) {
        tags = [];
    }

    if (linksOfImagesArray == undefined) {
        linksOfImagesArray = [];
    }

    if (text == undefined) {
        text = [];
    }
    console.log(likes)
    let newLikesCount = 0;

    if (likedByUsers == undefined) {
        likedByUsers = [];
    }

    if (action == 'substuct') {
        newLikesCount = Number (likes - 1);
        targetItem.likes = targetItem.likes - 1;
        for (let i = 0; i < likedByUsers.length; i++) {
            if (likedByUsers[i] === getInfo().userToken) {
                likedByUsers.splice(i, 1);
            }
        }

    } else {
        newLikesCount = Number (likes + 1);
        targetItem.likes = targetItem.likes + 1;
        likedByUsers.push(getInfo().userToken);
    }
    console.log(newLikesCount)
    // id: currentId,
    // title: titleInput.value,
    // text: textInput.value,
    // userName: authorInput.value,
    // userToken: getUserToken(),
    // date: date,
    // likes: 0,
    // linksOfImagesArray: imagesLinksArray

    set(ref(realdb, "MemItems/" + currentId), {
        id: id,
        title: title,
        text: text, 
        userName: userName,
        userToken:userToken,
        date:date,
        likes: newLikesCount,
        linksOfImagesArray: linksOfImagesArray,
        tags: tags,
        likedByUsers: likedByUsers
    });

    getCountLikes(targetItem, newLikesCount);

    console.log(likes + '/' + newLikesCount);
}

function getCountLikes(item, likesCount) {
    const items = document.querySelectorAll('.item');
    const targetId = item.id;

    for (let i = 0; i < items.length; i++) {
        if (items[i].dataset.id === targetId) {
            let span = items[i].querySelector('.item__like span');
            span.innerText = likesCount;
        }
    }
}


function getUserControl(currentToken) {
    if (currentToken == userToken) {
        return `<div class="item__control">
        <button class="item__edit btn-reset btn">edit</button>
        <button class="item__remove btn-reset btn">remove</button>
    </div>`
    } else {
        return ``;
    }
}


mobileRezolution();
window.addEventListener('resize', mobileRezolution);
router.resolve();