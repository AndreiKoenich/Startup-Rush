import * as constants from "./constants.js";
import { Match, Event } from "./classes.js";
import { waitForKeyPress, clearTerminal } from "./utils.js"
import promptSync from "prompt-sync";

export function startMatches() {
    
    const prompt = promptSync();
    
    for (let i = 0; i < global.startups.length; i++)  
        for (let j = 0; j < Object.values(constants.eventsNameWithPoints).length; j++)
            global.startups[i].events.push(0)

    let roundNumber = 1

    while (roundNumber <= calculateTournamentRounds(global.startups.length)) {

        let indexesArray = []
        let matches = []
        
        for (let i = 0; i < global.startups.length; i++) 
            if (global.startups[i].stillInGame)
                indexesArray.push(i)

        shuffleArray(indexesArray)

        let matchLimit = indexesArray.length % 2 === 0 ? indexesArray.length : indexesArray.length-1
        let matchNumber = 1

        for (let i = 0; i < matchLimit; i += 2) {
            let startup1 = global.startups[indexesArray[i]]
            let startup2 = global.startups[indexesArray[i + 1]]
            matches.push(new Match(startup1, startup2, matchNumber))
            matchNumber++
        }

        while (matches.length > 0) {

            clearTerminal()
            let invalidCommand = true
            
            console.log(`RODADA #${roundNumber}:\n`)
            console.log('Digite o número correspondente ao confronto e pressione ENTER iniciar o confronto desejado.\n')
            

            for (let i = 0; i < matches.length; i++) {
                console.log(`Confronto ${matches[i].matchNumber} - ${matches[i].startup1.name} VS ${matches[i].startup2.name}`)
            }

            console.log()

            let command = prompt()

            for (let i = 0; i < matches.length; i++) {
                if (command == matches[i].matchNumber) {
                    singleMatch(global.startups.indexOf(matches[i].startup1), global.startups.indexOf(matches[i].startup2))
                    matches.splice(i, 1)
                    invalidCommand = false
                    break
                }
            }

            if (invalidCommand) {
                console.log("\nERRO: comando inválido! Tente novamente.\n");
                waitForKeyPress()
                continue
            }
        }

        roundNumber++
    }

    clearTerminal()

    for (let i = 0; i < global.startups.length; i++) {
        if (global.startups[i].stillInGame) {
            console.log(`A startup ${global.startups[i].name} venceu o torneio!`)
            break
        }
    }

    console.log("\n-----------------------------------------------\n")
    console.log("FIM DO TORNEIO!")
    waitForKeyPress()
    clearTerminal()
    showFinalResults()
    resetStartups()
}

function singleMatch(indexStartup1, indexStartup2) {

    const prompt = promptSync();

    let startup1 = global.startups[indexStartup1]
    let startup2 = global.startups[indexStartup2]
    
    let startup1Events = []
    let startup2Events = []

    for (let i = 0; i < Object.values(constants.eventsNameWithPoints).length; i++) {
        startup1Events.push(new Event(Object.values(constants.eventsNameWithPoints)[i], i))
        startup2Events.push(new Event(Object.values(constants.eventsNameWithPoints)[i], i + Object.values(constants.eventsNameWithPoints).length))
    }

    let startup1Index = global.startups.indexOf(startup1)
    let startup2Index = global.startups.indexOf(startup2)

    let command = ""

    while (command !== constants.endMatchCommand) {

        clearTerminal()

        console.log(`CONFRONTO: ${startup1.name} VS ${startup2.name}`)

        console.log("-----------------------------------------------\n")

        console.log(`STARTUP: ${startup1.name} (${startup1.points} pontos)`)
        console.log('\nEventos disponíveis:\n')

        for (let i = 0; i < startup1Events.length; i++)
            if (startup1Events[i].isValid)
                console.log(`${startup1Events[i].number} - ${startup1Events[i].name}`)
        
        console.log("\n-----------------------------------------------\n")

        console.log(`STARTUP: ${startup2.name} (${startup2.points} pontos)`)
        console.log('\nEventos disponíveis:\n')

        for (let i = 0; i < startup2Events.length; i++)
            if (startup2Events[i].isValid)
                console.log(`${startup2Events[i].number} - ${startup2Events[i].name}`)

        console.log('\nDigite o número correspondente ao evento e pressione ENTER para adicionar ou remover os pontos.')
        console.log(`Digite '${constants.endMatchCommand}' para encerrar o confronto.\n`)

        command = prompt()

        let invalidCommand = true
        
        if (command === constants.endMatchCommand)
            break

        for (let i = 0; i < Object.values(constants.eventsNameWithPoints).length; i++) {
            if (command == startup1Events[i].number && startup1Events[i].isValid) {
                global.startups[startup1Index].points += Object.values(constants.eventPoints)[i]
                global.startups[startup1Index].events[i]++
                startup1Events[i].isValid = false
                invalidCommand = false
                break
            }

            else if (command == startup2Events[i].number && startup2Events[i].isValid) {
                global.startups[startup2Index].points += Object.values(constants.eventPoints)[i]
                global.startups[startup2Index].events[i]++
                startup2Events[i].isValid = false
                invalidCommand = false
                break
            }   
        }

        if (invalidCommand) {
            console.log("\nERRO: comando inválido! Tente novamente.\n");
            waitForKeyPress();
        }
    }

    getWinner(startup1Index, startup2Index)
    waitForKeyPress()
}

