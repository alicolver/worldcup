import { defaultWasSent, HomeOrAway } from "../predictions/Prediction"
import { IScore, IWasSent } from "../types/types"
import { fetchAuthEndpoint } from "./Auth"

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

    const bonus = predictedTeamToGoThrough === actualTeamToGoThrough ? 1 : 0

    if (predictedHomeGoals === actualHomeGoals && predictedAwayGoals === actualAwayGoals) {
        return (5 + bonus)
    } 
    
    if (actualHomeGoals > actualAwayGoals && predictedHomeGoals > predictedAwayGoals) {
        return (2 + bonus)
    }
    
    if (actualHomeGoals < actualAwayGoals && predictedHomeGoals < predictedAwayGoals) {
        return (2 + bonus)
    }
    
    if (actualHomeGoals === actualAwayGoals && predictedHomeGoals === predictedAwayGoals) {
        return (2 + bonus)
    }

    return bonus
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
