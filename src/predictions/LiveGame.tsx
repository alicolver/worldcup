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
    },
    endButton: {
        backgroundColor: '#1c4c87'
    }
})

interface IGameProps {
    callback: () => void
}

export default function LiveGame(props: IMatch & IGameProps) {
    const classes = useStyles()
    const [team1score, setTeam1Score] = useState({ score: '', error: false });
    const [teamTwoScore, setTeamTwoScore] = useState({ score: '', error: false });
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        const hasScore = props.match.team_one_goals && props.match.team_two_goals
        setIsEditing(!hasScore)
        if (hasScore) {
            setTeam1Score({
                error: false,
                score: props.match.team_one_goals
            })
            setTeamTwoScore({
                error: false,
                score: props.match.team_two_goals
            })
        }
    }, [props.hasPrediction, props.match.team_one_goals, props.match.team_two_goals])

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

        fetch(goTo('score'), {
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
                    alert('Error whilst updating scores, please try again')
                } else {
                    props.callback()
                    setIsEditing(false)
                }
            });
    }

    function endGame() {
        if (window.confirm('Are you sure the match is finished?')) {
            fetch(goTo('match/end'), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authenticate': getJWT()
                },
                body: JSON.stringify({
                    matchid: props.match.matchid
                })
            })
                .then(res => res.json())
                .then(result => {
                    if (!result[SUCCESS]) {
                        alert('Error whilst updating scores, please try again')
                    }
                });
        }
    }

    function renderCurrentScore() {
        return (
            <span className={classes.dash}>{props.prediction?.team_one_pred + '-' + props.prediction?.team_two_pred}</span>
        )
    }

    function renderEditScore() {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    type="number"
                    value={team1score.score}
                    onChange={(input) => setTeam1Score({ ...team1score, score: input.target.value })}
                    error={team1score.error} />
                <span className={classes.dash}>-</span>
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    type="number"
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    error={teamTwoScore.error} />
            </>
        )
    }

    function getPredictionRender() {
        return isEditing ? renderEditScore() : renderCurrentScore()
    }

    function getSetOrEditText(): string {
        return isEditing ? 'Submit Score' : 'Edit Score'
    }

    function getButton() {
        return (
        <Box className={classes.buttonBox}>
            <Button
                variant='contained'
                className={classes.button}
                onClick={() => handleClick()}
            >
                {getSetOrEditText()}
            </Button>
        </Box>  
    )}

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
            {getButton()}
            <Button
                variant='contained'
                className={classes.endButton}
                onClick={() => endGame()}>
                End Game
            </Button>
        </Card>
    )
}