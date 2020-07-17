export const sizing = (scale: number) => {
    const whiteWidth = 1 * scale;
    const whiteHeight = 6 * scale;
    const blackWidth = (5 / 8) * scale;
    const blackHeight = whiteHeight * (2 / 3);

    const CDEWIDTH = whiteWidth - (blackWidth * 2) / 3;
    const FGABWIDTH = whiteWidth - (blackWidth * 3) / 4;

    const C = 0;
    const CSHARP = C + CDEWIDTH;
    const D = C + whiteWidth;
    const DSHARP = CSHARP + blackWidth + CDEWIDTH;
    const E = D + whiteWidth;
    const F = E + whiteWidth;
    const FSHARP = F + FGABWIDTH;
    const G = F + whiteWidth;
    const GSHARP = FSHARP + blackWidth + FGABWIDTH;
    const A = G + whiteWidth;
    const ASHARP = GSHARP + blackWidth + FGABWIDTH;
    const B = A + whiteWidth;

    return {
        whiteWidth,
        whiteHeight,
        blackWidth,
        blackHeight,
        offsets: [C, CSHARP, D, DSHARP, E, F, FSHARP, G, GSHARP, A, ASHARP, B],
    };
};
