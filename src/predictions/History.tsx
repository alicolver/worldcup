import { Container, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import BottomNav from "../misc/BottomNav";
import Header from "../misc/Header";
import { goTo, getJWT } from "../utils/Utils";
import FixedGame from "./FixedGame";
import { IMatch } from "./Predictions";

const useStyles = makeStyles({
    upcomingGames: {
        fontSize: '8vw',
        marginTop: '19vw'
    }
})

export default function History() {
    const classes = useStyles()
    const [matches, setMatches] = useState<IMatch[]>([])
    const [invalidResponse, setInvalidResponse] = useState<boolean>(false)

    useEffect(() => {
        getMatches();
    }, [setMatches])

    if (invalidResponse) {
        return (
            <Redirect to={'/'} />
        )
    } else {
        return (
            <>
            <Header/>
            <Container>
                <Typography className={classes.upcomingGames}>Your History</Typography>
                {matches.map(element => {
                        return <FixedGame {...element}/>
                })}
            </Container>
            <BottomNav value={'/history'}/>
            </>
        )
    }

    function getMatches() {
        console.log('attempting fetch')
        fetch(goTo('match/ended'), {
            method: 'GET',
            headers: {
                'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setMatches(res.matches);
            } else {
                setInvalidResponse(true);
            }
        });
    }
}