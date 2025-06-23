export function statFormula(base, nature, evs, ivs, level) {
    return parseInt((((2 * base + ivs + evs / 4) * level / 100) + 5) * nature);
}

export function hpStatFormula(base, evs, ivs, level) {
    return parseInt((2 * base + ivs + evs / 4) * level / 100 + level + 10);
}

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