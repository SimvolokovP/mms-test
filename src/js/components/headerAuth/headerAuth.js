import { createElement } from "../element/element";


export function getHeaderAuth() {
    const authBlock = createElement('div', 'header__auth');

    const inBtn = createElement('button', 'header__in');
    inBtn.innerText = 'Войти'

    const authText = createElement('span', 'header__status');
    authText.innerText = 'Вы не вошли в аккаунт'

    authBlock.append(inBtn, authText);

    return authBlock;
}