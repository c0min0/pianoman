"use strict";

///////////////////////////////////////////////////////////
// Alumnes: Marc Peral i Víctor Comino
///////////////////////////////////////////////////////////

// DATA OBJECT
const DATA = {
	"k65": { keys: ["a"], note: "c1", pressed: false },
	"k83": { keys: ["s"], note: "d1", pressed: false },
	"k68": { keys: ["d"], note: "e1", pressed: false },
	"k70": { keys: ["f"], note: "f1", pressed: false },
	"k71": { keys: ["g", "q"], note: "g1", pressed: false },
	"k72": { keys: ["h", "w"], note: "a1", pressed: false },
	"k74": { keys: ["j", "e"], note: "b1", pressed: false },
	"k82": { keys: ["r", "k"], note: "c2", pressed: false },
	"k84": { keys: ["t", "l"], note: "d2", pressed: false },
	"k89": { keys: ["y", "ñ"], note: "e2", pressed: false },
	"k85": { keys: ["u"], note: "f2", pressed: false },
	"k73": { keys: ["i"], note: "g2", pressed: false },
	"k79": { keys: ["o"], note: "a2", pressed: false },
	"k80": { keys: ["p"], note: "b2", pressed: false },
	"k49": { keys: ["1"], note: "c1s", pressed: false },
	"k50": { keys: ["2"], note: "d1s", pressed: false },
	"k51": { keys: ["3"], note: "f1s", pressed: false },
	"k52": { keys: ["4"], note: "g1s", pressed: false },
	"k53": { keys: ["5"], note: "a1s", pressed: false },
	"k54": { keys: ["6"], note: "c2s", pressed: false },
	"k55": { keys: ["7"], note: "d2s", pressed: false },
	"k56": { keys: ["8"], note: "f2s", pressed: false },
	"k57": { keys: ["9"], note: "g2s", pressed: false },
	"k48": { keys: ["0"], note: "a2s", pressed: false }
};

function init() {
	// To simulate touch events on desktop
	// TouchEmulator();

	// Add listeners for each virtual keys
	for (let id in DATA) addScreenListeners(id);

	// Add listeners for physical keys
	addKeyListeners();
}

// Add Screen listeners
function addScreenListeners(id) {
    const element = document.getElementById(id);

    element.addEventListener("mousedown", () => {
        activaTecla(element);
        playNote(id);
    });

    element.addEventListener("mouseup", () => desactivaTecla(element));
	
	// If mouse leaves the element while pressing
	element.addEventListener("mouseleave", (event) => {
        if (event.buttons === 1) desactivaTecla(element);	// If is left button
    });

    element.addEventListener("touchstart", (event) => {
        if (event.touches.length > 1) event.preventDefault();	// Prevent gesture actions
        activaTecla(element);
        playNote(id);
    });

    element.addEventListener("touchend", () => desactivaTecla(element));
}

// Add Key listeners
function addKeyListeners() {
    document.addEventListener('keydown', (event) => {
        for (let id in DATA) {
            const element = document.getElementById(id);
            const { keys } = DATA[id];
            if (keys.includes(event.key) && !element.pressed) {
                element.pressed = true;	// To avoid multiple keydown events
                activaTecla(element);
                playNote(id);
            }
        }
    });
    
    document.addEventListener('keyup', (event) => {
        for (let id in DATA) {
            const element = document.getElementById(id);
            const { keys } = DATA[id];
            if (keys.includes(event.key)) {
                element.pressed = false;
                desactivaTecla(element);
            }
        }
    });
}

// Play note
function playNote(id) {
    const note = DATA[id].note;
    let audio = new Audio(`./assets/notes/${note}.mp3`);
    audio.play();
}

// Activa tecla
function activaTecla(element) {
	element.classList.add('activa');
}

// Desactiva tecla
function desactivaTecla(element) {
	element.classList.remove('activa');
}

// Init
init();
