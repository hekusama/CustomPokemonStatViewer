import { hpStatFormula, statFormula, fetchData, appendNewElement, toTitleCase, toDexNumber, getId } from "./util.js";

export async function initialize() {
    
    initNumInput();
    initCalc();
    calcStats();
    await loadTypes();
    await loadAbilities();

    initColors();
    initPokemenu();
    loadPokemenu();

    fetchPokemon(25);
}

function initNumInput() {
    const inputs = document.querySelectorAll('.num-input');

    inputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            
            if (
            e.key === "Backspace" || e.key === "Delete" || 
            e.key === "ArrowLeft" || e.key === "ArrowRight" ||
            e.key === "Tab" || e.ctrlKey || e.metaKey
            ) {
                return;
            }
    
            if (!e.key.match(/^[0-9]$/)) {
                e.preventDefault();
            }
        });
    });
}

function initColors() {
    const triggers = [document.getElementById('type-primary'), 
            document.getElementById('type-secondary'), 
            document.getElementById('ability-primary'), 
            document.getElementById('ability-secondary'), 
            document.getElementById('ability-hidden')];

    triggers.forEach(trigger => {
        trigger.addEventListener('change', updateColors)
    })
}

function updateColors() {
    const types = [document.getElementById('type-primary'), 
    document.getElementById('type-secondary')];

    const abilities = [document.getElementById('ability-primary'), 
            document.getElementById('ability-secondary'), 
            document.getElementById('ability-hidden')];
    const abilityTitles = [document.getElementById('ability-title-primary'), 
            document.getElementById('ability-title-secondary'), 
            document.getElementById('ability-title-hidden')];

    types.forEach(type => {
        type.style.borderColor = 'inherit';

        switch (type.options[type.selectedIndex].textContent.toLowerCase()) {
            case 'bug':
                type.style.backgroundColor = '#ADBD21';
                break;
            case 'dark':
                type.style.backgroundColor = '#735A4A';
                break;
            case 'dragon':
                type.style.backgroundColor = '#7B63E7';
                break;
            case 'electric':
                type.style.backgroundColor = '#FFC631';
                break;
            case 'fairy':
                type.style.backgroundColor = '#FF65D5';
                break;
            case 'fighting':
                type.style.backgroundColor = '#A55239';
                break;
            case 'fire':
                type.style.backgroundColor = '#F75231';
                break;
            case 'flying':
                type.style.backgroundColor = '##9CADF7';
                break;
            case 'ghost':
                type.style.backgroundColor = '#6363B5';
                break;
            case 'grass':
                type.style.backgroundColor = '#7BCE52';
                break;
            case 'ground':
                type.style.backgroundColor = '#D6B55A';
                break;
            case 'ice':
                type.style.backgroundColor = '#5ACEE7';
                break;
            case 'normal':
                type.style.backgroundColor = '#ADA594';
                break;
            case 'poison':
                type.style.backgroundColor = '#B55AA5';
                break;
            case 'psychic':
                type.style.backgroundColor = '#FF73A5';
                break;
            case 'rock':
                type.style.backgroundColor = '#BDA55A';
                break;
            case 'steel':
                type.style.backgroundColor = '#ADADC6';
                break;
            case 'stellar':
                type.style.background = 'linear-gradient(red, orange, yellow, green, blue, purple)';
                break;
            case 'water':
                type.style.backgroundColor = '#399CFF';
                break;
            default:
                break;
        }

        if (type.value == 0) {
            type.style.backgroundColor = '#00000055';
            type.style.borderColor = '#00000000';
        }
    })

    abilities.forEach((ability, index) => {
        ability.style.background = 'inherit';
        ability.style.borderColor = 'inherit';
        abilityTitles[index].style.color = 'inherit';

        if (ability.value == 0) {
            ability.style.backgroundColor = '#00000055';
            ability.style.borderColor = '#00000000';

            abilityTitles[index].style.color = '#00000055';
        }
    })
}

