import React, { useEffect, useState } from "react"
import { Redirect, Route, useLocation } from "react-router-dom"
import Button from "@material-ui/core/Button"
import CssBaseline from "@material-ui/core/CssBaseline"
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import logo from "../img/logo.png"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import { resolveEndpoint } from "../utils/Utils"
import { Copyright } from "./Copyright"
import { IUserTextInput } from "../types/types"
import CircularProgress from "@material-ui/core/CircularProgress"
import { History } from "history"
import { isTokenValid, setAuthToken, RESPONSE_AUTH_HEADER, setRefreshToken, RESPONSE_REFRESH_HEADER } from "../utils/Auth"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        height: "3rem"
    },
    logo: {
        maxHeight: "30vh"
    }
}))

const generateSignUpLink = (params: URLSearchParams) => {
    return `/signup?${params.toString()}`
}

const generateHomeLink = (params: URLSearchParams) => {
    const redirect = params.get("redirect")
    params.delete("redirect")
    return `${redirect || "/home"}?${params.toString()}`
}

export default function SignIn(): JSX.Element {
    const classes = useStyles()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState<IUserTextInput>({ value: "", error: false })
    const [password, setPassword] = useState<IUserTextInput>({ value: "", error: false })
    const [validToken, setValidToken] = useState<boolean>(false)
    const search = new URLSearchParams(useLocation().search)
    const signUpLink = generateSignUpLink(search)

    useEffect(() => {
        isTokenValid().then(valid => {
            if (valid === true) {
                setValidToken(true)
            }
        })
    }, [setValidToken])

    const handleLogin = (history: History) => () => {
        setIsLoading(true)
        fetch(resolveEndpoint("auth/login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        }).then(res => {
            setIsLoading(false)
            if (res.status === 307) {
                history.push({
                    pathname: "/reset",
                    state: { email: email },
                })
                return
            }

            if (!res.ok) {
                setPassword({ ...password, error: true })
                setEmail({ ...email, error: true })
                return
            }
            setValidToken(true)
            setAuthToken(res.headers.get(RESPONSE_AUTH_HEADER))
            setRefreshToken(res.headers.get(RESPONSE_REFRESH_HEADER))
        })
    }


    if (validToken) {
        return (
            <Redirect to={generateHomeLink(search)} />
        )
    } else {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <img className={classes.logo} src={logo} alt={"qatar 2022 logo"} />
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <div className={classes.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            type="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(input) => setEmail({ ...email, value: input.target.value })}
                            error={email.error}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(input) => setPassword({ ...password, value: input.target.value })}
                            error={password.error}
                        />
                        <Route render={({ history }: { history: History }) => (
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleLogin(history)}
                            >
                                {isLoading ? (
                                    <CircularProgress style={{ padding: "5px" }} color="inherit" />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        )} />
                        <Grid container>
                            <Grid item>
                                <Route render={({ history }: { history: History }) => (
                                    <Link onClick={() => { history.replace(signUpLink) }} variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                )} />
                            </Grid>
                            <Grid item>
                                <Route render={({ history }: { history: History }) => (
                                    <Link onClick={() => { history.push("/reset") }} variant="body2">
                                        {"Forgotten your password? Reset it here"}
                                    </Link>
                                )} />
                            </Grid>
                        </Grid>
                    </div>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        )
    }
}