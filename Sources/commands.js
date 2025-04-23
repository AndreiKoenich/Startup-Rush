import * as constants from "./constants.js"
import { waitForKeyPress } from "./utils.js"
import { Startup } from "./classes.js"
import { startMatches } from "./tournament.js"

export function executeCommand(command) {
    
    if (command.startsWith(constants.registerStartupCommand)) 
        registerStartupCommand(command)

    else if (command.startsWith(constants.deleteStartupCommand)) 
        deleteStartupCommand(command)

    else if (command === constants.viewStartupsCommand)
       viewStartupsCommand(command)
    
    else if (command === constants.startTournamentCommand)
        startTournamentCommand(command)
    
    else if (command === constants.exitCommand) 
        exitCommand()

    else if (command === constants.helpCommand) 
        helpCommand()
    
    else {
        console.log("\nERRO: comando inválido! Digite 'help' para ver a lista de comandos.")
        waitForKeyPress()
    }

    return;
}

export function helpCommand() {
    console.clear()
    console.log("COMANDOS DISPONÍVEIS\n")
    console.log("register <nome da startup> <ano de fundação> <slogan> - Registra uma nova startup.\n")
    console.log("view - Mostra todas as startups cadastradas.\n")
    console.log("delete <nome da startup> - Deleta uma startup.\n")
    console.log("start - Inicia o torneio.\n")
    console.log("exit - Encerra o programa.\n")
    waitForKeyPress()
}

export function registerStartupCommand(command) {

    if (global.startups.length >= constants.maximumStartupsNumber) {
        console.log("\nERRO: número máximo de startups atingido!");
        console.log(`É permitido o cadastro de no máximo ${constants.maximumStartupsNumber} startups.`);
        waitForKeyPress();
        return;
    }

    const args = command.split(" ");

    if (args.length < 3) {
        console.log("\nERRO: comando inválido! Use: register <nome da startup> <ano de fundação> <slogan>");
        waitForKeyPress();
        return;
    }

    const foundationYearIndex = args.findIndex(arg => !isNaN(parseInt(arg)));

    if (foundationYearIndex === -1 || foundationYearIndex < 2) {
        console.log("\nERRO: comando inválido! Certifique-se de incluir o ano de fundação.");
        waitForKeyPress();
        return;
    }

    const name = args.slice(1, foundationYearIndex).join(" ");
    const foundationYear = parseInt(args[foundationYearIndex]);
    const slogan = args.slice(foundationYearIndex + 1).join(" ");

    if (isNaN(foundationYear)) {
        console.log("\nERRO: ano de fundação inválido!");
        waitForKeyPress();
        return;
    }

    if (foundationYear < constants.minimumFoundationYear || foundationYear > new Date().getFullYear()) {
        console.log("\nERRO: ano de fundação inválido! Deve ser entre 1900 e o ano atual.");
        waitForKeyPress();
        return;
    }

    global.startups.push(new Startup(name, foundationYear, slogan));
    console.log("\nStartup registrada com sucesso!");
    waitForKeyPress();
}

export function viewStartupsCommand() {
    console.clear()
    console.log("STARTUPS CADASTRADAS\n")

    if (global.startups.length === 0) {
        console.log("Nenhuma startup cadastrada.")
    } 
    else {
        global.startups.forEach((startup) => {
            console.log(`${startup.name} (${startup.foundationYear}) - ${startup.slogan}`)
        })
    }

    waitForKeyPress()
}

export function deleteStartupCommand(command) {
    const args = command.split(" ")
    if (args.length < 2) {
        console.log("\nERRO: comando inválido! Use: delete <nome da startup>")
        waitForKeyPress()
        return
    }

    const name = args.slice(1).join(" ");
    const index = global.startups.findIndex((startup) => startup.name === name)

    if (index === -1) {
        console.log("\nERRO: startup não encontrada!")
        waitForKeyPress()
        return
    }

    global.startups.splice(index, 1)
    console.log("\nStartup deletada com sucesso!")
    waitForKeyPress()
}

export function startTournamentCommand() {

    if (global.startups.length < constants.minimumStartupsNumber) {
        console.log("\nERRO: Número insuficiente de startups para iniciar o torneio.")
        console.log(`São necessárias no mínimo ${constants.minimumStartupsNumber} e no máximo ${constants.maximumStartupsNumber} startups.`)
        console.log("Para iniciar o torneio, o número de startups registradas deve ser par.")
        waitForKeyPress()
        return
    }

    else if (global.startups.length > constants.maximumStartupsNumber) {
        console.log("\nERRO: Número excessivo de startups para iniciar o torneio.")
        console.log(`São permitidas no máximo ${constants.maximumStartupsNumber} startups.`)
        console.log("Para iniciar o torneio, o número de startups registradas deve ser par.")
        waitForKeyPress()
        return
    }

    else if (global.startups.length % 2 !== 0) {
        console.log("\nERRO: Número ímpar de startups.")
        console.log("Para iniciar o torneio, o número de startups registradas deve ser par.")
        waitForKeyPress()
        return
    }

    startMatches()
}

export function exitCommand () {
    console.clear()
    process.exit(0)
}