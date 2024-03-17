import { getTagList } from "../../main";
import { createElement } from "../element/element";
import './tagsLabel.css';

export function getTagsLabel() {
    const tagsLabel = createElement('label', 'tags__label');
    const selectBtn = createElement('div', 'select-btn');
    const textBtn = createElement('span', 'btn-text');
    const checkedList = createElement('ul', 'tags__checked', 'list-reset');
    textBtn.innerText = 'Добавить тэги (не более 3):';
    const arrowBtn = createElement('span', 'arrow-down');
    arrowBtn.insertAdjacentHTML('beforeend', `<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L7 7L13 1" stroke="#272727" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`);

    let targetTags = [];
    const tagBox = createElement('div', 'tags__box');
    const tagList = createElement('ul', 'tags__items');
    const tagSearch = createElement('input', 'tags__search');
    tagSearch.type = 'text';
    tagSearch.placeholder = 'Поиск по названию';
    const list = getTagList();

    let tagCount = 0;
    list.forEach(tag => {
        
        const temp = createElement('li', 'tag');
        temp.setAttribute('data-value', tag);
        temp.setAttribute('data-id', tagCount);
        const name = createElement('span', 'tag__text');
        name.innerText = tag;
        temp.append(name);
        tagList.append(temp);

        temp.addEventListener('click', () => {
            if ((!temp.classList.contains('checked')) && (targetTags.length <= 2)) {
                targetTags.push(
                    {
                        id : temp.dataset.id,
                        value: temp.dataset.value
                    }
                );
                temp.classList.add('checked');
                getCheckedTags();
            }
            
        })

        tagCount++;
    });

    function resetTag(id) {
        const items = document.querySelectorAll('.tag');
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].dataset.id === id) {
                items[i].classList.remove('checked');
            }
        }
    }

    function getCheckedTags() {
        checkedList.innerHTML = '';
        console.log(targetTags);
        targetTags.forEach(tag => {
            const {id, value} = tag;
            const item = createElement('li', 'checked-tag');
            const name = createElement('span');
            name.innerText = value;
            const removeBtn = createElement('div', 'checked-tag__remove');
            removeBtn.insertAdjacentHTML('beforeend', `<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.63603 12.364L12.9497 1.05024" stroke="#272727" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 1L13.3137 12.3137" stroke="#272727" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `)
            removeBtn.addEventListener('click', (event) => removeCheckedTag(event));
            item.append(name, removeBtn);
            item.setAttribute('data-value', value);
            item.setAttribute('data-id', id);

            checkedList.append(item);
        })
        
    }

    function removeCheckedTag(event) {
        const currentTag = event.target.closest('li');
        const currentId = currentTag.dataset.id;
        console.log(currentId);

        for (let i = 0; i < targetTags.length; i++) {
            if (targetTags[i].id === currentId) {
                targetTags.splice(i , 1);
                getCheckedTags();
                resetTag(currentId);
            }
        }

    }

    function listIsEmpty() {
        if (tagList.innerHTML == '') {
            const tagListMessage = createElement('span');
            tagListMessage.innerText = 'Такого тэга не найдено';
            tagList.append(tagListMessage);
        }
    }

    selectBtn.append(textBtn, arrowBtn);
    tagBox.append(tagSearch, tagList)

    tagsLabel.append(selectBtn, tagBox, checkedList);

    tagSearch.addEventListener('input', () => {
        const tags = document.querySelectorAll('.tag');
        let { value } = tagSearch;
        
        for (let i = 0; i < tags.length; i++) {
            if (!tags[i].dataset.value.includes(value)) {
                tags[i].classList.add('hidden');
            } else {
                tags[i].classList.remove('hidden');
            }
        }

        listIsEmpty();
    });

    selectBtn.addEventListener('click', () => {
        selectBtn.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        const selectBtn = document.querySelector('.select-btn');
        const tagsLabel = document.querySelector('.tags__label');
        
        if (selectBtn && !selectBtn.contains(event.target) && !tagsLabel.contains(event.target)) {
            selectBtn.classList.remove('open');
        }
    });

    return {tagsLabel, targetTags};
}
