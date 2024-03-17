

export function createElement(elementTag, ...elementClasses) {
    let createdElement = document.createElement(elementTag);
    elementClasses.forEach(className => {
        createdElement.classList.add(className);
    });
    return createdElement;
}