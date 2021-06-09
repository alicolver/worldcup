import Header from "../misc/Header";
import Game from "./Game";

export default function Prediction() {
    return(
        <div>
            <Header/>
            <span>Upcoming Games</span> 
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
        </div>
    )
}