function getWinner(startup1Index, startup2Index) {

    if (global.startups[startup1Index].points > global.startups[startup2Index].points) {
        global.startups[startup1Index].points += constants.roundWonPoints
        global.startups[startup1Index].events[Object.values(constants.eventsNameWithPoints).indexOf(constants.eventsNameWithPoints.ROUND_WON)]++
        global.startups[startup2Index].stillInGame = false
        console.log("\n-----------------------------------------------\n")
        console.log(`A startup ${global.startups[startup1Index].name} venceu o confronto!`)
    }

    else if (global.startups[startup1Index].points < global.startups[startup2Index].points) {
        global.startups[startup2Index].points += constants.roundWonPoints
        global.startups[startup2Index].events[Object.values(constants.eventsNameWithPoints).indexOf(constants.eventsNameWithPoints.ROUND_WON)]++
        global.startups[startup1Index].stillInGame = false
        console.log("\n-----------------------------------------------\n")
        console.log(`A startup ${global.startups[startup2Index].name} venceu o confronto!`)
    }

    else {
        let sharkFightIndex = sharkFight(startup1Index, startup2Index)
        global.startups[sharkFightIndex].points += (constants.roundWonPoints + constants.sharkFightPoints)
        global.startups[sharkFightIndex].events[Object.values(constants.eventsNameWithPoints).indexOf(constants.eventsNameWithPoints.ROUND_WON)]++
        console.log("\n-----------------------------------------------\n")
        console.log(`A startup ${global.startups[sharkFightIndex].name} venceu o confronto por meio de Shark Fight (+${constants.sharkFightPoints} pontos)!`)

        if (sharkFightIndex === startup1Index) {
            global.startups[startup2Index].stillInGame = false
        } else {
            global.startups[startup1Index].stillInGame = false
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sharkFight (index1, index2) {
    return Math.random() < 0.5 ? index1 : index2
}

function showFinalResults() {

    console.log("Resultados finais:\n");
    global.startups.sort((a, b) => b.points - a.points);
    global.startups.forEach((startup, index) => {
        process.stdout.write(`${index + 1}. ${startup.name} - ${startup.points} pontos totais - Eventos: `);
        for (let i = 0; i < startup.events.length; i++) 
                process.stdout.write(`${Object.values(constants.eventsNameWithoutPoints)[i]} (${startup.events[i]} VEZES) || `);
        console.log();
    });

    console.log("\n-----------------------------------------------\n")
    console.log(`Parabéns pela vitória, ${global.startups[0].name}!`)
    console.log(`Slogan: ${global.startups[0].slogan}`)
    console.log(`Ano de fundação: ${global.startups[0].foundationYear}`)
    waitForKeyPress()
}

function resetStartups() {
    for (let i = 0; i < global.startups.length; i++) {
        global.startups[i].points = constants.initialPoints
        global.startups[i].stillInGame = true
        global.startups[i].events = []
    }
}

function calculateTournamentRounds(participants) {
    let rounds = 0;
    
    while (participants > 1) {
        participants = participants / 2;
        rounds++;
    }
    
    return rounds;
}