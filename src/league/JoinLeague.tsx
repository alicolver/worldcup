import {
    Button,
    Container,
    CssBaseline,
    makeStyles,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core"
import { useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import Header from "../misc/Header"
import { fetchAuthEndpoint, getJWT, resolveEndpoint } from "../utils/Utils"
import React from "react"

export const useStylesLeague = makeStyles({
    container: {
        textAlign: "center",
    },
    gradient: {
        background:
            "linear-gradient(to bottom right, rgba(255, 122, 24, 0.2), rgba(175, 0, 45, 0.2), rgba(49, 145, 151, 0.2))",
    },
    heading: {
        paddingTop: "2rem",
        fontSize: "2rem",
        paddingBottom: "1rem",
    },
    first: {
        fontWeight: "bold",
    },
    link: {
        color: "#A30E36",
        textDecoration: "underline",
        cursor: "pointer"
    },
    inputText: {
        width: "100%",
        textAlign: "center",
    },
    button: {
        top: "15px",
        width: "100%",
        background:
            "linear-gradient(90deg, rgba(154,12,52,1) 0%, rgba(0,0,0,1) 100%)",
        color: "white",
        fontWeight: "bold",
    },
})

export default function JoinLeaguePage(): JSX.Element {
    const classes = useStylesLeague()
    const history = useHistory()
    const search = new URLSearchParams(useLocation().search)

    const [leagueName, setLeagueName] = useState({
        value: search.get("leagueId") || "",
        error: false,
    })

    const handleLeagueJoin = () => {
        fetchAuthEndpoint("league/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                leagueId: leagueName.value,
            }),
        }).then((res) => {
            if (res.status === 200) {
                history.push("/home")
            } else {
                setLeagueName({ ...leagueName, error: true })
            }
        })
    }

    return (
        <Container component="main">
            <CssBaseline />
            <Header />
            <Toolbar />
            <Container className={classes.container} maxWidth="xs">
                <Typography className={classes.heading}>Join a League</Typography>
                <Typography className={classes.first}>
                    Enter the league code provided to you by the league owner.
                </Typography>
                <Typography>
                    If you want to create a league you can create one by clicking the
                    link below:
                </Typography>
                <Typography
                    className={classes.link}
                    onClick={() => history.push("/league/create")}
                >
                    Create a League.
                </Typography>
                <TextField
                    id="outlined-helperText"
                    label="League Id"
                    helperText="Get your friend to send you the league id :)"
                    className={classes.inputText}
                    value={leagueName.value}
                    error={leagueName.error}
                    onChange={(input) =>
                        setLeagueName({ ...leagueName, value: input.target.value })
                    }
                    color="primary"
                />
                <Button
                    className={classes.button}
                    onClick={() => handleLeagueJoin()}
                >
                    Join League!
                </Button>
            </Container>
        </Container>
    )
}
