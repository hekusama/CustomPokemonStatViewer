export function fix() {
    const dpr = window.devicePixelRatio || 1;

    const baseFontSize = 16;

    document.documentElement.style.fontSize = `${baseFontSize / dpr}px`;
}