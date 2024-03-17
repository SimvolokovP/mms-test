import { createElement } from "../../components/element/element";
import { getItemsList } from "../../components/itemsList/itemsList";
import { getTopbar } from "../../components/topbar/topbar";
import "./home.css"

export function getHomePage() {
    const page = createElement('section', 'home', 'section-padding');

    const title = createElement('h2', 'section-title');
    title.innerText = 'Лента мемов'

    const list = getItemsList();

    page.append(title, list);

    return page;
}