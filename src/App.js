import { HashRouter as Router, Route } from 'react-router-dom'
import SignUp from './authentication/SignUp'
import SignIn from './authentication/SignIn'
import Homepage from './homepage/Homepage'
import JoinLeaguePage from './league/JoinLeague'
import CreateLeaguePage from './league/CreateLeague'
import PasswordReset from './authentication/PasswordReset'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'

const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#f5938c',
        main: '#9a0c34',
        dark: '#840033',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Route path="/" exact component={SignIn} />
                <Route path="/signup" exact component={SignUp} />
                <Route path="/reset" exact component={PasswordReset} />
                <Route path="/home" exact component={Homepage} />
                <Route path="/league/join" exact component={JoinLeaguePage} />
                <Route path="/league/create" exact component={CreateLeaguePage} />
            </Router>
        </ThemeProvider>
    )
}
