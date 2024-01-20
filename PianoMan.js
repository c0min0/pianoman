"use strict";

///////////////////////////////////////////////////////////
// Alumnes: Marc Peral i Víctor Comino
///////////////////////////////////////////////////////////



// DATA
const keysData = {
	"k65": { keys: ["a"], note: "c1" },
	"k83": { keys: ["s"], note: "d1" },
	"k68": { keys: ["d"], note: "e1" },
	"k70": { keys: ["f"], note: "f1" },
	"k71": { keys: ["g", "q"], note: "g1" },
	"k72": { keys: ["h", "w"], note: "a1" },
	"k74": { keys: ["j", "e"], note: "b1" },
	"k82": { keys: ["r", "k"], note: "c2" },
	"k84": { keys: ["t", "l"], note: "d2" },
	"k89": { keys: ["y", "ñ"], note: "e2" },
	"k85": { keys: ["u"], note: "f2" },
	"k73": { keys: ["i"], note: "g2" },
	"k79": { keys: ["o"], note: "a2" },
	"k80": { keys: ["p"], note: "b2" },
	"k49": { keys: ["1"], note: "c1s" },
	"k50": { keys: ["2"], note: "d1s" },
	"k51": { keys: ["3"], note: "f1s" },
	"k52": { keys: ["4"], note: "g1s" },
	"k53": { keys: ["5"], note: "a1s" },
	"k54": { keys: ["6"], note: "c2s" },
	"k55": { keys: ["7"], note: "d2s" },
	"k56": { keys: ["8"], note: "f2s" },
	"k57": { keys: ["9"], note: "g2s" },
	"k48": { keys: ["0"], note: "a2s" }
};

const activeKeys = {
	mouse: new Set(),
	touch: new Set(),
	keyboard: new Set()
};

// LISTENERS
function addMouseListeners(keys) {
	$(document).on("mousemove mousedown mouseup", handleMouse);

	function handleMouse(event) {
		keys.each(function () {
			const key = $(this);
			const isTouched = isInsideKey(event, this) && event.buttons === 1;	// Check if mouse is inside key and left button is pressed
			isTouched ? playNoteAndSetActive(key, 'mouse') : removeActive(key, 'mouse');
		});
	}
}

function addTouchListeners(keys) {
	// It's necessary to add the { passive: false } option to use preventDefault() in touch events
	document.addEventListener("touchmove", handleTouch, { passive: false });
	document.addEventListener("touchstart", handleTouch, { passive: false });
	document.addEventListener("touchend", handleTouch, { passive: false });

	function handleTouch(event) {
		event.preventDefault(); // To avoid touch actions (scroll, zoom...)
		const touches = Array.from(event.touches); // Array of actual touches

		keys.each(function () {
			const key = $(this);
			const isTouched = touches.some(touch => isInsideKey(touch, this));
			isTouched ? playNoteAndSetActive(key, 'touch') : removeActive(key, 'touch');
		});
	}
}

function addKeyListeners(keys) {
	$(document).on({
		'keydown': (event) => handleKeyEvent(event, true),
		'keyup': (event) => handleKeyEvent(event, false)
	});

	function handleKeyEvent(event, isKeyDown) {
		keys.each(function () {
			const key = $(this);
			const phisicalKeys = keysData[key.attr('id')].keys;

			if (phisicalKeys.includes(event.key)) {
				isKeyDown ? playNoteAndSetActive(key, 'keyboard') : removeActive(key, 'keyboard');
			}
		});
	}
}

// HELPERS
function isInsideKey(event, key) {
	const boundingBox = key.getBoundingClientRect();
	return event.clientX >= boundingBox.left &&
		event.clientX <= boundingBox.right &&
		event.clientY >= boundingBox.top &&
		event.clientY <= boundingBox.bottom;
}

function playNoteAndSetActive(key, eventType) {
	const id = key.attr('id');
	if (!key.hasClass("activa") && !isActive(id)) {
		key.addClass("activa");
		playNote(id);
		activeKeys[eventType].add(id);
	}
}

function removeActive(key, eventType) {
	const id = key.attr('id');
	activeKeys[eventType].delete(id);
	if (!isActive(id)) {
		key.removeClass("activa");
	}
}

function playNote(id) {
	if (!isActive(id)) {
		const note = keysData[id].note;
		let audio = new Audio(`./assets/notes/${note}.mp3`);
		audio.play();
	}
}

function isActive(id) {
	return activeKeys.mouse.has(id) || activeKeys.touch.has(id) || activeKeys.keyboard.has(id);
}

// INIT
(() => {
	// Hide the SVG initially
	$('svg').hide();

	// Add a start button
	const startButton = $('<button>').text('Start');

	// Add a listener to the start button
	startButton.on('click touchend', function () {
		// Remove the start button
		this.remove();

		// Add listeners
		const keys = $('rect');
		addMouseListeners(keys);
		addTouchListeners(keys);
		addKeyListeners(keys);

		// Show the SVG
		$('svg').show();
	});

	// Add the start button to the body
	$('body').append(startButton);
})();

// * It's necessary add a first interaction before play the notes touching the screen bacause browsers block the audio for security reasons