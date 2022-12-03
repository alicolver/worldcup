import { PROXY } from "./Constants"
import jwtDecode from "jwt-decode"
import passwordValidator from "password-validator"
import { IMatchData, IScore, IWasSent } from "../types/types"
import { defaultWasSent, HomeOrAway } from "../predictions/Prediction"

interface IDecodedUser {
    userid: number,
    sub: string,
    isAdmin?: boolean,
}

export function isTokenValid(): Promise<boolean> {
    const jwt = getJWT()
    const refresh = getRefreshToken()
    return fetch(PROXY + "auth/check", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": jwt,
            "Refresh": refresh,
        },
        mode: "cors"
    }).then(res => {
        if (res.status === 200) {
            setAuthToken(res.headers.get(RESPONSE_AUTH_HEADER))
            return true
        }
        return false
    })
}

export function isAdminCheck(): boolean {
    const jwt = getJWT()
    try {
        const decoded = jwtDecode<IDecodedUser>(jwt)
        if (decoded.isAdmin) {
            return decoded.isAdmin
        }
    } catch {
        // intentionally blank
    }
    return false
}

export function getUserid(): string {
    const jwt = getJWT()
    try {
        const decoded = jwtDecode<IDecodedUser>(jwt)
        return decoded.sub
    } catch {
        // intentionally blank
    }
    return ""
}


export function validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

export interface PasswordValidation {
    validLength: boolean
    validLowercase: boolean
    validDigits: boolean
}

const passwordSchema = new passwordValidator().is().min(6).has().lowercase().has().digits()

export function validatePassword(password: string): PasswordValidation {
    return convertPasswordValidation(passwordSchema.validate(password, {
        details: true
    }) as any[])
}

function validationContainsField(result: any[], field: string): boolean {
    return result.find(x => x?.validation === field) !== undefined
}

function convertPasswordValidation(result: any[]): PasswordValidation {
    return {
        validLength: !validationContainsField(result, "min"),
        validLowercase: !validationContainsField(result, "lowercase"),
        validDigits: !validationContainsField(result, "digits")
    }

}

export function dateToOrdinal(day: number): string {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
    case 1: return "st"
    case 2: return "nd"
    case 3: return "rd"
    default: return "th"
    }
}

export function calculateScore(
    predictedHomeGoals: number | null,
    predictedAwayGoals: number | null,
    actualHomeGoals: number,
    actualAwayGoals: number
): number {
    if (predictedHomeGoals === null || predictedAwayGoals === null) {
        return 0
    }

    if (predictedHomeGoals === actualHomeGoals && predictedAwayGoals === actualAwayGoals) {
        return 5
    }

    if (actualHomeGoals > actualAwayGoals && predictedHomeGoals > predictedAwayGoals) {
        return 2
    }

    if (actualHomeGoals < actualAwayGoals && predictedHomeGoals < predictedAwayGoals) {
        return 2
    }

    if (actualHomeGoals === actualAwayGoals && predictedHomeGoals === predictedAwayGoals) {
        return 2
    }

    return 0
}

export function calculateScoreKnockouts(
    predictedHomeGoals: number | null,
    predictedAwayGoals: number | null,
    predictedTeamToGoThrough: HomeOrAway | null,
    actualHomeGoals: number,
    actualAwayGoals: number,
    actualTeamToGoThrough: HomeOrAway | null
): number {
    if (predictedHomeGoals === null || predictedAwayGoals === null || predictedTeamToGoThrough === null) {
        return 0
    }

    console.log(`predictedHomeGoalds: ${predictedHomeGoals}`)
    console.log(`predictedAwayGoalds: ${predictedAwayGoals}`)
    console.log(`actualdHomeGoalds: ${actualHomeGoals}`)
    console.log(`actualAwayGoalds: ${actualAwayGoals}`)

    const bonus = predictedTeamToGoThrough === actualTeamToGoThrough ? 1 : 0
    let score = 0

    if (predictedHomeGoals === actualHomeGoals && predictedAwayGoals === actualAwayGoals) {
        score = 5
    } else if (actualHomeGoals > actualAwayGoals && predictedHomeGoals > predictedAwayGoals) {
        score = 2
    } else if (actualHomeGoals < actualAwayGoals && predictedHomeGoals < predictedAwayGoals) {
        score = 2
    } else if (actualHomeGoals === actualAwayGoals && predictedHomeGoals === predictedAwayGoals) {
        score = 2
    }

    const total = score + bonus
    return total
}

export function gotScoreCorrect(pred_one_goals: string | undefined, pred_two_goals: string | undefined, act_one_goals: number, act_two_goals: number): boolean {
    if (pred_one_goals === undefined || pred_two_goals === undefined) {
        return false
    }

    const pred_one = parseInt(pred_one_goals)
    const pred_two = parseInt(pred_two_goals)

    return pred_one === act_one_goals && pred_two === act_two_goals
}

