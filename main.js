import promptSync from "prompt-sync";
import { helpCommand } from "./Sources/constants.js";
import { executeCommand } from "./Sources/commands.js";

global.startups = []

function main () {

    console.clear()
    const prompt = promptSync();

    while (true) {

        console.clear()
        console.log("BEM-VINDO AO STARTUP RUSH!\n")
        console.log("AUTOR: Andrei Pochmann Koenich\n")
        console.log("Digite o comando desejado e pressione ENTER.")
        console.log(`Digite '${helpCommand}' para ver uma lista de comandos.\n`)

        let command = prompt()
        executeCommand(command)
    }

    return 0;
}

main ()