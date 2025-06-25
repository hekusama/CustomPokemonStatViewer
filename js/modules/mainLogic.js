import { hpStatFormula, statFormula, fetchData, appendNewElement, toTitleCase, toDexNumber, getId } from "./util.js";

export function updateColors() {
    const types = [document.getElementById('type-primary'), 
    document.getElementById('type-secondary')];

    const abilities = [document.getElementById('ability-primary'), 
            document.getElementById('ability-secondary'), 
            document.getElementById('ability-hidden')];
    const abilityTitles = [document.getElementById('ability-title-primary'), 
            document.getElementById('ability-title-secondary'), 
            document.getElementById('ability-title-hidden')];

    types.forEach(type => {
        type.style.borderColor = '';

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
                type.style.backgroundColor = '#9CADF7';
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
        ability.style.background = '';
        ability.style.borderColor = '';
        abilityTitles[index].style.color = '';

        if (ability.value == 0) {
            ability.style.backgroundColor = '#00000055';
            ability.style.borderColor = '#00000000';

            abilityTitles[index].style.color = '#00000055';
        }
    })
}

export function calcStats() {
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

export async function fetchPokemon(number) {    

    const pokemons = await fetchData('data/pokemon.json');
    const pokemon = pokemons.find(pokemon => pokemon.id == number);
    
    loadPokemon(pokemon);
}

export async function loadPokemon(pokemon) {
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

    const abilities = await fetchData('data/abilities.json')
    const types = await fetchData('data/types.json')

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
        fields.types[index].value = type.id;  
    })
    
    fields.name.value = toTitleCase(pokemon.name);
    fields.image.src = pokemon.sprite;
    pokemon.abilities.forEach((ability, index) => {
        if (ability.isHidden) {
            fields.abilities[2].value = ability.id;
        }
        else
            fields.abilities[index].value = ability.id;  
    })
    pokemon.stats.forEach((stat, index) => {
        fields.stats[index].value = stat;
    })

    calcStats();
    updateColors();
}

export function openPokemenu() {
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

export function closePokemenu() {
    const pokemenu = document.querySelector('.pokemenu');
    const cover = document.getElementById('cover');
    const handle = document.querySelector('.handle');

    pokemenu.style.right = 0;

    cover.style.opacity = 0;
    cover.style.display = 'none';

    cover.removeEventListener('click', closePokemenu);
    handle.addEventListener('click', openPokemenu);
}

export async function loadPokemenu() {
    const boxes = document.querySelectorAll('.pokemon-box');

    const pokemons = await fetchData('data/pokemon.json')

    // const pokemonJson = [];

    boxes.forEach(box => {
        box.innerHTML = '';
    })

    let boxNumber = 0;
    let id = 1;
    
    pokemons.forEach(pokemon => {

        if (pokemon.generation > boxNumber + 1)
            boxNumber++;

        const card = appendNewElement('div', '', boxes[boxNumber]);
        card.classList.add('pokemon-card');

        card.dataset.id = pokemon.id;
        card.dataset.generation = pokemon.generation;
        card.dataset.types = pokemon.types.map(ability => ability.id).join(' ')
        card.dataset.abilities = pokemon.abilities.map(ability => ability.id).join(' ');

        card.addEventListener('click', (event) => { 
            fetchPokemon(event.currentTarget.dataset.id);
            
            closePokemenu();
        });

        const image = appendNewElement('img', '', card);
        image.classList.add('card-image');
        image.src = pokemon.sprite;

        const name = appendNewElement('div', toTitleCase(pokemon.name), card);
        name.classList.add('card-name');
    })

    // while (true) {
    //     try {
    //         const pokemonApi = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    //         const speciesApi = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    //         // JSON building
    //         const json = {
    //             "id": id,
    //             "abilities": [],
    //             "generation": getId(speciesApi.generation.url),
    //             "moves": [],
    //             "name": pokemonApi.name,
    //             "sprite": pokemonApi.sprites["front_default"],
    //             "stats": [],
    //             "types": []
    //         }

    //         pokemonApi.types.forEach(type => {
    //             try {
    //                 const typeUrl = type.type.url;
    //                 json.types.push({"id": getId(typeUrl)});
    //             }
    //             catch {
    //                 json.types.push({"id": 0});
    //             }   
    //         })

    //         pokemonApi.abilities.forEach(ability => {
    //             try {
    //                 const abilityUrl = ability.ability.url;
    //                 console.log(ability["is_hidden"]);
                    
    //                 json.abilities.push({"id":getId(abilityUrl),"isHidden":ability["is_hidden"]});
    //             }
    //             catch {
    //                 console.log("End reached");
    //             }   
    //         })

    //         pokemonApi.moves.forEach(move => {
    //             const moveUrl = move.move.url;
    //             json.moves.push({"id": getId(moveUrl)});
    //         })

    //         pokemonApi.stats.forEach(stat => {
    //             json.stats.push(stat["base_stat"]);
    //         })

    //         pokemonJson.push(json);
            
    //         id++;
    //     }
    //     catch {
    //         break;
    //     }
    // }

    // console.log(JSON.stringify(pokemonJson));
    
}

export function filter() {
    const filters = {
        "search": document.getElementById('search-filter'),
        "generation": document.getElementById('generation-filter'),
        "typePrimary": document.getElementById('type-primary-filter'),
        "typeSecondary": document.getElementById('type-secondary-filter'),
        "ability": document.getElementById('ability-filter')
    };  

    const cards = document.querySelectorAll('.pokemon-card');
    const boxes = document.querySelectorAll('.pokemon-box');
    const titles = document.querySelectorAll('.generation-title');

    // filter
    cards.forEach(card => {
        const name = card.querySelector('.card-name');
        const generation = card.dataset.generation;
        const types = card.dataset.types.split(' ');
        const abilities = card.dataset.abilities;

        let filter = true;

        // search
        filter = filter && name.textContent.toLowerCase().includes(filters.search.value.toLowerCase());

        // generation
        if (filters.generation.value != 0) {
            filter = filter && generation == filters.generation.value;
        }

        // types
        if (filters.typePrimary.value != -1) {
            filter = filter && types.includes(filters.typePrimary.value);
        }
        if (filters.typeSecondary.value == 0) {
            filter = filter && types.length === 1;
        }
        else if (filters.typeSecondary.value != -1) {
            filter = filter && types.includes(filters.typeSecondary.value);
        }

        // abilities
        if (filters.ability.value != 0) {
            filter = filter && abilities.includes(filters.ability.value);
        }

        if (filter) {
            card.style.display = 'block';
            card.classList.remove('hidden');
        }
        else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    })

    // empty box
    boxes.forEach((box, index) => {
        const visibleCards = box.querySelectorAll('.pokemon-card:not(.hidden)');
        
        if (visibleCards.length == 0) {
            titles[index].style.display = 'none';
        }
        else {
            titles[index].style.display = 'block';
        }
    })
}