export function gotResultCorrect(pred_one_goals: string | undefined, pred_two_goals: string | undefined, act_one_goals: number, act_two_goals: number): boolean {
    if (pred_one_goals === undefined || pred_two_goals === undefined) {
        return false
    }

    const pred_one = parseInt(pred_one_goals)
    const pred_two = parseInt(pred_two_goals)

    return ((act_one_goals > act_two_goals && pred_one > pred_two) || (act_one_goals < act_two_goals && pred_one < pred_two) || (act_one_goals === act_two_goals && pred_one === pred_two))
}

export function resolveEndpoint(endpoint: string): string {
    return PROXY + endpoint
}

export function fetchAuthEndpoint(endpoint: string, config: RequestInit): Promise<Response> {
    return fetch(resolveEndpoint(endpoint), {
        ...config,
        headers: {
            ...config.headers,
            Authorization: getJWT(),
            Refresh: getRefreshToken(),
        }
    }).then(res => {
        if (res.status === 200) {
            setAuthToken(res.headers.get(RESPONSE_AUTH_HEADER))
        }
        return res
    })
}

export const RESPONSE_AUTH_HEADER = "x-amzn-remapped-authorization"
export const RESPONSE_REFRESH_HEADER = "refresh"

// expires - number hours until cookie expires
export function setCookie(name: string, value: string, expires: number): void {
    const now = new Date()
    now.setTime(now.getTime() + (1000 * 60 * 60 * expires))
    document.cookie = `${name}=${value};expires=${now.toUTCString()}`
}

export function setAuthToken(token: string | null): void {
    if (token) {
        setCookie("authtoken", token, 2 * 24)
    }
}

export function setRefreshToken(token: string | null): void {
    if (token) {
        setCookie("refreshtoken", token, 35 * 24)
    }
}

const extractToken = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        const jwt = parts.pop()?.split(";").shift()
        return (typeof jwt === "undefined") ? "" : jwt
    }
    return ""
}

export function getJWT(): string {
    return extractToken("authtoken")
}

export function getRefreshToken(): string {
    return extractToken("refreshtoken")
}

export function deleteJWT(): void {
    document.cookie = "authtoken="
}

export function deleteRefreshToken(): void {
    document.cookie = "refreshtoken="
}

export const capitalizeFirstLetter = (input: string): string => input.charAt(0).toUpperCase() + input.slice(1)

export const parseDate = (date: string): string => {
    const humanReadableDate = new Date(date).toDateString().split(" ")
    const day = humanReadableDate[0]
    const calendarDate = humanReadableDate[1]
    const month = humanReadableDate[2]
    return `${day} ${calendarDate} ${month}`
}

export function parseMatchKickOff(matchDay: string, matchTime: string): Date {
    // matchDay fomrmat is YYYY-MM-DD
    // matchTime fromat is HH:MM
    return new Date(Date.parse(matchDay + "T" + matchTime + ":00"))
}

export function hasMatchKickedOff(matchDay: string, matchTime: string, date: Date): boolean {
    return date > parseMatchKickOff(matchDay, matchTime)
}

export function getResponseGlow(wasSent: IWasSent): React.CSSProperties | undefined {
    return wasSent.success ?
        {
            border: "1px solid rgb(86, 180, 89)",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(82, 168, 100, 0.6)"
        } : wasSent.error ? {
            border: "1px solid rgb(199, 18, 49)",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(160, 30, 60, 0.6)"
        } : {}
}

export function validateScores(
    scoreOne: number, 
    scoreTwo: number, 
    teamOneScore: IScore, 
    teamTwoScore: IScore,
    setTeamOneScore: React.Dispatch<React.SetStateAction<IScore>>,
    setTeamTwoScore: React.Dispatch<React.SetStateAction<IScore>>
): boolean {
    let areBothScoresValid = true
    if (isNaN(scoreOne) || scoreOne < 0) {
        setTeamOneScore({ ...teamOneScore, error: true })
        areBothScoresValid = false
    }

    if (isNaN(scoreTwo) || scoreTwo < 0) {
        setTeamTwoScore({ ...teamTwoScore, error: true })
        areBothScoresValid = false
    }

    return areBothScoresValid
}

export function sendScore(
    homeScore: number, 
    awayScore: number, 
    teamToProgress: HomeOrAway | null,
    matchId: string, 
    endpoint: string,
    setWasSent: React.Dispatch<React.SetStateAction<IWasSent>>
): void {
    fetchAuthEndpoint(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: teamToProgress === null ? JSON.stringify({
            homeScore: homeScore,
            awayScore: awayScore,
            matchId: matchId
        }) : JSON.stringify({
            homeScore: homeScore,
            awayScore: awayScore,
            toGoThrough: HomeOrAway[teamToProgress],
            matchId: matchId
        })
    }).then(res => {
        if (!res.ok) {
            setWasSent({ success: false, error: true })
            return
        }
        setWasSent({ success: true, error: false })
        return res.json().then(result => {
            if (result !== null) {
                setTimeout(function () {
                    setWasSent(defaultWasSent)
                }, 500)
            }
        })
    })
}

export function isKnockout(stage: string): boolean {
    return stage !== "GROUP"
}

export function isDraw(match: IMatchData): boolean {
    return match.result?.home === match.result?.away
}