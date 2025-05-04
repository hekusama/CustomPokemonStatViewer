export function initialize() {
    
    initNumInput();
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