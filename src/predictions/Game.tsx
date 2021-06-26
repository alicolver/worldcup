import { Box, Card, Checkbox, makeStyles, OutlinedInput } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { SUCCESS } from "../utils/Constants";
import { dateToOrdinal, getJWT, resolveEndpoint } from "../utils/Utils";
import { IMatch } from "./Predictions";
import Team from "./Team";

export const useStyles = makeStyles({
    match: {
        width: '80vw',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '3vw'
    },
    game: {
        width: '80vw',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '5vh',
        position: 'relative'
    },
    teaminput: {
        width: '50px',
        height: '50px',
        fontSize: '40px',
        textAlign: 'center',
        marginTop: '4vw'
    },
    fixedTeaminput: {
        width: '50px',
        height: '50px',
        fontSize: '40px',
        textAlign: 'center',
        marginTop: '1vw'
    },
    fixedTeaminputPreds: {
        width: '50px',
        height: '50px',
        fontSize: '40px',
        textAlign: 'center',
        marginTop: '7vw'
    },
    dash: {
        fontSize: '8vw',
        marginTop: '4vw'
    },
    date: {
        fontSize: '4vw',
        marginBottom: '0.5vh',
        maringTop: '0.5vh',
        verticalAlign: 'center',
        position: 'relative',
        color: 'grey'
    },
    matchCard: {
        marginBottom: '4vh',
        textAlign: 'center',
        borderRadius: '10px',
    },
    endGameButton: {
        marginBottom: '3vw'
    },
    yourScore: {
        marginTop: '3vw',
    },
    yourScoreText: {
        padding: '4px',
        borderRadius: '3px',
        color: 'white'
    },
    fixedGameTeamName: {
        marginTop: '7vw'
    },
    predictionHistoryTeamName: {
        marginTop: '3vw'
    },
    penaltyWinner: {
        fontSize: '16px',
    },
    resultText: {
        backgroundColor: '#505e73',
        padding: '4px',
        borderRadius: '3px',
        color: 'white'
    },
    allPredictionContainer: {
        marginTop: '25vw',
        marginBottom: '19vw',
        position: 'fixed'
    }
})

interface IGameProps {
    callback: () => void,
    hasPrediction: boolean,
    team_one_pred?: string,
    team_two_pred?: string,
    penalty_winners?: number | null,
}

export default function Game(props: IMatch & IGameProps) {
    const classes = useStyles()
    const defaultWasSent = { success: false, error: false }
    const [teamOneScore, setTeamOneScore] = useState({ score: '', error: false });
    const [teamTwoScore, setTeamTwoScore] = useState({ score: '', error: false });
    const [wasSent, setWasSent] = useState(defaultWasSent)
    const [penalityWinners, setPenaltyWinners] = useState(0)

    useEffect(() => {
        if (props.hasPrediction) {
            setTeamOneScore({
                error: false,
                score: props.team_one_pred!
            })
            setTeamTwoScore({
                error: false,
                score: props.team_two_pred!
            })
            if (props.match.is_knockout && props.penalty_winners != null) {
                setPenaltyWinners(props.penalty_winners!)
            }
        }
        setWasSent({ success: false, error: false })
    }, [props.hasPrediction, props.team_one_pred, props.team_two_pred, props.penalty_winners, props.match.is_knockout])

    function handlePrediction(pens: number) {
        if (pens === 0) {
            return
        }
        const scoreOne = parseInt(teamOneScore.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        var areBothScoresValid = validateScores(scoreOne, scoreTwo);

        if (!areBothScoresValid) {
            return
        }

        setTeamOneScore({ ...teamOneScore, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })

        sendPrediction(scoreOne, scoreTwo, pens);
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

    function sendPrediction(scoreOne: number, scoreTwo: number, penaltyWinnerPred: number) {
        fetch(resolveEndpoint('prediction'), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authenticate': getJWT()
            },
            body: JSON.stringify({
                team_one_pred: scoreOne,
                team_two_pred: scoreTwo,
                matchid: props.match.matchid,
                penalty_winners: penaltyWinnerPred,
            })
        })
            .then(res => res.json())
            .then(result => {
                if (!result[SUCCESS]) {
                    setWasSent({ success: false, error: true })
                } else {
                    setWasSent({ success: true, error: false })
                }
                setTimeout(function () {
                    setWasSent(defaultWasSent);
                }, 500)
            });
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
                    onBlur={() => handlePrediction(penalityWinners)}
                    error={teamOneScore.error} />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    type="number"
                    style={getResponseGlow()}
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    onBlur={() => handlePrediction(penalityWinners)}
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

    function changePenaltyWinners(winner: number) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                setPenaltyWinners(winner)
                handlePrediction(winner)
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
                props.match.is_knockout &&
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

        </Card>
    )
}