function initCalc() {
    const fields = document.querySelectorAll('.stat-field');

    fields.forEach(field => {

        field.addEventListener('input', calcStats);
    })
}

function calcStats() {
    const fields = document.querySelectorAll('.stat-field');
    const values = {
        "stat-bars": document.querySelectorAll('.bar'),
        "stats-lv50": document.querySelectorAll('.stat-50'),
        "stats-lv100": document.querySelectorAll('.stat-100'),
        "total": document.getElementById('total-number')
    }
    let total = 0;

    fields.forEach((field, index) => {
        let base = parseInt(field.value);
        if (!base) {
            base = 0;
        }

        if (base > 255) {
            values["stat-bars"][index].style.width = "510px";
        }
        else {
            values["stat-bars"][index].style.width = `${base * 2}px`;
        }

        let hue = (base > 255) ? 180 : base / 255 * 180;
        values["stat-bars"][index].style.backgroundColor = `hsl(${hue}, 100%, 66%)`;
        values["stat-bars"][index].style.borderColor = `hsl(${hue}, 33%, 50%)`

        if (index == 0) {
            // Shedinja HP
            if (base == 1) {
                values["stats-lv50"][index].textContent = `${base} - ${base}`;
                values["stats-lv100"][index].textContent = `${base} - ${base}`;
            }
            // HP calculation
            else {
                values["stats-lv50"][index].textContent = `${hpStatFormula(base, 0, 0, 50)} - ${hpStatFormula(base, 252, 31, 50)}`;
                values["stats-lv100"][index].textContent = `${hpStatFormula(base, 0, 0, 100)} - ${hpStatFormula(base, 252, 31, 100)}`;
            }
        }
        else {
            // Other stat calculation
            values["stats-lv50"][index].textContent = `${statFormula(base, 0.9, 0, 0, 50)} - ${statFormula(base, 1.1, 252, 31, 50)}`;
            values["stats-lv100"][index].textContent = `${statFormula(base, 0.9, 0, 0, 100)} - ${statFormula(base, 1.1, 252, 31, 100)}`;
        }

        total += base;
    })

    values.total.textContent = total;
}

async function loadTypes() {
    const types = [document.getElementById('type-primary'), 
    document.getElementById('type-secondary')];

    types.forEach(element => {
        const emptyOption = new Option('', 0);
        element.add(emptyOption);
    })

    let id = 1;
    while (true) {
        
        const type = await fetchData(`https://pokeapi.co/api/v2/type/${id}`);
        if (!type)
            break;
        types.forEach(element => {
            const option = new Option(toTitleCase(type.name), id);
            element.add(option);
        })
        id++;
    }

    types.forEach(element => {
        const optionsArray = Array.from(element.options);

        optionsArray.sort((a, b) => a.text.localeCompare(b.text));

        element.innerHTML = '';

        optionsArray.forEach(option => {
            element.add(option);
        });
    });
}

async function loadAbilities() {
    const abilities = [document.getElementById('ability-primary'), 
            document.getElementById('ability-secondary'), 
            document.getElementById('ability-hidden')];

    abilities.forEach(element => {
        const emptyOption = new Option('', 0);
        element.add(emptyOption);
    })

    let id = 1;
    while (true) {
        
        const ability = await fetchData(`https://pokeapi.co/api/v2/ability/${id}`);
        if (!ability)
            break;
        abilities.forEach(element => {
            const option = new Option(toTitleCase(ability.name), id);
            element.add(option);
        })
        id++;
    }

    abilities.forEach(element => {
        const optionsArray = Array.from(element.options);

        optionsArray.sort((a, b) => a.text.localeCompare(b.text));

        element.innerHTML = '';

        optionsArray.forEach(option => {
            element.add(option);
        });
    });
}

