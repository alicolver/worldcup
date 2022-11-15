import { HashRouter as Router, Route } from 'react-router-dom'
import SignUp from './authentication/SignUp'
import SignIn from './authentication/SignIn'
import Homepage from './homepage/Homepage'
import JoinLeaguePage from './league/JoinLeague'
import CreateLeaguePage from './league/CreateLeague'
import PasswordReset from './authentication/PasswordReset'

export default function App() {
    return (
        <Router>
            <Route path="/" exact component={SignIn} />
            <Route path="/signup" exact component={SignUp} />
            <Route path="/reset" exact component={PasswordReset} />
            <Route path="/home" exact component={Homepage} />
            <Route path="/league/join" exact component={JoinLeaguePage} />
            <Route path="/league/create" exact component={CreateLeaguePage} />
        </Router>
    )
}
