/// <reference lib="dom" />

import React from "react";
import ReactDOM from "react-dom";
import Piano from "./Piano";
import { openMIDI } from "./midi";
import { sizing } from "./pianoCalc";

const LOWESTPITCH = 21;
const HIGHESTPITCH = 108;

const WHITEKEYUP = "white";
const BLACKKEYUP = "black";

const scale = 23;

export let clicked = false;
window.addEventListener("mousedown", () => {
    clicked = true;
});
window.addEventListener("mouseup", () => {
    clicked = false;
});

const gap = (1 / 16) * scale;

const container = document.createElement("div");
document.body.appendChild(container);
openMIDI().then(() => {
    const { whiteWidth, whiteHeight, blackWidth, blackHeight, offsets } = sizing(scale);
    ReactDOM.render(
        <Piano
            low={LOWESTPITCH}
            high={HIGHESTPITCH}
            whiteKeyWidth={whiteWidth}
            whiteKeyHeight={whiteHeight}
            blackKeyWidth={blackWidth}
            blackKeyHeight={blackHeight}
            offsets={offsets}
            gap={gap}
            blackColor={BLACKKEYUP}
            whiteColor={WHITEKEYUP}
        />,
        container
    );
});
