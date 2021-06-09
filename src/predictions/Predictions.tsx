import Game from "./Game";
import { Typography } from "@material-ui/core";

export default function Prediction() {
    return(
        <div>
            <Typography>Upcoming Games</Typography> 
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
        </div>
    )
}