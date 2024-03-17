import { createElement } from "../element/element";
import { getMenuLink } from "../menuLink/menuLink";
import { getLogo } from "../logo/logo";
import { getHeaderAuth } from "../headerAuth/headerAuth";
import "./header.css"
import { getBurger } from "../burger/burger";

export function getHeader() {
    const header = createElement('header', 'header');
    const container = createElement('div', 'container', 'header__container');

    const logo = getLogo();
    logo.classList.add('header__logo');

    const menuLogo = getLogo();
    menuLogo.classList.add('menu__logo');

    const headerAuth = getHeaderAuth();


    container.append(logo, headerAuth);
    
    header.append(container);

    return header;
}