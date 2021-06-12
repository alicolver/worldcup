import { Container, makeStyles, ThemeProvider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { fontTheme } from "../homepage/Homepage";
import BottomNav from "../misc/BottomNav";
import Header from "../misc/Header";
import { goTo, getJWT } from "../utils/Utils";
import FixedGame from "./FixedGame";
import { IMatch } from "./Predictions";

const useStyles = makeStyles({
    upcomingGames: {
        fontSize: '8vw',
        marginTop: '19vw'
    },
    historyContainer: {
        marginBottom: '10vw'
    }
})

export default function History() {
    const classes = useStyles()
    const [matches, setMatches] = useState<IMatch[]>([])
    const [inProgressMatches, setInProgressMatches] = useState<IMatch[]>([])
    const [invalidResponse, setInvalidResponse] = useState<boolean>(false)

    useEffect(() => {
        getMatches();
    }, [])

    if (invalidResponse) {
        return (
            <Redirect to={'/'} />
        )
    } else {
        return (
            <ThemeProvider theme={fontTheme}>
            <Header/>
            <Container className={classes.historyContainer}>
                <Typography className={classes.upcomingGames}>Your History</Typography>
                { matches.map(element => { return (<FixedGame {...element}/>)})}
                { inProgressMatches.map(element => { return (<FixedGame {...element}/>)})}
            </Container>
            <BottomNav value={'/history'}/>
            </ThemeProvider>
        )
    }

    function getMatches() {
        fetch(goTo('match/ended'), {
            method: 'GET',
            headers: {
                'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setMatches(res.matches)
            } else {
                setInvalidResponse(true);
            }
        });
        fetch(goTo('match/in-progress'), {
            method: 'GET',
            headers: {
                'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setInProgressMatches(res.matches)
            } else {
                setInvalidResponse(true);
            }
        });
    }
}