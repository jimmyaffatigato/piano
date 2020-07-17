import React from "react";
import { clicked } from "./main";
import { pressKey, releaseKey, sendNote, stopNote } from "./midi";

interface PianoKeyProps {
    note: number;
    color: string;
    offset: number;
    width: number;
    height: number;
    gap: number;
}

const PianoKey: React.FC<PianoKeyProps> = (props: PianoKeyProps) => {
    const { note, color, offset, width, height, gap } = props;
    return (
        <rect
            id={`note-${note}`}
            x={offset}
            y={0}
            width={width}
            height={height}
            fill={color}
            stroke={"black"}
            strokeWidth={gap}
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

export default PianoKey;
