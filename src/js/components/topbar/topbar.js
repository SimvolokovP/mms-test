import { auth, authModal, getUserName, isAuth, getInfo } from "../../main";
import { createElement } from "../element/element";
import { getLogo } from "../logo/logo";
import "./topbar.css"


export function getTopbar() {
    const topbar = createElement('div', 'topbar');
    const authDiv = createElement('div', 'topbar__auth');
    const authText = createElement('span', 'topbar__auth--text');
    const btn = createElement('button', 'topbar__btn', 'btn');
    const logo = getLogo();
    logo.classList.add('topbar__logo');

    function checkStatus() {
        if (isAuth()) {
            console.log(getUserName())
            authText.innerText = `Привет, ${getUserName()}`;
            btn.classList.add('topbar__out');
            btn.classList.remove('topbar__in');
            btn.innerText = 'Выйти'
        } else {
            authText.innerText = 'Вы не авторизированы';
            btn.classList.add('topbar__in');
            btn.classList.remove('topbar__out');
            btn.innerText = 'Вход';
        }
    }

    let signOut = () => {
        sessionStorage.removeItem('user-creds');
        sessionStorage.removeItem('user-info');
        getInfo();
        checkStatus();
        window.location.reload();
    }

    btn.addEventListener('click', () => {
        if (btn.classList.contains('topbar__out')) {
            signOut();
        } if (btn.classList.contains('topbar__in')) {
            authModal.openAuthModal();
        }
    })

    checkStatus();

    authDiv.append(authText, btn);

    topbar.append(logo, authDiv);

    return {topbar, checkStatus};
}