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

export interface ITeam {
    name: string,
    emoji: string
}

export interface IMatchDetails {
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
    const [matches, setMatches] = useState<IMatch[]>([{
        'team_one': {
            'name': 'team',
            'emoji': ''
        },
        'team_two': {
            'name': 'team',
            'emoji': ''
        },
        'match': {
            'match_date': '',
            'kick_off_time': '',
            'is_knockout': false,
            'matchid': -1
        }
    }])

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
    }, [])

    if (invalidResponse) {
        return(
            <Redirect to={'/'}/>
        )
    } else {
        return(
            <div>
                <Typography className={classes.upcomingGames}>Upcoming Games</Typography> 
                {matches.forEach(element => {
                    <Game team1={element.team_one} team2={element.team_two} match={element.match}/>
                })}
            </div>
        )
    }
}