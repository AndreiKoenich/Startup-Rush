export const initialPoints = 70;
export const minimumStartupsNumber = 4
export const maximumStartupsNumber = 8
export const roundWonPoints = 30
export const minimumFoundationYear = 1900
export const sharkTankPoints = 2

export const deleteStartupCommand = "delete"
export const registerStartupCommand = "register"
export const viewStartupsCommand = "view"
export const helpCommand = "help"
export const startTournamentCommand = "start"
export const exitCommand = "exit"
export const endMatchCommand = "end"

export const eventPoints = Object.freeze({
    CONVINCING_PITCH: 6, 
    BUGGY_PRODUCT: -4,   
    USER_TRACTION: 3,    
    ANGRY_INVESTOR: -6,  
    FAKE_NEWS: -8,   
});

export const eventNames = Object.freeze({
    CONVINCING_PITCH: "Pith Convincente (+6 pontos)",
    BUGGY_PRODUCT: "Produto com Bugs (-4 pontos)",
    USER_TRACTION: "Boa Tração de Usuários (+3 pontos)",
    ANGRY_INVESTOR: "Investidor Bravo (-6 pontos)",
    FAKE_NEWS: "Pitch com Fake News (-8 pontos)",
});