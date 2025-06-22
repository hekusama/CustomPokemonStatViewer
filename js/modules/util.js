export function statFormula(base, nature, evs, ivs, level) {
    return parseInt((((2 * base + ivs + evs / 4) * level / 100) + 5) * nature);
}

export function hpStatFormula(base, evs, ivs, level) {
    return parseInt((2 * base + ivs + evs / 4) * level / 100 + level + 10);
}