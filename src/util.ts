export function isBlack(note: number): boolean {
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
