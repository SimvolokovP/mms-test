import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, child, get, update, remove } from "firebase/database";
import { createElement } from "../element/element";
import { getLogo } from "../logo/logo";
import './authModal.css';
import { app, authModal, isAuth, userName, userToken, getInfo} from "../../main";
import { getTopbar } from "../topbar/topbar";

export function getAuthModal() {
    let storageLogin = '';
    let storagePassword = '';

    let currentLogin = '';
    let currentId = '';

    const modal = createElement('div', 'auth__modal');
    const modalBox = createElement('div', 'auth__modal-box');
    const modalForm = createElement('div', 'modal__form');
    const modalClose = createElement('button', 'modal__close', 'btn-reset');
    const logo = getLogo();

    const form = createElement('form', 'modal-form', 'modal-form__sig-in', 'active');

    const formTitle = createElement('h3', 'modal-form__title');
    formTitle.innerText = 'Вход';

    const formLabel = createElement('label', 'modal-form__label');
    const loginInput = createElement('input', 'modal-form__login', 'modal-form__input');
    loginInput.placeholder = 'Почта';
    loginInput.type = 'email';

    const formLabel2 = createElement('label', 'modal-form__label');
    const passwordInput = createElement('input', 'modal-form__password', 'modal-form__input');
    passwordInput.placeholder = 'Пароль';
    passwordInput.type = 'password';

    const form2 = createElement('form', 'modal-form', 'modal-form__registaration');

    const formTitle2 = createElement('h3', 'modal-form__title');
    formTitle2.innerText = 'Регистрация';

    const formLabelRegistrEmail = createElement('label', 'modal-form__label');
    const emailRegistrInput = createElement('input', 'modal-form__email', 'modal-form__input');
    emailRegistrInput.type = 'email';
    emailRegistrInput.placeholder = 'Почта';

    const formLabelRegistrLogin = createElement('label', 'modal-form__label');
    const loginRegistrInput = createElement('input', 'modal-form__login', 'modal-form__input');
    loginRegistrInput.type = 'text';
    loginRegistrInput.placeholder = 'Логин';

    const formLabelRegistrPassword = createElement('label', 'modal-form__label');
    const passwordRegistrInput = createElement('input', 'modal-form__password', 'modal-form__input');
    passwordRegistrInput.type = 'password';
    passwordRegistrInput.placeholder = 'Пароль';
    
    const modalItem = createElement('div', 'auth__item');
    const modalItemTitle = createElement('h4', 'auth__title');
    modalItemTitle.innerText = 'У вас уже есть аккаунт?';
    const modalItemBtn = createElement('button', 'auth__btn', 'btn-reset');
    modalItemBtn.innerText = 'Войти';
    const authBtn = createElement('button', 'sign-in', 'btn');
    authBtn.innerText = 'Создать';

    const signUp = createElement('button', 'sign-up', 'btn');
    signUp.innerText = 'Вход';

    let btnSvg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.0688 14.3861L25.9311 25.6139" stroke="#18191F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.3862 25.9312L25.6141 14.0689" stroke="#18191F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    modalClose.insertAdjacentHTML('beforeend', btnSvg);

    modalItem.append(modalItemTitle, modalItemBtn);

    const modalItem2 = createElement('div', 'auth__item');
    const modalItemTitle2 = createElement('h4', 'auth__title');
    modalItemTitle2.innerText = 'У вас нет аккаунта?';
    const modalItemBtn2 = createElement('button', 'auth__btn', 'btn-reset');
    modalItemBtn2.innerText = 'Зарегистрироваться';

    let nickSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    let passwordSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    let mailSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="#18191F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    formLabel.insertAdjacentHTML('beforeend', mailSvg);
    formLabel2.insertAdjacentHTML('beforeend', passwordSvg);
    formLabelRegistrLogin.insertAdjacentHTML('beforeend', nickSvg);
    formLabelRegistrPassword.insertAdjacentHTML('beforeend', passwordSvg);
    formLabelRegistrEmail.insertAdjacentHTML('beforeend', mailSvg);
    formLabel.append(loginInput);
    formLabel2.append(passwordInput);

    formLabelRegistrEmail.append(emailRegistrInput);
    formLabelRegistrLogin.append(loginRegistrInput);
    formLabelRegistrPassword.append(passwordRegistrInput);

    form.append(formTitle, formLabel, formLabel2, signUp);
    form2.append(formTitle2, formLabelRegistrEmail, formLabelRegistrLogin, formLabelRegistrPassword, authBtn);

    modalForm.append(form, form2);

    modalItem2.append(modalItemTitle2, modalItemBtn2);

    modalBox.append(modalItem, modalClose, modalItem2, modalForm);
    modal.append(modalBox); 

    modalItemBtn2.addEventListener('click', () => {
        modalForm.classList.add('active');
        modal.classList.add('active');
        form2.classList.add('active');
        form.classList.remove('active');
    });

    modalItemBtn.addEventListener('click', () => {
        modalForm.classList.remove('active');
        modal.classList.remove('active');
        form2.classList.remove('active');
        form.classList.add('active');
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('open');
        }
    });

    modalBox.addEventListener('click', event => {
        event._isClickWithInModal = true;
    });

    modal.addEventListener('click', event => {
        if (event._isClickWithInModal) return;
        event.currentTarget.classList.remove('open');
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
    })

    function openAuthModal() {
        modal.classList.add('open');
    }

    const firebaseConfig = {
        apiKey: "AIzaSyCz9gYkCp2rWRHj9nwjtCWuTtd6uSiemhI",
        authDomain: "test-js-ee85e.firebaseapp.com",
        databaseURL: "https://test-js-ee85e-default-rtdb.firebaseio.com",
        projectId: "test-js-ee85e",
        storageBucket: "test-js-ee85e.appspot.com",
        messagingSenderId: "929772718193",
        appId: "1:929772718193:web:b09eff62b73237eb5d33d0"
    };
    const app = initializeApp(firebaseConfig);

    const db = getDatabase();
    const auth = getAuth(app);
    const dbref = ref(db);

    let registerUser = event => {
        event.preventDefault();

        createUserWithEmailAndPassword(auth, emailRegistrInput.value, passwordRegistrInput.value).then((credentials) => {
            set(ref(db, 'UsersList/' + credentials.user.uid), {
                login: loginRegistrInput.value,
            });
            emailRegistrInput.value = '';
            passwordRegistrInput.value = '';
            loginRegistrInput.value = '';
            alert('Аккаунт создан!');
        }).catch((error) => {
            alert(error)
        })
    }

    let signInUser = event => {
        event.preventDefault();

        signInWithEmailAndPassword(auth, loginInput.value, passwordInput.value).then((credentials) => {
            get(child (dbref, 'UsersList/' + credentials.user.uid)).then((snapshot) => {
                
                if (snapshot.exists) {
                    console.log(credentials.user)
                    sessionStorage.setItem('user-info', JSON.stringify({
                        login: snapshot.val().login,
                    }))
                    sessionStorage.setItem('user-creds', JSON.stringify(credentials.user));
                }
                
                console.log(credentials);
                let targetId = credentials.user.uid;
                loginToSite(targetId, loginInput.value);
                loginInput.value = ''
                passwordInput.value = '';
                authModal.modal.classList.remove('open');
                getInfo();
                const topbar = getTopbar();
                topbar.checkStatus();
                window.location.reload();
            })
           
        }).catch((error) => {
            alert(error)
        })
    }

    function loginToSite(id, login) {
        currentId = id;
        currentLogin = login;
        console.log(currentId)
    }

    form2.addEventListener('submit', registerUser);
    form.addEventListener('submit', signInUser);

    return { modal, openAuthModal, currentId, currentLogin};
}