import { Container, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import BottomNav from "../misc/BottomNav";
import Header from "../misc/Header";
import { getJWT, goTo } from "../utils/Utils";
import LiveGame from "./LiveGame";
import { IMatch } from "./Predictions";

const useStyles = makeStyles({
    liveGames: {
        fontSize: '8vw',
        position: 'absolute',
        top: '19vw',
        width: '90%',
        left: '5%'
    }
})

export default function AdminPage() {
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
                <Typography className={classes.liveGames}>Live Games</Typography>
                {matches.map(element => {
                        return <LiveGame {...element} isFixed={false} callback={getMatches} />
                })} 
                </Container>
            <BottomNav value={'/admin'}/>
            </>
        )
    }

    function getMatches() {
        fetch(goTo('match/in-progress'), {
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
