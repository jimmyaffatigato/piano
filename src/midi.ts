import { isBlack } from "./util";

let outputs = undefined as WebMidi.MIDIOutput[];

export const pressKey = (note: number, vel: number): void => {
    const g = 255 - vel * 2;
    document.getElementById(`note-${note}`).style.fill = `#ffff${g.toString(16).padStart(2, "0")}`;
};

export const releaseKey = (note: number): void => {
    document.getElementById(`note-${note}`).style.fill = isBlack(note) ? "black" : "white";
};

export async function openMIDI(): Promise<void> {
    if (navigator.requestMIDIAccess) {
        const midiAccess = await navigator.requestMIDIAccess();
        midiAccess.inputs.forEach((input) => {
            input.onmidimessage = onMIDIMessage;
        });
        outputs = Array.from(midiAccess.outputs).map((value) => value[1]);
    }
}

export const sendNote = (pitch: number) => {
    outputs.forEach((output) => {
        output.send([144, pitch, 127]);
    });
};
export const stopNote = (pitch: number) => {
    outputs.forEach((output) => {
        output.send([128, pitch, 0]);
    });
};

const onMIDIMessage = (event: WebMidi.MIDIMessageEvent): void => {
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
};
openMIDI();
