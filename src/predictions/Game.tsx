import { Box, Card, makeStyles, OutlinedInput } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { SUCCESS } from "../utils/Constants";
import { dateToOrdinal, getJWT, goTo } from "../utils/Utils";
import { IMatch } from "./Predictions";
import Team from "./Team";

const useStyles = makeStyles({
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
        textAlign: 'center'
    }
})

interface IGameProps {
    callback: () => void,
    hasPrediction: boolean,
    team_one_pred?: string,
    team_two_pred?: string
}

export default function Game(props: IMatch & IGameProps) {
    const classes = useStyles()
    const [teamOneScore, setTeamOneScore] = useState({ score: '', error: false });
    const [teamTwoScore, setTeamTwoScore] = useState({ score: '', error: false });
    const [wasSentSuccess, setWasSentSuccess] = useState(false)

    useEffect(() => {
        if (props.hasPrediction && props.team_one_pred && props.team_two_pred) {
            setTeamOneScore({
                error: false,
                score: props.team_one_pred
            })
            setTeamTwoScore({
                error: false,
                score: props.team_two_pred
            })
        }
        setWasSentSuccess(false)
    }, [props.hasPrediction, props.team_one_pred, props.team_two_pred])

    function handlePrediction() {
        const scoreOne = parseInt(teamOneScore.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        var areBothScoresValid = validateScores(scoreOne, scoreTwo);

        if (!areBothScoresValid) {
            return
        }

        sendPrediction(scoreOne, scoreTwo);
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

    function sendPrediction(scoreOne: number, scoreTwo: number) {
        fetch(goTo('prediction'), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authenticate': getJWT()
            },
            body: JSON.stringify({
                team_one_pred: scoreOne,
                team_two_pred: scoreTwo,
                matchid: props.match.matchid,
                penalty_winners: null
            })
        })
            .then(res => res.json())
            .then(result => {
                if (!result[SUCCESS]) {
                    alert('Error whilst sending prediction, please try again');
                } else {
                    setWasSentSuccess(true)
                    setTimeout(function() {
                        setWasSentSuccess(false);
                    }, 500)
                }
            });
    }

    function renderUnpredictedScore() {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    style={wasSentSuccess ? 
                        {
                            border: '1px solid rgb(86, 180, 89)',
                            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(82, 168, 100, 0.6)'
                        } : {}}
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
                    style={wasSentSuccess ? 
                        {
                            border: '1px solid rgb(86, 180, 89)',
                            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(82, 168, 100, 0.6)'
                        } : {}}
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamTwoScore.error}
                     />
            </>
        )
    }

    function getDate(): string {
       return props.match.match_date.split('-')[2]
    }

    return (
        <Card className={classes.matchCard}>
            <Box className={classes.date}>
                {getDate() + dateToOrdinal(parseInt(getDate())) + ' ' + props.match.kick_off_time.substring(0, props.match.kick_off_time.length - 3)}
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
        </Card>
    )
}