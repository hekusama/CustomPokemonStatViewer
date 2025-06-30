import { initPopup } from "./popups.js";

export function initButtons() {
    const credits = document.getElementById('credits-button');
    const creditsClose = document.getElementById('credits-close');

    const toggle = document.querySelector('.theme-toggle');    
    
    initPopup(credits, creditsClose);

    toggle.addEventListener('click', (event) => {
        toggleTheme();
        event.currentTarget.blur();
    });
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
