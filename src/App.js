import { HashRouter as Router, Route } from 'react-router-dom'
import SignUp from './authentication/SignUp'
import SignIn from './authentication/SignIn'
import LeaderboardPage from './leaderboard/LeaderboardPage'
import Prediction from './predictions/Predictions'
import Homepage from './homepage/Homepage'

export default function App() {
    return (
        <Router>
            <Route path="/" exact component={SignIn}/>
            <Route path="/signup" exact component={SignUp}/>
            <Route path="/standings" exact component={LeaderboardPage}/>
            <Route path="/predict" exact component={Prediction}/>
            <Route path="/home" exact component={Homepage}/>
            <Route path="/history" exact component={History}/>
        </Router>
    )
}
