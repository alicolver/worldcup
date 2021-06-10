import Game from "./Game";
import { Container, makeStyles, Typography } from "@material-ui/core";
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

export interface IPrediction {
    team_one_pred: string,
    team_two_pred: string,
    predictionid: string
}

export interface IMatch {
    team_one: ITeam,
    team_two: ITeam,
    match: IMatchDetails,
    hasPrediction: boolean,
    prediction?: IPrediction
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
        },
        'hasPrediction': false
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
                console.log(res)
                setMatches(res.matches)
            } else {
                setInvalidResponse(true)
            }
        })
    }, [setMatches])

    if (invalidResponse) {
        return(
            <Redirect to={'/'}/>
        )
    } else {
        return(
            <Container>
                <Typography className={classes.upcomingGames}>Upcoming Games</Typography> 
                {matches.map(element => {
                    return <Game {...element}/>
                })}
            </Container>
        )
    }
}