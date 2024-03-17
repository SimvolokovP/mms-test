import { createElement } from "../element/element";


export function getItemsList() {
    const list = createElement('ul', 'home__list', 'list-reset');
    return list;
}