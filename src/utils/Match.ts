import { IMatchData } from "../types/types"

export function isKnockout(stage: string): boolean {
    return stage !== "GROUP"
}

export function isDraw(match: IMatchData): boolean {
    return match.result?.home === match.result?.away
}

export function parseMatchKickOff(matchDay: string, matchTime: string): Date {
    // matchDay fomrmat is YYYY-MM-DD
    // matchTime fromat is HH:MM
    return new Date(Date.parse(matchDay + "T" + matchTime + ":00"))
}

export function hasMatchKickedOff(matchDay: string, matchTime: string, date: Date): boolean {
    return date > parseMatchKickOff(matchDay, matchTime)
}
