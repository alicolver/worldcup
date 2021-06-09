import { Box, Card, makeStyles, OutlinedInput } from "@material-ui/core";
import React from "react";
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
        verticalAlign: 'center',
        position: 'relative'
    }
})

export default function Game(props: IGameProps) {
    const classes = useStyles()


    return(
           <Card className={classes.match}>
                <Box>
                    <Team name={props.team1.name} emoji={props.team1.emoji}/>
                </Box>
                <OutlinedInput className={classes.teaminput} id="outlined-basic" label=""/>
                <span className={classes.dash}>-</span>
                <OutlinedInput className={classes.teaminput} id="outlined-basic" label=""/>
                <Box>
                    <Team name={props.team2.name} emoji={props.team2.emoji}/>
                </Box>
            
            </Card>
    )
}