import { Box, Button, Card, Checkbox, OutlinedInput } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { SUCCESS } from "../utils/Constants";
import { dateToOrdinal, getJWT, resolveEndpoint } from "../utils/Utils";
import { useStyles } from "./Game";
import { IMatch } from "./Predictions";
import Team from "./Team";

export default function LiveGame(props: IMatch) {
    const classes = useStyles()
    const defaultWasSent = { success: false, error: false }
    const [teamOneScore, setTeamOneScore] = useState({ score: '', error: false });
    const [teamTwoScore, setTeamTwoScore] = useState({ score: '', error: false });
    const [wasSent, setWasSent] = useState(defaultWasSent)
    const [penalityWinners, setPenaltyWinners] = useState(0)

    useEffect(() => {
        setTeamOneScore({
            error: false,
            score: props.match.team_one_goals
        })
        setTeamTwoScore({
            error: false,
            score: props.match.team_two_goals
        })
        setWasSent({ success: false, error: false })
    }, [props.match.team_one_goals, props.match.team_two_goals])

    function handlePrediction() {
        const scoreOne = parseInt(teamOneScore.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        var areBothScoresValid = validateScores(scoreOne, scoreTwo);

        if (!areBothScoresValid) {
            return
        }

        setTeamOneScore({ ...teamOneScore, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })

        sendScore(scoreOne, scoreTwo);
    }

    function sendScore(scoreOne: number, scoreTwo: number) {
        fetch(resolveEndpoint('score'), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authenticate': getJWT()
            },
            body: JSON.stringify({
                team_one_goals: scoreOne,
                team_two_goals: scoreTwo,
                matchid: props.match.matchid
            })
        })
            .then(res => res.json())
            .then(result => {
                if (!result[SUCCESS]) {
                    alert('Error whilst updating scores, please try again');
                } else {
                    setWasSent({ ...wasSent, success: true })
                }
            });
    }

    function endGame() {
        if (props.match.is_knockout && isDraw() && penalityWinners === 0) {
            alert('You need to select a penalty winner')
            return
        }

        if (window.confirm('Are you sure the match is finished?')) {
            let body: {
                matchid: number
                penalty_winners?: number
            } = {
                matchid: props.match.matchid,
            }
            if (props.match.is_knockout && isDraw()) {
                body.penalty_winners = penalityWinners
            }
            fetch(resolveEndpoint('match/end'), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authenticate': getJWT()
                },
                body: JSON.stringify(body)
            })
                .then(res => res.json())
                .then(result => {
                    if (!result[SUCCESS]) {
                        alert('Error whilst updating scores, please try again')
                    } else {
                        window.location.reload()
                    }
                });
        }
    }

    function validateScores(scoreOne: number, scoreTwo: number) {
        var areBothScoresValid = true;
        if (isNaN(scoreOne)) {
            setTeamOneScore({ ...teamOneScore, error: true });
            areBothScoresValid = false;
        }

        if (isNaN(scoreTwo)) {
            setTeamTwoScore({ ...teamTwoScore, error: true });
            areBothScoresValid = false;
        }

        return areBothScoresValid;
    }

    function renderUnpredictedScore() {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    style={getResponseGlow()}
                    id="outlined-basic"
                    type="number"
                    value={teamOneScore.score}
                    onChange={(input) => setTeamOneScore({ ...teamOneScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamOneScore.error} />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    type="number"
                    style={getResponseGlow()}
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamTwoScore.error}
                />
            </>
        )
    }

    function getResponseGlow(): React.CSSProperties | undefined {
        return wasSent.success ?
            {
                border: '1px solid rgb(86, 180, 89)',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(82, 168, 100, 0.6)'
            } : wasSent.error ? {
                border: '1px solid rgb(199, 18, 49)',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(160, 30, 60, 0.6)'
            } : {};
    }

    function isDraw(): boolean {
        return parseInt(teamOneScore.score) === parseInt(teamTwoScore.score)
    }

    function changePenaltyWinners(winner: number) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                setPenaltyWinners(winner)
            }
        }
    }

    return (
        <Card className={classes.matchCard}>
            <Box className={classes.date}>
                {props.match.match_date + dateToOrdinal(parseInt(props.match.match_date)) + " - " + props.match.kick_off_time}
            </Box>
            <Box className={classes.match}>
                <Box>
                    <Team name={props.team_one.name} emoji={props.team_one.emoji} />
                </Box>
                {renderUnpredictedScore()}
                <Box>
                    <Team name={props.team_two.name} emoji={props.team_two.emoji} />
                </Box>
            </Box>
            {
                (props.match.is_knockout && isDraw()) &&

                <Box className={classes.penaltyWinner}>
                    <Checkbox
                        checked={penalityWinners === 1}
                        onChange={changePenaltyWinners(1)}
                    />
                    Penalty Winners
                    <Checkbox
                        checked={penalityWinners === 2}
                        onChange={changePenaltyWinners(2)}
                    />
                </Box>
            }
            <Button
                variant='contained'
                className={classes.endGameButton}
                onClick={() => endGame()}>
                End
            </Button>
        </Card>
    )

}