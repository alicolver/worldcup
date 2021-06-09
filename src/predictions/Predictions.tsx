import Game from "./Game";
import { makeStyles, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { getJWT, goTo } from "../utils/Utils";

const useStyles = makeStyles({
    upcomingGames: {
        'fontSize': '8vw'
    }
})

export default function Prediction() {
    const classes = useStyles()

    useEffect(() => {
        fetch(goTo('prediction-required'), {
            method: 'GET',
            headers: {
            'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            return res.valid
        })
    })

    return(
        <div>
            <Typography className={classes.upcomingGames}>Upcoming Games</Typography> 
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={'1/4/5 15:00'} />
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={'1/4/5 15:00'} />
            <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={'1/4/5 15:00'} />
        </div>
    )
}