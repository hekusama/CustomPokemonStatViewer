export function initButtons() {
    const credits = document.getElementById('credits-button');
    const creditsClose = document.getElementById('credits-close');

    const toggle = document.querySelector('.theme-toggle');

    const cover = document.getElementById('cover');
    
    credits.addEventListener('click', (event) => {
        document.getElementById('credits-pop-up').style.display = 'flex';

        cover.style.display = 'block';
        cover.style.opacity = 1;

        cover.style.zIndex = '2500';

        cover.addEventListener('click', () => {
            closePopup(document.getElementById('credits-pop-up'), cover);
        });

        event.currentTarget.blur();
    });

    creditsClose.addEventListener('click', () => {
        closePopup(document.getElementById('credits-pop-up'), cover);
    });

    toggle.addEventListener('click', (event) => {
        toggleTheme();
        event.currentTarget.blur();
    });
}

function closePopup(popup, cover) {
    popup.style.display = 'none';
    cover.style.display = 'none';
    cover.style.zIndex = '';
    cover.addEventListener('click');
}

function toggleTheme() {
    const toggle = document.querySelector('.theme-toggle');

    let theme;
    const styles = ['page-light',
        'page-medium',
        'page-dark',
        'page-darker',
        'text',
        'placeholder']

    if (toggle.classList.contains('theme-toggle--toggled')) {
        toggle.classList.remove('theme-toggle--toggled');
        theme = 'light';
    }
    else {
        toggle.classList.add('theme-toggle--toggled');
        theme = 'dark';
    }

    styles.forEach(style => {
        changeStyle(style, theme);
    })
}

function changeStyle(style, theme) {
    const root = document.documentElement;

    root.style.setProperty(`--${style}`, `var(--${theme}-${style})`);
}
