import { createElement } from "../element/element";
import { getMenuLink } from "../menuLink/menuLink";
import "./mobileNavigation.css"

export function getMobileNavigation() {
    const mobileNav = createElement('div', 'mobileNav');
    const container = createElement('div', 'container', 'mobileNav__container');

    const nav = createElement('nav', 'mobileNav__nav');

    const svg1 = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="#272727" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="#272727" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`

    const svg2 = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `

    const svg3 = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `

    const links = {
        "home" : getMenuLink('/', '', svg1),
        "creator" : getMenuLink('/creator', '', svg2),
        "profile" : getMenuLink('/profile', '', svg3)
    }



    for (const link in links) {
        nav.append(links[link]);
    }

    const setActiveMenuLink = function(link = '') {
        for (const onelink in links) {
            links[onelink].classList.remove('active');
        }

        if (link !== '') {
            links[link].classList.add('active');
        }
    }

    container.append(nav);
    mobileNav.append(container);

    
    let lastScrollPos = 0;

    const hideNav = function () {
        const condition = lastScrollPos < window.scrollY;
        if (condition) {
            mobileNav.classList.add('hide');
        } else {
            mobileNav.classList.remove('hide');
        }

        lastScrollPos = window.scrollY;
    }

    window.addEventListener('scroll',function () {
        hideNav();
    });

    return {mobileNav, setActiveMenuLink};
}