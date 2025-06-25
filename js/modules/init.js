import { fetchData, toTitleCase } from "./util.js";
import { calcStats, updateColors, fetchPokemon, loadPokemon, loadPokemenu, openPokemenu, closePokemenu, filter } from "./mainLogic.js";
import { initToggle } from "./sidebar.js";

export async function initialize() {
    const loadingScreen = document.querySelector('.loading-screen');

    // Sidebar

    initToggle();

    // App
    
    initNumInput();

    initCalc();

    calcStats();

    await loadTypes();
    console.log('types loaded');

    await loadAbilities();
    console.log('abilities loaded');

    initColors();

    initPokemenu();

    await loadPokemenu();
    console.log('pokemenu loaded');

    initFilters();

    fetchPokemon(25);

    loadingScreen.style.opacity = 0;
    loadingScreen.style.pointerEvents = 'none';
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

    fields.forEach(element => {
        const emptyOption = new Option('', 0);
        element.add(emptyOption);
        types.forEach(type => {
            const option = new Option(toTitleCase(type.name), type.id);
            element.add(option);
        })
    })

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

    fields.forEach(element => {
        abilities.forEach(ability => {
            const option = new Option(toTitleCase(ability.name), ability.id);
            element.add(option);
        })
    })

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

function initFilters() {
    const filters = [document.getElementById('search-filter'),
        document.getElementById('generation-filter'),
        document.getElementById('type-primary-filter'),
        document.getElementById('type-secondary-filter'),
        document.getElementById('ability-filter')
    ];

    filters.forEach(element => {
        element.addEventListener('input', filter);
    })
}
