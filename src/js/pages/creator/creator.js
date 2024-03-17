import { createElement } from "../../components/element/element";
import { getTagsLabel } from "../../components/tagsLabel/tagsLabel";

import { authModal, getTagList, getUserName, getUserToken, isAuth, realdb } from "../../main";
import "./creator.css"
import { getDatabase, ref, set, child, get, update, remove } from "firebase/database";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export function getCreatorPage() {
    let Files = [];
    let FileReaders = [];
    let imagesLinksArray = [];

    const randomId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    let currentId = randomId();

    const page = createElement('section', 'creator', 'section-padding');
    const chapter = createElement('div', 'creator__chapter');

    const title = createElement('h3', 'section__title', 'creator__title');
    title.innerText = 'Создать мем';
    const descr = createElement('p', 'creator__descr');
    descr.innerText = 'Здесь можно создать свой мем!';

    const form = createElement('form', 'creator__form');
    const titleLabel = createElement('label', 'creator__label');
    titleLabel.innerText = 'Название мема';
    const titleInput = createElement('input', 'creator__input', 'creator__input--name');
    titleInput.required ='required';

    const authorLabel = createElement('label', 'creator__label');
    authorLabel.innerText = 'Ник автора';
    const authorInput = createElement('input', 'creator__input', 'creator__input--author');
    authorInput.value = getUserName();
    authorInput.setAttribute('readonly', 'true');

    const textLabel = createElement('label', 'creator__label');
    textLabel.innerText = 'Текст';
    const textInput = createElement('textarea', 'creator__input', 'creator__input--text');

    const imagesBlock = createElement('div', 'images__block');
    const imagesDiv = createElement('div', 'images__div');
    const chooseImage = createElement('button', 'creator__choose', 'btn');
    chooseImage.type = 'button';
    const laodLab = createElement('label', 'creator__loading');
    const progressText = createElement('div', 'images__progress');

    const tagsEl = getTagsLabel();
    

    function getProgress() {
        progressText.innerText = `Добавлено картинок: ${Files.length}/10`;
    }

    chooseImage.innerText = 'Добавить каринку';


    const submitBtn = createElement('button', 'creator__submit', 'btn');
    submitBtn.type = 'submit';
    submitBtn.innerText = 'Создать';

    if (imagesDiv.innerHTML === '') {
        imagesDiv.innerHTML = 'Картинки'
    }


    titleLabel.append(titleInput);
    authorLabel.append(authorInput);
    textLabel.append(textInput);
    imagesBlock.append(imagesDiv, laodLab, progressText, chooseImage);

    form.append(titleLabel, authorLabel, textLabel, tagsEl.tagsLabel, imagesBlock, submitBtn);
    chapter.append(title, descr);

    chooseImage.addEventListener('click', function(event) {
        event.preventDefault();
        openFileDialog();
    });

    function openFileDialog() {
        let input = document.createElement('input');
        input.type = 'file';
        // input.multiple = 'multiple';
    
        input.onchange = (e) => {
            assignImgsToFilesArray(e.target.files);
            createImgTags();
        }
    
        input.click();
    }

    function assignImgsToFilesArray(thisFiles) {
        let num = Files.length + thisFiles.length;
        let loopLim = (num <= 10) ? thisFiles.length : (10 - Files.length);
        
        for (let i = 0; i < loopLim; i++) {
            console.log(thisFiles[i]);
            Files.push(thisFiles[i]);
        }
    
        if (num > 10) alert('!!!');

        console.log(Files)

        getProgress();
    }
    
    function createImgTags() {
        imagesDiv.innerHTML = '';
    
        for (let i = 0; i < Files.length; i++) {
            (function(index) {
                FileReaders[index] = new FileReader();
    
                FileReaders[index].onload = function() {
                    let img = document.createElement('img');
    
                    img.id = `img-${index}`;
                    img.classList.add('choose__img');
                    img.src = FileReaders[index].result;
                    imagesDiv.append(img);
                }
    
                FileReaders[index].readAsDataURL(Files[index]);
            })(i);
        }
        let lab = document.createElement('label');
        lab.innerHTML = 'Очистить';
        lab.style = 'cursor:pointer;display:block; color: navy; font-size: 12px;';
        lab.addEventListener('click', clearImage)
        imagesDiv.append(lab);
    };
    
    function clearImage() {
        console.log('asdwas')
        Files = [];
        imagesLinksArray = [];
        imagesDiv.innerHTML = 'Картики';

        getProgress();  
    }

    function getImgUploadProgress() {
        return 'Imgs upload ' + imagesLinksArray.length + ' of ' + Files.length;
    }
    
    function isAllImagesUpload() {
        return imagesLinksArray.length == Files.length;
    }

    function uploadAllImages() {
        imagesLinksArray = [];
    
        for (let i = 0; i < Files.length; i++) {
            uploadImageToStorage(Files[i]);
        }
    }
    
    function uploadImageToStorage(imgToUpload) {
        const imgNo = Files.indexOf(imgToUpload); 

        console.log(imgToUpload);
    
        const metadata = {
            contentType: imgToUpload.type
        };
    
        const storage = getStorage();
    
        const imgAddress = "TheImages/" + currentId + "/img#" + (imgNo + 1);
    
        const storageRef = sRef(storage, imgAddress);
    
        const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metadata);
    
        uploadTask.on('state_changed', (snapshot) => {
            laodLab.innerHTML = getImgUploadProgress();
        },
    
        (error) => {
            alert('error');
        },
    
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                imagesLinksArray[imgNo] = downloadURL;
    
                if (isAllImagesUpload()) {
                    laodLab.innerHTML = 'all loaded';
                    uploadItem();
                }
            });
        });
    }
    

    const realdb = getDatabase();


    let date = new Date();
    date = date.toLocaleString();

    function clearValues() {
        submitBtn.disabled = false;
        textInput.value = '';
        titleInput.value = '';
        authorInput.value = '';
    }

    function uploadItem() {
        console.log(titleInput.value)
        set(ref(realdb, "MemItems/" + currentId), {
            id: currentId,
            title: titleInput.value,
            text: textInput.value,
            userName: authorInput.value,
            userToken: getUserToken(),
            date: date,
            likes: 0,
            linksOfImagesArray: imagesLinksArray,
            tags: tagsEl.targetTags
        });
        const load = document.querySelector('.load');

        console.log(load);
        load.classList.add('loaded');
        load.style.display = 'none';
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (isAuth()) {
            const load = document.querySelector('.load');
            event.disabled = true;
            
            console.log(Files.length);

            console.log(load);
            load.classList.remove('loaded');
            load.style.display = 'grid';

            if (Files.length === 0) {
                uploadItem();
                clearValues();
                return;
            }

            uploadAllImages();
        } else {
            authModal.openAuthModal();
        }
    });

    if (authorInput.value !== '') {
        authorInput.classList.add('readonly');
    }

    page.append(chapter, form);
    return page;
}