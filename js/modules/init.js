import { hpStatFormula, statFormula, fetchData, appendNewElement, toTitleCase, toDexNumber, getTypeId } from "./util.js";

export async function initialize() {
    
    initNumInput();
    initCalc();
    calcStats();
    await loadTypes();
    await loadAbilities();

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
            fields.types[index].value = getTypeId(typeUrl);
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
                fields.abilities[2].value = getTypeId(abilityUrl);
            }
            else
                fields.abilities[index].value = getTypeId(abilityUrl);
        }
        catch {
            ability.value = 0;
        }   
    })
    pokemon.stats.forEach((stat, index) => {
        fields.stats[index].value = stat["base_stat"];
    })
    calcStats();
}