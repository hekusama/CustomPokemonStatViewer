export function initPopup(popup, close) {
    const cover = document.getElementById('cover');

    popup.addEventListener('click', (event) => {
        document.getElementById('credits-pop-up').style.display = 'flex';

        cover.style.display = 'block';
        cover.style.opacity = 1;

        cover.style.zIndex = '2500';

        cover.addEventListener('click', () => {
            closePopup(document.getElementById('credits-pop-up'));
        });

        event.currentTarget.blur();
    });

    close.addEventListener('click', () => {
        closePopup(document.getElementById('credits-pop-up'));
    });
}

function closePopup(popup) {
    const cover = document.getElementById('cover');

    popup.style.display = 'none';
    cover.style.display = 'none';
    cover.style.zIndex = '';
    cover.addEventListener('click');
}