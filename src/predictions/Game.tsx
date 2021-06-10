import { Box, Button, Card, makeStyles, OutlinedInput } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { SUCCESS } from "../utils/Constants";
import { getJWT, goTo } from "../utils/Utils";
import { IMatch } from "./Predictions";
import Team from "./Team";

const useStyles = makeStyles({
    match: {
        width: '80vw',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '3vh'
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
        width: '10vw',
        height: '8vw',
        fontSize: '4vw',
        marginTop: '6vw'
    },
    dash: {
        fontSize: '8vw',
        marginTop: '4vw'
    },
    date: {
        fontSize: '5vw',
        marginBottom: '1.5vh',
        verticalAlign: 'center',
        position: 'relative'
    },
    matchCard: {
        marginBottom: '4vh',
        textAlign: 'center'
    },
    buttonBox: {
        marginBottom: '1.5vh'
    },
    button: {
        backgroundColor: '#1caac9'
    }
})

interface IGameProps {
    callback: () => void
}

export default function Game(props: IMatch & IGameProps) {
    const classes = useStyles()
    const [team1score, setTeam1Score] = useState({ score: '', error: false });
    const [teamTwoScore, setTeamTwoScore] = useState({ score: '', error: false });
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        setIsEditing(!props.hasPrediction)
    }, [props.hasPrediction])

    function handleClick() {
        if (!isEditing) {
            setIsEditing(true)
            return
        }

        const scoreOne = parseInt(team1score.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        if (isNaN(scoreOne) || isNaN(scoreTwo)) {
            setTeam1Score({ ...team1score, error: true })
            setTeamTwoScore({ ...teamTwoScore, error: true })
            return
        }
        setTeam1Score({ ...team1score, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })

        fetch(goTo('prediction'), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authenticate': getJWT()
            },
            body: JSON.stringify({
                team_one_pred: team1score.score,
                team_two_pred: teamTwoScore.score,
                matchid: props.match.matchid,
                penalty_winners: null
            })
        })
            .then(res => res.json())
            .then(result => {
                if (!result[SUCCESS]) {
                    alert('Error whilst sending prediction, please try again')
                } else {
                    props.callback()
                    setIsEditing(false)
                }
            });
    }

    function renderPredictedScore() {
        return (
            <span className={classes.dash}>{props.prediction?.team_one_pred + '-' + props.prediction?.team_two_pred}</span>
        )
    }

    function renderUnpredictedScore() {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    type="number"
                    onChange={(input) => setTeam1Score({ ...team1score, score: input.target.value })}
                    error={team1score.error} />
                <span className={classes.dash}>-</span>
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    type="number"
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    error={teamTwoScore.error} />
            </>
        )
    }

    function getPredictionRender() {
        return isEditing ? renderUnpredictedScore() : renderPredictedScore()
    }

    function getSetOrEditText(): string {
        return isEditing ? 'Submit Prediction' : 'Edit Prediction'
    }

    return (
        <Card className={classes.matchCard}>
            <Box className={classes.match}>
                <Box>
                    <Team name={props.team_one.name} emoji={props.team_one.emoji} />
                </Box>
                {getPredictionRender()}
                <Box>
                    <Team name={props.team_two.name} emoji={props.team_two.emoji} />
                </Box>
            </Box>
            <Box className={classes.date}>
                {props.match.match_date + ' ' + props.match.kick_off_time}
            </Box>
            <Box className={classes.buttonBox}>
                <Button
                    variant='contained'
                    className={classes.button}
                    onClick={() => handleClick()}
                >
                    {getSetOrEditText()}
                </Button>
            </Box>
        </Card>
    )
}