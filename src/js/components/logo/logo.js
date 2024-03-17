import { createElement } from "../element/element";
import logoImg from "/src/assets/img/logo.svg"
import "./logo.css"

export function getLogo() {
    const logo = createElement('a', 'logo');
    logo.innerText = 'Memыsы*';
    logo.href = '/'
    return logo;
}