import Game from "./Game";
import { Typography } from "@material-ui/core";
import { useEffect } from "react";

export default function Prediction() {

    useEffect(() => {})

    return(
        <div>
            <Typography>Upcoming Games</Typography> 
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={Date.now()} />
        </div>
    )
}