import Game from "./Game";
import { Container, makeStyles, ThemeProvider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getJWT, resolveEndpoint } from "../utils/Utils";
import { Redirect } from "react-router";
import { fontTheme } from "../homepage/Homepage";

const useStyles = makeStyles({
    upcomingGames: {
        fontSize: '8vw',
        paddingTop: '4vw',
        paddingBottom: '4vw',
        textAlign: 'center'
    },
    gameContainer: {
        marginBottom: '19vw'
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
    is_fulltime: boolean,
    team_one_goals: string,
    team_two_goals: string,
    matchid: number,
    penalty_winners: number | null
}

export interface IPrediction {
    team_one_pred: string,
    team_two_pred: string,
    predictionid: string,
    penalty_winners: number | null,
    score?: number,
    name?: string
}

export interface IMatch {
    team_one: ITeam,
    team_two: ITeam,
    match: IMatchDetails,
    hasPrediction: boolean,
    prediction?: IPrediction
    in_progress?: boolean
}

export default function Prediction() {
    const classes = useStyles()
    const [matches, setMatches] = useState<IMatch[]>([])
    const [invalidResponse, setInvalidResponse] = useState<boolean>(false)
    const [hidden, setHidden] = useState<boolean>(false)

    useEffect(() => {
        getMatches();
    }, [setMatches])

    if (invalidResponse) {
        return (
            <Redirect to={'/'} />
        )
    } else {
        return (
            <ThemeProvider theme={fontTheme}>
                <Container className={classes.gameContainer}>
                    <Typography className={classes.upcomingGames}>{hidden ? "Games coming soon" : "Upcoming Games"}</Typography>
                    {matches.map(element => {
                        if (element.hasPrediction && element.prediction) {
                            return <Game {...element} callback={getMatches} penalty_winners={element.match.is_knockout ? element.prediction.penalty_winners : 0} team_one_pred={element.prediction.team_one_pred} team_two_pred={element.prediction.team_two_pred} />
                        } else {
                            return <Game {...element} callback={getMatches} />
                        }
                    })}
                </Container>
            </ThemeProvider>
        )
    }

    function getMatches() {
        console.log('attempting fetch')
        fetch(resolveEndpoint('prediction-required'), {
            method: 'GET',
            headers: {
                'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setHidden(res.hidden)
                setMatches(res.matches);
            } else {
                setInvalidResponse(true);
            }
        });
    }
}