import readlineSync from "readline-sync";

export function waitForKeyPress() {
    readlineSync.keyIn('\nPressione ESPAÇO para continuar.', {
        hideEchoBack: true,  
        mask: ''            
    });
}

export function clearTerminal() {
    process.stdout.write('\x1Bc')
}