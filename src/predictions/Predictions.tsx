import Game from "./Game";
import { makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { getJWT, goTo } from "../utils/Utils";
import { Redirect } from "react-router";

const useStyles = makeStyles({
    upcomingGames: {
        'fontSize': '8vw'
    }
})

interface ITeam {
    name: string,
    emoji: string
}

interface IMatchDetails {
    match_date: string,
    kick_off_time: string,
    is_knockout: boolean,
    matchid: number
}

interface IMatch {
    team_one: ITeam,
    team_two: ITeam,
    match: IMatchDetails
}

export default function Prediction() {
    const classes = useStyles()
    const [matches, setMatches] = useState<IMatch[] | undefined>()
    const [invalidResponse, setInvalidResponse] = useState<boolean>(false)

    useEffect(() => {
        fetch(goTo('prediction-required'), {
            method: 'GET',
            headers: {
            'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setMatches(res.matches)
            } else {
                setInvalidResponse(true)
            }
        })
    })

    if (invalidResponse) {
        return(
            <Redirect to={'/'}/>
        )
    } else {
        return(
            <div>
                <Typography className={classes.upcomingGames}>Upcoming Games</Typography> 
                <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={'1/4/5 15:00'} />
                <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={'1/4/5 15:00'} />
                <Game team1={"Netherlands"} team2={"Spain"} team1emoji={"🇳🇱"} team2emoji={"🇪🇸"} date={'1/4/5 15:00'} />
            </div>
        )
    }
}