import { createElement } from "../element/element";
import { getLogo } from "../logo/logo";
import "./load.css"

export function getLoad() {
    const laod = createElement('div', 'load');
    const circle = createElement('div', 'load__circle');
    const logo = getLogo();
    logo.classList.add('load__logo');

    laod.append(circle, logo);

    window.addEventListener('load', () => {
        setTimeout(() => {
            laod.classList.add('loaded');
            laod.style.display = 'none';
        }, 600);
    });
    
    return laod;
}