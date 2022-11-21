import { Box, Button, Card, OutlinedInput, Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { IMatchData } from "../types/types"
import { getImageUrl } from "../utils/s3"
import { parseDate, getResponseGlow, validateScores, sendScore, resolveEndpoint, getJWT } from "../utils/Utils"
import { defaultWasSent, matchCardUseStyles } from "./Prediction"
import Team from "./Team"

interface IPredictionProps {
    matchData: IMatchData
}

export default function Game(props: IPredictionProps): JSX.Element {
    const classes = matchCardUseStyles()
    const [teamOneScore, setTeamOneScore] = useState({
        score: props.matchData.result == null ? "" : props.matchData.result.home.toString(),
        error: false
    })
    const [teamTwoScore, setTeamTwoScore] = useState({
        score: props.matchData.result == null ? "" : props.matchData.result.away.toString(),
        error: false
    })
    const [wasSent, setWasSent] = useState(defaultWasSent)

    useEffect(() => {
        setWasSent({ success: false, error: false })
    }, [setTeamOneScore, setTeamTwoScore])

    function handleScore(): void {
        const scoreOne = parseInt(teamOneScore.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        const areBothScoresValid = validateScores(
            scoreOne, 
            scoreTwo,
            teamOneScore,
            teamTwoScore,
            setTeamOneScore,
            setTeamTwoScore
        )

        if (!areBothScoresValid) return

        setTeamOneScore({ ...teamOneScore, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })

        sendScore(scoreOne, scoreTwo, props.matchData.matchId, "match/update-score", setWasSent)
    }

    function renderScore(): JSX.Element {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    style={getResponseGlow(wasSent)}
                    id="outlined-basic"
                    value={teamOneScore.score}
                    onChange={(input) => setTeamOneScore({ ...teamOneScore, score: input.target.value })}
                    onBlur={() => handleScore()}
                    error={teamOneScore.error}
                />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    style={getResponseGlow(wasSent)}
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    onBlur={() => handleScore()}
                    error={teamTwoScore.error}
                />
            </>
        )
    }

    function handleEndGame(): void {
        const shouldContinue: boolean = confirm("Ending game: " + props.matchData.homeTeam + " " 
            + teamOneScore.score + ":" + teamTwoScore.score + " " + props.matchData.awayTeam
        )
        if (!shouldContinue) return
        fetch(resolveEndpoint("match/end"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getJWT()
            },
            body: JSON.stringify({
                matchId: props.matchData.matchId,
                homeScore: parseInt(teamOneScore.score),
                awayScore: parseInt(teamTwoScore.score)
            })
        }).then(res => {
            if (!res.ok) {
                alert("uhoh, error ending game")
            }
            alert("Successfully ended match")
        })
    }

    return (
        <div>
            <Card className={classes.matchCard}>
                <Box className={classes.date}>
                    <Typography>{parseDate(props.matchData.matchDate) + " - " + props.matchData.matchTime}</Typography>
                </Box>
                <Box className={classes.match}>
                    <Box>
                        <Team name={props.matchData.homeTeam} flag={getImageUrl(props.matchData.homeTeam)} />
                    </Box>
                    {renderScore()}
                    <Box>
                        <Team name={props.matchData.awayTeam} flag={getImageUrl(props.matchData.awayTeam)} />
                    </Box>
                </Box>
                <Button className={classes.endMatch} onClick={() => handleEndGame()}>
                    <Typography>End Match</Typography>
                </Button>
            </Card>
        </div>

    )
}