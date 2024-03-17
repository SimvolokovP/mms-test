import { createElement } from "../../components/element/element";

export function getProfilePage() {
    const page = createElement('section', 'home', 'section-padding')

    const title = createElement('h2');
    title.innerText = 'Profile'

    page.append(title);

    return page;
}