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
    const [matches, setMatches] = useState<IMatch[]>([])
    const [invalidResponse, setInvalidResponse] = useState<boolean>(false)

    useEffect(() => {
        getMatches();
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
                    return <Game {...element} callback={getMatches}/>
                })}
            </Container>
        )
    }

    function getMatches() {
        console.log('attempting fetch')
        fetch(goTo('prediction-required'), {
            method: 'GET',
            headers: {
                'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                console.log('updating matches')
                setMatches(res.matches);
            } else {
                setInvalidResponse(true);
            }
        });
    }
}