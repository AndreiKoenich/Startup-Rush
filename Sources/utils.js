import readlineSync from "readline-sync";

export function waitForKeyPress() {
    readlineSync.keyIn('\nPressione ESPAÇO para continuar.', {
        hideEchoBack: true,  
        mask: ''            
    });
}