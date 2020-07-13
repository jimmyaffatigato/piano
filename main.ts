/// <reference lib="dom" />

const WHITEKEYUP = "white";
const BLACKKEYUP = "black";
const WHITEKEYDOWN = "yellow";
const BLACKKEYDOWN = "red";

const SCALE = 1;

const WHITEWIDTH = 23 * SCALE;
const WHITEHEIGHT = 120 * SCALE;
const BLACKWIDTH = 13 * SCALE;
const BLACKHEIGHT = 80 * SCALE;

const OCTAVEWIDTH = WHITEWIDTH * 7;
const OCTAVES = 10;

const KEYBOARDWIDTH = OCTAVEWIDTH * OCTAVES;

const BLACKOFFSETS = [14.33 * SCALE, 41.66 * SCALE, 82.25 * SCALE, 108.25 * SCALE, 134.75 * SCALE];

const WHITEPITCHES = [0, 2, 4, 5, 7, 9, 11];
const BLACKPITCHES = [1, 3, 6, 8, 10];

const piano = document.createElementNS("http://www.w3.org/2000/svg", "svg");
document.body.appendChild(piano);
piano.setAttribute("height", String(WHITEHEIGHT));
piano.setAttribute("width", String(KEYBOARDWIDTH));

for (let o = 0; o < OCTAVES; o++) {
    const whiteKeys = document.createElementNS("http://www.w3.org/2000/svg", "g");
    whiteKeys.setAttribute("transform", `translate(${161 * o})`);
    for (let i = 0; i < 7; i++) {
        const key = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const note = o * 12 + WHITEPITCHES[i];
        key.id = `note-${note}`;
        key.style.fill = WHITEKEYUP;
        key.style.stroke = "black";
        key.setAttribute("x", String(i * WHITEWIDTH));
        key.setAttribute("y", "0");
        key.setAttribute("width", String(WHITEWIDTH));
        key.setAttribute("height", String(WHITEHEIGHT));
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", String(i * WHITEWIDTH));
        label.setAttribute("y", String(WHITEHEIGHT));
        label.style.fill = "black";
        label.textContent = String(note);
        whiteKeys.appendChild(key);
        whiteKeys.appendChild(label);
    }
    piano.appendChild(whiteKeys);
    const blackKeys = document.createElementNS("http://www.w3.org/2000/svg", "g");
    blackKeys.setAttribute("transform", `translate(${161 * o})`);
    for (let i = 0; i < 5; i++) {
        const key = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        key.style.fill = BLACKKEYUP;
        key.style.stroke = "black";
        key.setAttribute("x", String(BLACKOFFSETS[i]));
        key.setAttribute("y", "0");
        key.setAttribute("width", String(BLACKWIDTH));
        key.setAttribute("height", String(BLACKHEIGHT));
        blackKeys.appendChild(key);
    }
    piano.appendChild(blackKeys);
}

pressKey(63);

function pressKey(note: number): void {
    document.getElementById(`note-${note}`).style.fill = WHITEKEYDOWN;
}
