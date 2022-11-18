import { HashRouter as Router, Route } from "react-router-dom"
import SignUp from "./authentication/SignUp"
import Homepage from "./homepage/Homepage"
import JoinLeaguePage from "./league/JoinLeague"
import CreateLeaguePage from "./league/CreateLeague"
import PasswordReset from "./authentication/PasswordReset"
import { createMuiTheme, ThemeProvider } from "@material-ui/core"
import { AuthRedirect } from "./authentication/Redirect"
import SignIn from "./authentication/SignIn"
import React from "react"
import { Standings } from "./standings/standings"


const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#f5938c",
            main: "#9a0c34",
            dark: "#840033",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff7961",
            main: "#f44336",
            dark: "#ba000d",
            contrastText: "#000",
        },
    },
    typography: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    },
})

export default function App(): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Route path="/" exact>
                    <AuthRedirect expectAuthResult={true} redirectTo="/home">
                        <SignIn />
                    </AuthRedirect>
                </Route>
                <Route path="/signup" exact component={SignUp} />
                <Route path="/reset" exact component={PasswordReset} />
                <Route path="/home" exact>
                    <AuthRedirect expectAuthResult={false} redirectTo="/">
                        <Homepage />
                    </AuthRedirect>
                </Route>
                <Route path="/league/join" exact>
                    <AuthRedirect expectAuthResult={false} redirectTo="/">
                        <JoinLeaguePage />
                    </AuthRedirect>
                </Route>
                <Route path="/league/create" exact>
                    <AuthRedirect expectAuthResult={false} redirectTo="/">
                        <CreateLeaguePage />
                    </AuthRedirect>
                </Route>
                <Route path="/standings" exact>
                    <AuthRedirect expectAuthResult={false} redirectTo="/">
                        <Standings />
                    </AuthRedirect>
                </Route>
            </Router>
        </ThemeProvider>
    )
}
