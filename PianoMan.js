"use strict";

///////////////////////////////////////////////////////////
// Alumnes: Marc Peral i Víctor Comino
///////////////////////////////////////////////////////////

// DATA
const keysData = [
	{ note: "c1", keys: ["a"], ids: ["k65", "c65"] },
	{ note: "d1", keys: ["s"], ids: ["k83", "c83"] },
	{ note: "e1", keys: ["d"], ids: ["k68", "c68"] },
	{ note: "f1", keys: ["f"], ids: ["k70", "c70"] },
	{ note: "g1", keys: ["g", "q"], ids: ["k71", "c71"] },
	{ note: "a1", keys: ["h", "w"], ids: ["k72", "c72"] },
	{ note: "b1", keys: ["j", "e"], ids: ["k74", "c74"] },
	{ note: "c2", keys: ["r", "k"], ids: ["k82", "c82"] },
	{ note: "d2", keys: ["t", "l"], ids: ["k84", "c84"] },
	{ note: "e2", keys: ["y", "ñ"], ids: ["k89", "c89"] },
	{ note: "f2", keys: ["u"], ids: ["k85", "c85"] },
	{ note: "g2", keys: ["i"], ids: ["k73", "c73"] },
	{ note: "a2", keys: ["o"], ids: ["k79", "c79"] },
	{ note: "b2", keys: ["p"], ids: ["k80", "c80"] },
	{ note: "c1s", keys: ["1"], ids: ["k49", "c49"] },
	{ note: "d1s", keys: ["2"], ids: ["k50", "c50"] },
	{ note: "f1s", keys: ["3"], ids: ["k51", "c51"] },
	{ note: "g1s", keys: ["4"], ids: ["k52", "c52"] },
	{ note: "a1s", keys: ["5"], ids: ["k53", "c53"] },
	{ note: "c2s", keys: ["6"], ids: ["k54", "c54"] },
	{ note: "d2s", keys: ["7"], ids: ["k55", "c55"] },
	{ note: "f2s", keys: ["8"], ids: ["k56", "c56"] },
	{ note: "g2s", keys: ["9"], ids: ["k57", "c57"] },
	{ note: "a2s", keys: ["0"], ids: ["k48", "c48"] }
];

// To aviod interaction conflicts between mouse, touch and keyboard
const activeKeys = {
	mouse: new Set(),
	touch: new Set(),
	keyboard: new Set()
};

// INIT
(() => {
	// Hide the SVG initially
	$('svg').hide();

	// Add a start button
	const startButton = $('<button>').text('Start');

	// Add a listener to the start button
	startButton.on('click touchend', function () {
		// Add listeners
		const elements = $('rect, text');
		addMouseListeners(elements);
		addTouchListeners(elements);
		addKeyListeners();

		// Remove the start button and show the SVG
		this.remove();
		$('svg').show();
	});

	// Add the start button to the body
	$('body').append(startButton);
})();

/*
 * It's necessary add a first interaction before 
 * play the notes touching the screen bacause 
 * browsers block the audio for security reasons
 */ 

// LISTENERS
function addMouseListeners(elements) {
	$(document).on("mousemove mousedown mouseup", (event) => {
		elements.each(function () {
			const key = selectKey(this);
			const isTouched = isInsideKey(event, key) && event.buttons === 1;	// event.buttons === 1 -> left button
			isTouched ? press(key, 'mouse') : release(key, 'mouse');
		});
	});
}

function addTouchListeners(elements) {
	// It's necessary to add the { passive: false } option to use preventDefault() in touch events
	document.addEventListener("touchmove", handleTouch, { passive: false });
	document.addEventListener("touchstart", handleTouch, { passive: false });
	document.addEventListener("touchend", handleTouch, { passive: false });

	function handleTouch(event) {
		event.preventDefault(); // To avoid touch actions (scroll, zoom...)
		const touches = Array.from(event.touches);

		elements.each(function () {
			const key = selectKey(this);
			const isTouched = touches.some(touch => isInsideKey(touch, key));
			isTouched ? press(key, 'touch') : release(key, 'touch');
		});
	}
}

function addKeyListeners() {
	$(document).on({
		'keydown': (event) => handleKeyEvent(event, true),
		'keyup': (event) => handleKeyEvent(event, false)
	});

	function handleKeyEvent(event, isKeyDown) {
		const noteData = keysData.find(data => data.keys.includes(event.key));
		if (noteData) {
			const key = $(`#${noteData.ids[0]}`).get(0);
			isKeyDown ? press(key, 'keyboard') : release(key, 'keyboard');
		}
	}
}

// HELPERS
function selectKey(element) {
	const jqElem = $(element);
	return jqElem.is('rect') ? jqElem.get(0) : jqElem.prev().get(0);
}

function isInsideKey(event, key) {
	const elementAtPoint = document.elementFromPoint(event.clientX, event.clientY);
	return elementAtPoint === key || elementAtPoint.previousSibling === key;
}

function press(key, eventType) {
	if (!isActive(key.id)) {
		$(key).addClass("activa");
		playNote(key.id);
	}
	activeKeys[eventType].add(key.id);
}

function release(key, eventType) {
	activeKeys[eventType].delete(key.id);
	!isActive(key.id) && $(key).removeClass("activa");
}

function isActive(id) {
	return activeKeys.mouse.has(id) || activeKeys.touch.has(id) || activeKeys.keyboard.has(id);
}

function playNote(id) {
	if (!isActive(id)) {
		const note = keysData.find(data => data.ids.includes(id)).note;
		let audio = new Audio(`./assets/notes/${note}.mp3`);
		audio.play();
	}
}