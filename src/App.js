import { HashRouter as Router, Route } from 'react-router-dom'
import SignUp from './authentication/SignUp'
import SignIn from './authentication/SignIn'
import PasswordReset from './authentication/PasswordReset'
import LeaderboardPage from './leaderboard/LeaderboardPage'
import Prediction from './predictions/Predictions'
import Homepage from './homepage/Homepage'
import History from './predictions/History'
import AdminPage from './predictions/Admin'
import MatchPredictions from './predictions/MatchPredictions'


export default function App() {
    return (
        <Router>
            <Route path="/" exact component={SignIn} />
            <Route path="/signup" exact component={SignUp} />
            <Route path="/standings" exact component={LeaderboardPage} />
            <Route path="/predict" exact component={Prediction} />
            <Route path="/home" exact component={Homepage} />
            <Route path="/history/:userid" exact component={History} />
            <Route path="/history" exact component={History} />
            <Route path="/admin" exact component={AdminPage} />
            <Route path="/reset" exact component={PasswordReset} />
            <Route path="/match/:matchid" exact component={MatchPredictions} />
        </Router>
    )
}
