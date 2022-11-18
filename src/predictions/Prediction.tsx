import { Box, Card, makeStyles, OutlinedInput, Typography } from "@material-ui/core"
import { useEffect, useState } from "react"
import { IMatchData, IPredictionData } from "../types/Types"
import { getJWT, resolveEndpoint } from "../utils/Utils"
import Team from "./Team"
import React from "react"
import { getImageUrl } from "../utils/s3"

interface IPredictionProps {
    matchData: IMatchData,
    predictionData: IPredictionData
}

export const useStyles = makeStyles({
    match: {
        width: "90%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
    },
    game: {
        width: "95%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        marginTop: "5vh",
        position: "relative"
    },
    teaminput: {
        width: "50px",
        height: "50px",
        fontSize: "40px",
        textAlign: "center",
        marginTop: "15px"
    },
    date: {
        fontSize: "8px",
        marginBottom: "2px",
        maringTop: "2px",
        verticalAlign: "center",
        position: "relative",
        color: "grey"
    },
    matchCard: {
        marginBottom: "15px",
        textAlign: "center",
        borderRadius: "10px",
    },
    penaltyWinner: {
        fontSize: "16px",
    },
    resultText: {
        backgroundColor: "#505e73",
        padding: "4px",
        borderRadius: "3px",
        color: "white"
    },
    allPredictionContainer: {
        marginTop: "15px",
        marginBottom: "10px",
        position: "fixed"
    }
})

const defaultWasSent = { success: false, error: false }

export default function PredictionCard(props: IPredictionProps): JSX.Element {
    const classes = useStyles()
    const [teamOneScore, setTeamOneScore] = useState({ 
        score: props.predictionData.homeScore == null ? "" : props.predictionData.homeScore.toString(), 
        error: false 
    })
    const [teamTwoScore, setTeamTwoScore] = useState({ 
        score: props.predictionData.awayScore == null ? "" : props.predictionData.awayScore.toString(), 
        error: false 
    })
    const [wasSent, setWasSent] = useState(defaultWasSent)

    useEffect(() => {
        setWasSent({ success: false, error: false })
    }, [setTeamOneScore, setTeamTwoScore])

    function sendPrediction(homeScore: number, awayScore: number) {
        console.log(props.matchData.matchId)
        fetch(resolveEndpoint("predictions/make"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getJWT()
            },
            body: JSON.stringify({
                homeScore: homeScore,
                awayScore: awayScore,
                matchId: props.matchData.matchId
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

    function getResponseGlow(): React.CSSProperties | undefined {
        return wasSent.success ?
            {
                border: "1px solid rgb(86, 180, 89)",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(82, 168, 100, 0.6)"
            } : wasSent.error ? {
                border: "1px solid rgb(199, 18, 49)",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(160, 30, 60, 0.6)"
            } : {}
    }

    function handlePrediction() {
        const scoreOne = parseInt(teamOneScore.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        const areBothScoresValid = validateScores(scoreOne, scoreTwo)

        if (!areBothScoresValid) return
        
        setTeamOneScore({ ...teamOneScore, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })

        sendPrediction(scoreOne, scoreTwo)
    }

    function validateScores(scoreOne: number, scoreTwo: number) {
        let areBothScoresValid = true
        if (isNaN(scoreOne)) {
            setTeamOneScore({ ...teamOneScore, error: true })
            areBothScoresValid = false
        }

        if (isNaN(scoreTwo)) {
            setTeamTwoScore({ ...teamTwoScore, error: true })
            areBothScoresValid = false
        }

        return areBothScoresValid
    }

    function renderUnpredictedScore() {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    style={getResponseGlow()}
                    id="outlined-basic"
                    value={teamOneScore.score}
                    onChange={(input) => setTeamOneScore({ ...teamOneScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamOneScore.error} />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    style={getResponseGlow()}
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamTwoScore.error}
                />
            </>
        )
    }

    
    return (
        <Card className={classes.matchCard}>
            <Box className={classes.date}>
                <Typography>{props.matchData.matchDate + " - " + props.matchData.matchTime}</Typography>
            </Box>
            <Box className={classes.match}>
                <Box>
                    <Team name={props.matchData.homeTeam} flag={getImageUrl(props.matchData.homeTeam)} />
                </Box>
                {renderUnpredictedScore()}
                <Box>
                    <Team name={props.matchData.awayTeam} flag={getImageUrl(props.matchData.awayTeam)} />
                </Box>
            </Box>
        </Card>
    )
}