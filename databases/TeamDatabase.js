import DatabaseHandler from "./DatabaseHandler.js"
import CardDatabase from "./CardDatabase.js"
import MissingReferenceError from "../errors/MissingReferenceError.js"
import MissingValueError from "../errors/MissingValueError.js"

class Team {
    static #teams = []

    #team
    #leader
    #subleader
    #member1
    #member2
    #member3

    constructor(
        team,
        leader,
        subleader,
        member1,
        member2,
        member3
    ) {
        if(!team) throw new MissingValueError('Team', 'team', team)
        if(!leader) throw new MissingValueError('Team', 'leader', team)
        if(!subleader && member1) throw new MissingValueError('Team', 'subleader', team)
        if(!member1 && member2) throw new MissingValueError('Team', 'member1', team)
        if(!member2 && member3) throw new MissingValueError('Team', 'member2', team)

        this.#team = team
        this.#leader = leader
        this.#subleader = subleader
        this.#member1 = member1
        this.#member2 = member2
        this.#member3 = member3

        if(!Team.#teams) {
            Team.#teams = []
        }
        Team.#teams.push(this)
    }

    static getTeams() {
        return Team.#teams
    }

    get team() { return this.#team }
    get leader() { return this.#leader }
    get subleader() { return this.#subleader }
    get member1() { return this.#member1 }
    get member2() { return this.#member2 }
    get member3() { return this.#member3 }

    toString() {
        return this.#team
    }
}

export default class TeamDatabase {
    static #instance
    static #sheetName = 'teams'

    static #cardDatabase

    static async getInstance(googleSheetsID) {
        if(!TeamDatabase.#instance) {
            if(!TeamDatabase.#sheetName) {
                TeamDatabase.#sheetName = 'teams'
            }
            if(!TeamDatabase.#cardDatabase) {
                TeamDatabase.#cardDatabase = await CardDatabase.getInstance(googleSheetsID)
            }

            TeamDatabase.#instance = new TeamDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(TeamDatabase.#sheetName)
            rows.forEach(row => new Team(
                row.c[0].v,
                row.c[1] && row.c[1].v ? TeamDatabase.#cardDatabase.getCard(row.c[1].v) : null,
                row.c[2] && row.c[2].v ? TeamDatabase.#cardDatabase.getCard(row.c[2].v) : null,
                row.c[3] && row.c[3].v ? TeamDatabase.#cardDatabase.getCard(row.c[3].v) : null,
                row.c[4] && row.c[4].v ? TeamDatabase.#cardDatabase.getCard(row.c[4].v) : null,
                row.c[5] && row.c[5].v ? TeamDatabase.#cardDatabase.getCard(row.c[5].v) : null,
            ))
        }
        return TeamDatabase.#instance
    }

    getAllTeams() {
        return [...Team.getTeams()]
    }

    getTeam(teamName) {
        const teams = this.getAllTeams()
        const team = teams.find(team => team.team === teamName)
        if(!team) throw new MissingReferenceError('Team', teamName)
        return team
    }
}