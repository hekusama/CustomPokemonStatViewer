import { appendNewElement, fetchData, toTitleCase, wait, waitForImage, setCookie, getCookie } from "./util.js";
import { calcStats, updateColors, fetchPokemon, loadPokemon, openPokemenu, closePokemenu, filter } from "./mainLogic.js";
import { initToggle } from "./sidebar.js";

export async function initialize() {
    const loadingScreen = document.querySelector('.loading-screen');

    // Pop up

    const preloadCookie = getCookie("preload");
    const preloadPreference = preloadCookie === "true";

    const popup = document.getElementById('preload-pop-up');
    if (preloadCookie == null) {
        
        const buttons = [
            document.getElementById('preload-yes'),
            document.getElementById('preload-no')
        ]
        await popUpClick(buttons[0], buttons[1], popup);
    }
    else {
        popup.style.display = 'none';
    }

    // Sidebar

    initToggle();

    // App
    
    initNumInput();

    initCalc();

    await loadTypes();

    await loadAbilities();

    initColors();

    initPokemenu();

    await loadPokemenu(preloadPreference);

    initFilters();

    fetchPokemon(25);

    await wait(1000);

    loadingScreen.style.opacity = 0;
    loadingScreen.style.pointerEvents = 'none';
}

function popUpClick(confirm, deny, popup) {
    return new Promise((resolve) => {
        confirm.onclick = () => {
            popup.style.display = 'none';
            setCookie("preload", true, 1);
            resolve();
        };
        deny.onclick = () => {
            popup.style.display = 'none';
            setCookie("preload", false, 1);
            resolve();
        };
    });
}

function handleProgress(asset, progress, total) {
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    const percent = document.getElementById('progress-percent');

    bar.style.width = `${progress / total * 90}vw`;

    text.textContent = `Loading ${asset} ${progress}/${total}`;
    percent.textContent = `${parseInt(progress / total * 100)}%`;    
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

function initCalc() {
    const fields = document.querySelectorAll('.stat-field');

    fields.forEach(field => {

        field.addEventListener('input', calcStats);
    })
}

async function loadTypes() {
    const fields = [document.getElementById('type-primary'), 
    document.getElementById('type-secondary'),
    document.getElementById('type-primary-filter'), 
    document.getElementById('type-secondary-filter')];

    const types = await fetchData('data/types.json');

    handleProgress('types', 0, types.length);

    for (const [index, element] of fields.entries()) {

        const emptyOption = new Option('', 0);
        element.add(emptyOption);

        let elementIdx = index;

        for (const [index, type] of types.entries()) {
            const option = new Option(toTitleCase(type.name), type.id);
            element.add(option);

            if (elementIdx === 3) {
                await wait(1);
                handleProgress('types', index + 1, types.length);
            }
        }
    }

    fields.forEach(element => {
        const optionsArray = Array.from(element.options);

        optionsArray.sort((a, b) => a.text.localeCompare(b.text));

        element.innerHTML = '';

        optionsArray.forEach(option => {
            element.add(option);
        });
    });

    // remove null type
    fields[0].remove(0);
    fields[2].remove(0);

    // add 'any' option
    for (let i = 2; i < 4; i++) {
        const anyOption = new Option('Any', -1);
        fields[i].add(anyOption, fields[i].options[0]);
        fields[i].value = -1;
    }
}

async function loadAbilities() {
    const fields = [document.getElementById('ability-primary'), 
            document.getElementById('ability-secondary'), 
            document.getElementById('ability-hidden'),
            document.getElementById('ability-filter')];

    const abilities = await fetchData('data/abilities.json');

    handleProgress('abilities', 0, abilities.length);

    for (const [index, element] of fields.entries()) {
        let elementIdx = index;

        for (const [index, ability] of abilities.entries()) {
            const option = new Option(toTitleCase(ability.name), ability.id);
            element.add(option);
            if (elementIdx === 3) {
                await wait(1);
                handleProgress('abilities', index + 1, abilities.length);
            }
        }
    }

    fields.forEach(element => {
        const optionsArray = Array.from(element.options);

        optionsArray.sort((a, b) => a.text.localeCompare(b.text));

        element.innerHTML = '';

        optionsArray.forEach(option => {
            element.add(option);
        });
    });

    fields[3].options[0].text = 'Any';
}

function initPokemenu() {
    const handle = document.querySelector('.handle');

    handle.addEventListener('click', openPokemenu);
}

async function loadPokemenu(preload) {
    const boxes = document.querySelectorAll('.pokemon-box');

    const pokemons = await fetchData('data/pokemon.json')

    handleProgress('pokemon', 0, pokemons.length);

    // const pokemonJson = [];

    boxes.forEach(box => {
        box.innerHTML = '';
    })

    let boxNumber = 0;
    let id = 10001;
    
    for (const [index, pokemon] of pokemons.entries()) {

        if (pokemon.generation > boxNumber + 1)
            boxNumber++;

        const card = appendNewElement('div', '', boxes[boxNumber]);
        card.classList.add('pokemon-card');

        card.dataset.id = pokemon.id;
        card.dataset.generation = pokemon.generation;
        card.dataset.types = pokemon.types.map(ability => ability.id).join(' ');
        card.dataset.abilities = pokemon.abilities.map(ability => ability.id).join(' ');
        card.dataset.forme = pokemon.forme;

        card.addEventListener('click', (event) => { 
            fetchPokemon(event.currentTarget.dataset.id, event.currentTarget.dataset.forme);
            
            closePokemenu();
        });

        const image = appendNewElement('img', '', card);
        image.classList.add('card-image');
        image.src = pokemon.sprite;

        if (!preload) {
            await waitForImage(image);
        }

        const name = appendNewElement('div', toTitleCase(pokemon.name), card);
        if (pokemon.forme) {
            name.textContent += `-${pokemon.forme}`
        }
        name.classList.add('card-name');

        handleProgress('pokemon', index + 1, pokemons.length);        
    }

    // while (true) {
    //     try {
    //         const pokemonApi = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    //         // const speciesApi = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    //         // JSON building
    //         const json = {
    //             "id": id,
    //             "abilities": [],
    //             // "generation": getId(speciesApi.generation.url),
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

function initFilters() {
    const filters = [document.getElementById('search-filter'),
        document.getElementById('generation-filter'),
        document.getElementById('type-primary-filter'),
        document.getElementById('type-secondary-filter'),
        document.getElementById('ability-filter')
    ];

    const buttons = document.querySelectorAll('.buttons-wrapper > button');

    filters.forEach(element => {
        element.addEventListener('input', filter);
    })

    buttons.forEach(element => {

        element.addEventListener('click', () => {
            
            const states = ['off', 'on', 'negate'];
            let state;

            element.classList.forEach(entry => {
                if (states.includes(entry)) {
                    state = entry;
                }
            })

            element.classList.remove(state);
            switch (state) {
                case 'on':
                    state = 'negate';
                    break;
                case 'negate':
                    state = 'off';
                    break;
                default:
                    state = 'on';
                    break;
            }
            element.classList.add(state);

            filter();
        });
    })
}
