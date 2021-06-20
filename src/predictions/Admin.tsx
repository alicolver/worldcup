import { Container, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import BottomNav from "../misc/BottomNav";
import Header from "../misc/Header";
import { getJWT, resolveEndpoint, isAdminCheck } from "../utils/Utils";
import LiveGame from "./LiveGame";
import { IMatch } from "./Predictions";

const useStyles = makeStyles({
    liveGames: {
        fontSize: '8vw',
        marginTop: '19vw',
        marginBottom: '5vw'
    },
    liveGamesText: {
        fontSize: '8vw',
        textAlign: 'center'
    }
})

export default function AdminPage() {
    const classes = useStyles()
    const [matches, setMatches] = useState<IMatch[]>([])
    const [invalidResponse, setInvalidResponse] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(true)

    useEffect(() => {
        getMatches()
        checkAdmin()
    }, [setMatches, setIsAdmin])

    function checkAdmin() {
        fetch(resolveEndpoint('is-admin'), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authenticate": getJWT()
            }
        })
            .then(res => res.json())
            .then(result => {
                if (!result.success) {
                    setIsAdmin(false)
                }
            });
    }

    function getMatches() {
        fetch(resolveEndpoint('match/in-progress'), {
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

    if (invalidResponse) {
        return (
            <Redirect to={'/'} />
        )
    }

    if (!isAdmin) {
        return (
            <Redirect to={'/home'} />
        )
    }

    return (
        <>
            <Header />
            <Container className={classes.liveGames}>
                <Typography className={classes.liveGamesText}>Live Games</Typography>
                {matches.map(element => {
                    return <LiveGame {...element} />
                })}
            </Container>
            <Container>
                <Typography className={classes.liveGamesText}>Upcoming Games</Typography>
            </Container>
            <BottomNav value={'/admin'} admin={isAdminCheck()} />
        </>
    )
}
