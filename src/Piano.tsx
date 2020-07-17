import React from "react";
import PianoKey from "./PianoKey";
import { isBlack } from "./util";

interface PianoProps {
    low: number;
    high: number;
    whiteKeyWidth: number;
    whiteKeyHeight: number;
    blackKeyWidth: number;
    blackKeyHeight: number;
    offsets: number[];
    gap: number;
    whiteColor?: string;
    blackColor?: string;
}

const Piano: React.FC<PianoProps> = (props: PianoProps) => {
    const {
        low,
        high,
        whiteKeyWidth,
        whiteKeyHeight,
        blackKeyWidth,
        blackKeyHeight,
        offsets,
        gap: keySpaces,
        whiteColor,
        blackColor,
    } = props;
    const lowestNotePitch = low % 12;
    const lowestNoteOctave = Math.floor(low / 12);
    const x = lowestNoteOctave * (whiteKeyWidth * 7) + offsets[lowestNotePitch];
    const notes = [];
    let totalWidth = 0;
    for (let note = low; note <= high; note++) {
        notes.push(note);
        totalWidth += !isBlack(note) ? whiteKeyWidth : 0;
    }
    return (
        <svg className="piano" width={totalWidth} height={whiteKeyHeight}>
            <g className="whiteKeys">
                {notes
                    .filter((note) => !isBlack(note))
                    .map((note, i) => {
                        const octave = Math.floor(note / 12);
                        const pitch = note % 12;
                        return (
                            <PianoKey
                                note={note}
                                offset={whiteKeyWidth * 7 * octave + offsets[pitch] - x}
                                width={whiteKeyWidth}
                                height={whiteKeyHeight}
                                gap={keySpaces}
                                color={whiteColor ? whiteColor : "white"}
                                key={i}
                            />
                        );
                    })}
            </g>
            <g className="blackKeys">
                {notes
                    .filter((note) => isBlack(note))
                    .map((note, i) => {
                        const octave = Math.floor(note / 12);
                        const pitch = note % 12;
                        return (
                            <PianoKey
                                note={note}
                                offset={whiteKeyWidth * 7 * octave + offsets[pitch] - x}
                                width={blackKeyWidth}
                                height={blackKeyHeight}
                                gap={keySpaces}
                                color={blackColor ? blackColor : "black"}
                                key={i}
                            />
                        );
                    })}
            </g>
        </svg>
    );
};

export default Piano;