async function fetchPokemon(number) {
    const pokemon = await fetchData(`https://pokeapi.co/api/v2/pokemon/${number}`)
    console.log(pokemon);
    
    loadPokemon(pokemon);
}

function loadPokemon(pokemon) {
    const fields = {
        "dex": document.getElementById('dex-number'),
        "types": [document.getElementById('type-primary'), 
            document.getElementById('type-secondary')],
        "name": document.getElementById('name-field'),
        "image": document.getElementById('image'),
        "abilities": [document.getElementById('ability-primary'), 
            document.getElementById('ability-secondary'), 
            document.getElementById('ability-hidden')],
        "stats": [document.getElementById('hp-field'),
            document.getElementById('att-field'),
            document.getElementById('def-field'),
            document.getElementById('spa-field'),
            document.getElementById('spd-field'),
            document.getElementById('spe-field')]
    }

    // Reset types and abilities
    fields.types.forEach((type) => {
        type.value = 0;
    })
    fields.abilities.forEach((ability) => {
        ability.value = 0;
    })

    // Set values
    fields.dex.value = toDexNumber(pokemon.id);
    pokemon.types.forEach((type, index) => {
        try {
            const typeUrl = type.type.url;
            fields.types[index].value = getId(typeUrl);
        }
        catch {
            type.value = 0;
        }   
    })
    console.log(pokemon.name);
    fields.name.value = toTitleCase(pokemon.name);
    fields.image.src = pokemon.sprites["front_default"];
    pokemon.abilities.forEach((ability, index) => {
        try {
            const abilityUrl = ability.ability.url;
            if (ability["is_hidden"]) {
                fields.abilities[2].value = getId(abilityUrl);
            }
            else
                fields.abilities[index].value = getId(abilityUrl);
        }
        catch {
            ability.value = 0;
        }   
    })
    pokemon.stats.forEach((stat, index) => {
        fields.stats[index].value = stat["base_stat"];
    })

    calcStats();
    updateColors();
}

function initPokemenu() {
    const pokemenu = document.querySelector('.pokemenu');
    const handle = document.querySelector('.handle');

    handle.addEventListener('click', openPokemenu);
}

function openPokemenu() {
    const pokemenu = document.querySelector('.pokemenu');
    const cover = document.getElementById('cover');
    const handle = document.querySelector('.handle');

    pokemenu.style.right = '40vw';

    cover.style.display = 'block';
    cover.style.opacity = 1;

    cover.addEventListener('click', closePokemenu);
    handle.removeEventListener('click', openPokemenu);
    handle.addEventListener('click', closePokemenu);
}

function closePokemenu() {
    const pokemenu = document.querySelector('.pokemenu');
    const cover = document.getElementById('cover');
    const handle = document.querySelector('.handle');

    pokemenu.style.right = 0;

    cover.style.opacity = 0;
    cover.style.display = 'none';

    cover.removeEventListener('click', closePokemenu);
    handle.addEventListener('click', openPokemenu);
}

async function loadPokemenu() {
    const menu = document.querySelector('.pokemenu-main');
    const boxes = document.querySelectorAll('.pokemon-box');

    boxes.forEach(box => {
        box.innerHTML = '';
    })

    let boxNumber = 0;
    let id = 1;

    while (true) {
        try {
            const pokemon = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`)
            const species = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`)

            if (getId(species.generation.url) > boxNumber + 1)
                boxNumber++;

            const card = appendNewElement('div', '', boxes[boxNumber]);
            card.classList.add('pokemon-card');
            card.dataset.id = id;
            card.addEventListener('click', (event) => { 
                fetchPokemon(event.currentTarget.dataset.id);
                
                closePokemenu();
            });

            const image = appendNewElement('img', '', card);
            image.classList.add('card-image');
            image.src = pokemon.sprites["front_default"];

            const name = appendNewElement('div', toTitleCase(pokemon.name), card);
            name.classList.add('card-name');
            
            id++;
        }
        catch {
            break;
        }
    }
}