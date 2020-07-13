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

const KEYOFFSETS = [0, 14.33, 23, 41.66, 46, 69, 82.25, 92, 108.25, 115, 134.75, 138].map((value) => value * SCALE);

const piano = document.createElementNS("http://www.w3.org/2000/svg", "svg");
document.body.appendChild(piano);
piano.setAttribute("height", String(WHITEHEIGHT));
piano.setAttribute("width", String(KEYBOARDWIDTH));

let clicked = false;
window.addEventListener("mousedown", () => {
    clicked = true;
});
window.addEventListener("mouseup", () => {
    clicked = false;
});

for (let o = 0; o < OCTAVES; o++) {
    const whiteKeys = document.createElementNS("http://www.w3.org/2000/svg", "g");
    whiteKeys.setAttribute("transform", `translate(${OCTAVEWIDTH * o})`);
    const blackKeys = document.createElementNS("http://www.w3.org/2000/svg", "g");
    blackKeys.setAttribute("transform", `translate(${OCTAVEWIDTH * o})`);
    const labels = document.createElementNS("http://www.w3.org/2000/svg", "g");
    labels.setAttribute("transform", `translate(${OCTAVEWIDTH * o})`);
    piano.appendChild(whiteKeys);
    piano.appendChild(blackKeys);
    piano.appendChild(labels);
    for (let i = 0; i < 12; i++) {
        const key = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const note = o * 12 + i;
        key.addEventListener("mousedown", () => {
            pressKey(note);
            sendNote(note);
        });
        key.addEventListener("mouseup", () => {
            releaseKey(note);
            stopNote(note);
        });
        key.addEventListener("mouseout", () => {
            releaseKey(note);
            stopNote(note);
        });
        key.addEventListener("mouseenter", () => {
            if (clicked) {
                pressKey(note);
                sendNote(note);
            }
        });
        key.id = `note-${note}`;
        key.setAttribute("y", "0");
        key.style.stroke = "black";
        key.setAttribute("x", String(KEYOFFSETS[i]));
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.textContent = String(note);
        label.setAttribute("x", String(KEYOFFSETS[i]));
        label.style.userSelect = "none";
        labels.appendChild(label);
        if (isBlack(note)) {
            key.style.fill = BLACKKEYUP;
            key.setAttribute("width", String(BLACKWIDTH));
            key.setAttribute("height", String(BLACKHEIGHT));
            blackKeys.appendChild(key);
            label.setAttribute("y", String(BLACKHEIGHT));
            label.style.fill = "white";
        } else {
            key.style.fill = WHITEKEYUP;
            key.setAttribute("width", String(WHITEWIDTH));
            key.setAttribute("height", String(WHITEHEIGHT));
            whiteKeys.appendChild(key);
            label.setAttribute("y", String(WHITEHEIGHT));
            label.style.fill = "black";
        }
    }
}

function pressKey(note: number): void {
    document.getElementById(`note-${note}`).style.fill = WHITEKEYDOWN;
}

function releaseKey(note: number): void {
    document.getElementById(`note-${note}`).style.fill = isBlack(note) ? BLACKKEYUP : WHITEKEYUP;
}

function openMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator
            .requestMIDIAccess({
                sysex: false,
            })
            .then((midi) => {
                midi.inputs.forEach((input) => {
                    input.onmidimessage = onMIDIMessage;
                });
                midi.outputs.forEach((output) => {
                    outputs.push(output);
                });
            })
            .catch((e) => console.log(e.message));
    }
}

const outputs = [] as WebMidi.MIDIOutput[];

function sendNote(pitch: number) {
    outputs.forEach((output) => {
        output.send([144, pitch, 127]);
    });
}
function stopNote(pitch: number) {
    outputs.forEach((output) => {
        output.send([128, pitch, 0]);
    });
}

sendNote(60);

function onMIDIMessage(event: WebMidi.MIDIMessageEvent): void {
    const [type, pitch, vel] = event.data;
    switch (type) {
        case 144:
            //Note On
            if (vel > 0) {
                pressKey(pitch);
            }
            //Note Off
            else {
                releaseKey(pitch);
            }
            break;
    }
}
openMIDI();

function isBlack(note: number): boolean {
    const pitch = Math.floor(note % 12);
    switch (pitch) {
        case 1:
        case 3:
        case 6:
        case 8:
        case 10:
            return true;
    }
    return false;
}
