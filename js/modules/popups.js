export function initPopup(button, popup, close) {
    const cover = document.getElementById('cover');

    const closeFunction = () => {
        closePopup(popup, closeFunction);
    }

    button.addEventListener('click', (event) => {
        popup.style.display = 'flex';

        cover.style.display = 'block';
        cover.style.opacity = 1;

        cover.style.zIndex = '2500';

        cover.addEventListener('click', closeFunction);

        event.currentTarget.blur();
    });

    close.addEventListener('click', closeFunction);
}

function closePopup(popup, closeFunction) {
    const cover = document.getElementById('cover');

    popup.style.display = 'none';
    cover.style.display = 'none';
    cover.style.zIndex = '';

    cover.removeEventListener('click', closeFunction);
}