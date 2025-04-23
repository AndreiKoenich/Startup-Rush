import { initialPoints } from "./constants.js"

export class Startup {
    name = ""
    foundationYear = 0
    slogan = ""
    points = initialPoints
    stillInGame = true
    events = []
    constructor(name, foundationYear, slogan) {
        this.name = name;
        this.foundationYear = foundationYear;
        this.slogan = slogan;
    }
}

export class Match {
    startup1 = null
    startup2 = null
    matchNumber = 0

    constructor(startup1, startup2, matchNumber) {
        this.startup1 = startup1;
        this.startup2 = startup2;
        this.matchNumber = matchNumber;
    }
}

export class Event {
    name = ""
    number = -1
    isValid = true

    constructor(name, number) {
        this.name = name;
        this.number = number;
    }
}