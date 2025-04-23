import readlineSync from "readline-sync"

export function waitForKeyPress() {
    readlineSync.keyInPause('\nPressione qualquer tecla para continuar.');
}
