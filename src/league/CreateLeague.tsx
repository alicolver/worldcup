import { Container, Typography, Button, Toolbar, TextField } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import Header from "../misc/Header"
import { IUserTextInput } from "../types/types"
import { fetchAuthEndpoint } from "../utils/Utils"
import { useStylesLeague } from "./JoinLeague"
import React from "react"

export default function CreateLeaguePage(): JSX.Element {
    const classes = useStylesLeague()
    const history = useHistory()
    const [leagueName, setLeagueName] = useState<IUserTextInput>({ value: "", error: false })
    const [success, setSuccess] = useState<boolean>(false)
    const [isWaiting, setIsWaiting] = useState<boolean>(false)

    useEffect(() => {
        // intentionally blank
    }, [setSuccess, setIsWaiting])

    const handleLeagueCreate = () => {
        setIsWaiting(true)
        fetchAuthEndpoint("league/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                leagueName: leagueName.value
            })
        }).then(res => {
            setIsWaiting(false)
            if (res.status !== 200) {
                setLeagueName({ ...leagueName, error: true })
                alert("League Name already in use, try again")
            } else {
                history.push("/home")
                setSuccess(true)
                setTimeout(function () { setSuccess(false) }, 2000)
            }
        })
    }

    return (
        <>
            <Header />
            <Toolbar />
            <Container className={classes.container} maxWidth='xs'>
                <Typography className={classes.heading}>Create a League</Typography>
                <Typography className={classes.first}>Enter your league name to create a private league for you and friends.</Typography>
                <TextField
                    id="outlined-helperText"
                    label="League Name"
                    className={classes.inputText}
                    onChange={(input) => setLeagueName({ ...leagueName, value: input.target.value })}
                    error={leagueName.error}
                    style={
                        success ? {
                            boxShadow: "0 0 5px rgba(20, 219, 96, 1)",
                            border: "1px solid rgba(20, 219, 96, 1)"
                        } : {}
                    }
                />
                <Button className={classes.button} onClick={() => handleLeagueCreate()}>
                    {success ? "SUCCESS" : isWaiting ? "creating..." : "Create League!"}
                </Button>
            </Container>
        </>
    )
}