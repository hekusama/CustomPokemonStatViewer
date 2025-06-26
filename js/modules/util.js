
// dom/general util

export async function fetchData(uri) {
    try {
        const response = await fetch(uri);

        if(!response.ok) {
            throw new Error(`Network Error: failed to fetch data\nError code: ${response.status}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log(error);
    }
}

export function appendNewElement(type, textContent, parent) {
    const element = document.createElement(type);
    element.textContent = textContent;
    parent.appendChild(element);
    return element;
}

export function toTitleCase(kebabCaseStr) {
    return kebabCaseStr
        .toLowerCase()
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// pokeutil

export function statFormula(base, nature, evs, ivs, level) {
    return parseInt((((2 * base + ivs + evs / 4) * level / 100) + 5) * nature);
}

export function hpStatFormula(base, evs, ivs, level) {
    return parseInt((2 * base + ivs + evs / 4) * level / 100 + level + 10);
}

export function toKebabCase(titleCaseStr) {
    return titleCaseStr
        .split(' ')
        .map(word => word.toLowerCase())
        .join('-');
}

export function toDexNumber(number) {
    return String(number).padStart(4, '0');
}

export function getId(url) {
    return url.split('/').slice(-2, -1)[0];
}

// i might have to wait

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitForImage(img) {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      resolve();
    } else {
      img.onload = resolve;
      img.onerror = reject;
    }
  });
}

// cookies

export function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
