import { Box, Button, Card, makeStyles, OutlinedInput } from "@material-ui/core";
import React, { useState } from "react";
import { getJWT, goTo } from "../utils/Utils";
import { IMatchDetails, ITeam } from "./Predictions";
import Team from "./Team";

interface IGameProps {
    team1: ITeam,
    team2: ITeam,
    match: IMatchDetails
}

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

export default function Game(props: IGameProps) {
    const classes = useStyles()
    const [team1score, setTeam1Score] = useState({ score: '', error: false});
    const [teamTwoScore, setTeamTwoScore] = useState({ score: '', error: false});

    function handleClick() {
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
              if (result["succes"] === true) {
                alert('successfully stored prediction')
              } else {
                alert('Error whilst sending prediction, please try again')
              }
        });
    }

    return(
        <Card className={classes.matchCard}>
           <Box className={classes.match}>
                <Box>
                    <Team name={props.team1.name} emoji={props.team1.emoji}/>
                </Box>
                <OutlinedInput 
                className={classes.teaminput} 
                id="outlined-basic" 
                label=""
                onChange={(input) => setTeam1Score({ ...team1score, score: input.target.value})}
                error={team1score.error}/>
                <span className={classes.dash}>-</span>
                <OutlinedInput 
                className={classes.teaminput} 
                id="outlined-basic" 
                label=""
                onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value})}
                error={teamTwoScore.error}/>
                <Box>
                    <Team name={props.team2.name} emoji={props.team2.emoji}/>
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
                    Submit Prediction
                </Button>
            </Box>
            </Card>
    )
}