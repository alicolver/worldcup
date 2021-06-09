import { HashRouter as Router, Route } from 'react-router-dom'
import {Redirect} from "react-router-dom"
import SignUp from './authentication/SignUp'
import SignIn from './authentication/SignIn'
import LeaderboardPage from './leaderboard/LeaderboardPage'
import Prediction from './predictions/Predictions'

function App() {
    return (
        <Router>
            <Route path="/login" component={SignIn}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/standings" component={LeaderboardPage}/>
            <Route path="/predict" component={Prediction}/>
            <Route path="/" exact component={getthere}/>
        </Router>
    )
}

function getthere() {
    return (
        <Redirect to="/login"/>
    )
}

export default App
