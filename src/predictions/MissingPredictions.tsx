import { Box, Card, Typography } from "@material-ui/core"
import { useEffect, useState } from "react"
import { dateToOrdinal, getJWT, resolveEndpoint } from "../utils/Utils"
import { useStyles } from "./Game"
import { IMatchDetails, ITeam } from "./Predictions"
import Team from "./Team"

interface IUser {
    name: string,
    userid: number
}

interface IMatchPredictionDetails {
    match: IMatchDetails,
    team_one: ITeam,
    team_two: ITeam,
    users: IUser[]
}

export default function MissingPredictions() {
    const classes = useStyles()
    const [predictions, setPredictions] = useState<IMatchPredictionDetails[]>([])

    useEffect(() => {
        fetchMissingPredictions()
    }, [setPredictions])

    
    function fetchMissingPredictions() {
        fetch(resolveEndpoint('match/missing'), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authenticate': getJWT()
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res["SUCCESS"]) {
                setPredictions(res["matches"])
            }
        })
    }

    if (predictions.length === 0) {
        return <></>
    }

    return (
        <>
        <Typography style={{fontSize: '8vw', textAlign: 'center'}}>Upcoming Games</Typography>
        {predictions.map((match) => {
            return (
                <Card className={classes.matchCard}>
                    <Box className={classes.match}>
                        <Box className={classes.predictionHistoryTeamName}>
                            <Team name={match.team_one.name} emoji={match.team_one.emoji} />
                        </Box>
                        <Box style={{marginTop: '7vw'}}>
                            {match.match.match_date + dateToOrdinal(parseInt(match.match.match_date)) + " - " + match.match.kick_off_time}
                        </Box>
                        <Box className={classes.predictionHistoryTeamName}>
                            <Team name={match.team_two.name} emoji={match.team_two.emoji} />
                        </Box>
                    </Box>
                    <b>Users Missing Predictions</b><br/>
                    {match.users.map(user => {return <>{user.name}<br/></>})}
                    <br/>
                </Card>
            )
        })}
        </>
    )

}
