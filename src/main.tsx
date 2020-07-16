/// <reference lib="dom" />

import React from "react";
import ReactDOM from "react-dom";

const WHITEKEYUP = "white";
const BLACKKEYUP = "black";

const SCALE = 1;

const WHITEWIDTH = 23 * SCALE;
const WHITEHEIGHT = 120 * SCALE;
const BLACKWIDTH = 13 * SCALE;
const BLACKHEIGHT = 80 * SCALE;

const OCTAVEWIDTH = WHITEWIDTH * 7;
const OCTAVES = 10;

const LOWESTNOTE = 21;
const HIGHESTNOTE = 108;

const lowestNotePitch = LOWESTNOTE % 12;
const lowestNoteOctave = Math.floor(LOWESTNOTE / 12);

const KEYOFFSETS = [0, 14.33, 23, 41.66, 46, 69, 82.25, 92, 108.25, 115, 134.75, 138].map((value) => value * SCALE);

const KEYBOARDSTARTINGX = lowestNoteOctave * OCTAVEWIDTH + KEYOFFSETS[lowestNotePitch];

const KEYBOARDWIDTH = OCTAVEWIDTH * OCTAVES;

let clicked = false;
window.addEventListener("mousedown", () => {
    clicked = true;
});
window.addEventListener("mouseup", () => {
    clicked = false;
});

const PianoKey: React.FC<{ note: number }> = (props: { note: number }) => {
    const { note } = props;
    const octave = Math.floor(note / 12);
    const pitch = note % 12;
    const black = isBlack(note);
    return (
        <rect
            id={`note-${note}`}
            x={OCTAVEWIDTH * octave + KEYOFFSETS[pitch]}
            y={0}
            width={black ? BLACKWIDTH : WHITEWIDTH}
            height={black ? BLACKHEIGHT : WHITEHEIGHT}
            fill={black ? BLACKKEYUP : WHITEKEYUP}
            stroke={"black"}
            onMouseDown={() => {
                pressKey(note, 127);
                sendNote(note);
            }}
            onMouseUp={() => {
                releaseKey(note);
                stopNote(note);
            }}
            onMouseOut={() => {
                releaseKey(note);
                stopNote(note);
            }}
            onMouseEnter={() => {
                if (clicked) {
                    pressKey(note, 127);
                    sendNote(note);
                }
            }}
        />
    );
};

const Piano: React.FC<{}> = (props: {}) => {
    const notes = [];
    for (let note = LOWESTNOTE; note < HIGHESTNOTE; note++) {
        notes.push(note);
    }
    return (
        <svg width={KEYBOARDWIDTH} height={WHITEHEIGHT} transform={`translate(${-KEYBOARDSTARTINGX})`}>
            <g id="whiteKeys">
                {notes
                    .filter((note) => !isBlack(note))
                    .map((note, i) => {
                        return <PianoKey note={note} key={i} />;
                    })}
            </g>
            <g id="blackKeys">
                {notes
                    .filter((note) => isBlack(note))
                    .map((note, i) => {
                        return <PianoKey note={note} key={i} />;
                    })}
            </g>
        </svg>
    );
};

const container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(<Piano />, container);

function pressKey(note: number, vel: number): void {
    const g = 255 - vel * 2;
    document.getElementById(`note-${note}`).style.fill = `#ffff${g.toString(16).padStart(2, "0")}`;
}

function releaseKey(note: number): void {
    document.getElementById(`note-${note}`).style.fill = isBlack(note) ? BLACKKEYUP : WHITEKEYUP;
}

function openMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator
            .requestMIDIAccess()
            .then((midi) => {
                midi.inputs.forEach((input) => {
                    input.onmidimessage = onMIDIMessage;
                });
                midi.outputs.forEach((output) => {
                    outputs.push(output);
                });
            })
            .catch((e) => console.error(e.message));
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

function onMIDIMessage(event: WebMidi.MIDIMessageEvent): void {
    const [type, pitch, vel] = event.data;
    switch (type) {
        case 144:
            //Note On
            if (vel > 0) {
                pressKey(pitch, vel);
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
