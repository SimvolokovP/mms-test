import { createElement } from "../element/element";
import "./burger.css"

export function getBurger() {
    const burger = createElement('button', 'burger', 'menu__burger');
    const line1 = createElement('span');
    const line2 = createElement('span');
    const line3 = createElement('span');
    
    burger.append(line1, line2, line3);

    burger.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        const links = document.querySelectorAll('.menu__link');
        const main = document.querySelector('.main');

        links.forEach(link => {
            link.classList.toggle('only-icon');
        })

        burger.classList.toggle('active');
        sidebar.classList.toggle('active');
        main.classList.toggle('pad');
    });

    return burger;
}

