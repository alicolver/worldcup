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
    const [isAdmin, setIsAdmin] = useState<boolean>(true)

    useEffect(() => {
        getMatches()
        checkAdmin()
    }, [setMatches, setIsAdmin])

    function checkAdmin() {
        fetch(goTo('is-admin'), {
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
                <Typography>Live Games</Typography>
                {matches.map(element => {
                    return <LiveGame {...element} />
                })}
            </Container>
            <BottomNav value={'/admin'} />
        </>
    )
}
