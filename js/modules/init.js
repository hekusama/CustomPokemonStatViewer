export function initialize() {
    
    initNumInput();
    initCalc();
}

function initNumInput() {
    const inputs = document.querySelectorAll('.num-input');

    inputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            
            if (
            e.key === "Backspace" || e.key === "Delete" || 
            e.key === "ArrowLeft" || e.key === "ArrowRight" ||
            e.key === "Tab"
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

        if (base > 200) {
            values["stat-bars"][index].style.width = "400px";
        }
        else {
            values["stat-bars"][index].style.width = `${base * 2}px`;
        }

        if (index == 0) {
            // Shedinja HP
            if (base == 0 || base == 1) {
                values["stats-lv50"][index].textContent = `${base} - ${base}`;
                values["stats-lv100"][index].textContent = `${base} - ${base}`;
            }
            // HP calculation => see https://bulbapedia.bulbagarden.net/wiki/Stat
            else {
                values["stats-lv50"][index].textContent = `${parseInt((2 * base) * 50 / 100 + 50 + 10)} - ${parseInt((2 * base + 31 + 252 / 4) * 50 / 100 + 50 + 10)}`;
                values["stats-lv100"][index].textContent = `${parseInt((2 * base) * 100 / 100 + 100 + 10)} - ${parseInt((2 * base + 31 + 252 / 4) * 100 / 100 + 100 + 10)}`;
            }
        }
        else {
            // Other stat calculation
            values["stats-lv50"][index].textContent = `${parseInt((((2 * base) * 50 / 100) + 5) * 0.9)} - ${parseInt((((2 * base + 31 + 252 / 4) * 50 / 100) + 5) * 1.1)}`;
            values["stats-lv100"][index].textContent = `${parseInt((((2 * base) * 100 / 100) + 5) * 0.9)} - ${parseInt((((2 * base + 31 + 252 / 4) * 100 / 100) + 5) * 1.1)}`;
        }

        total += base;
    })

    values.total.textContent = total;
}