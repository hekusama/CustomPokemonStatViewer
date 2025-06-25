export function initToggle() {
    const toggle = document.querySelector('.theme-toggle');

    toggle.addEventListener('click', toggleTheme);
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
