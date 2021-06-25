import { Box, Card, Container, Grid, OutlinedInput } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SingleGameLeaderBoard from "../leaderboard/SingleGameLeaderboard";
import HeaderReturn from "../misc/HeaderReturn";
import { SUCCESS } from "../utils/Constants";
import { calculateScore, getJWT, resolveEndpoint, gotResultCorrect, gotScoreCorrect } from "../utils/Utils";
import { useStyles } from "./Game";
import { IMatchDetails, IPrediction, ITeam } from "./Predictions";
import Team from "./Team";

interface IParams {
    matchid?: string
}

interface IAllUserPredictionGameData {
    team_one: ITeam,
    team_two: ITeam,
    match: IMatchDetails,
    predictions: IPrediction[],
    in_progress?: boolean
}

const emptyData: IAllUserPredictionGameData = {
    team_one: {
        name: 'Team 1',
        emoji: ''
    }, 
    team_two: {
        name: 'Team 2',
        emoji: ''
    },
    match: {
        is_knockout: false,
        team_one_goals: '0',
        team_two_goals: '0',
        matchid: -1,
        match_date: '01/01/2020',
        kick_off_time: '00:00:00'
    },
    predictions: [{
        team_one_pred: '0',
        team_two_pred: '0',
        predictionid: '-1',
        penalty_winners: null,
    }]
}

export default function MatchPredictions() {
    const classes = useStyles()
    const [matchData, setMatchData] = useState<IAllUserPredictionGameData>(emptyData)

    const params = useParams<IParams>()

    useEffect(() => {
        if (params.matchid) {
            getPredictionData(params.matchid)
        }
    }, [params.matchid])

    function getPredictionData(matchid: string) {
        fetch(resolveEndpoint('match/predictions?matchid=' + matchid), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authenticate': getJWT()
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if (res[SUCCESS]) {
                setMatchData({...res})
            }
        })
    }

    function renderScore() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <OutlinedInput
                        className={classes.fixedTeaminputPreds}
                        id="outlined-basic"
                        type="number"
                        value={matchData.match.team_one_goals}
                        readOnly
                    />
                </Grid>
                <Grid item xs={6}>
                    <OutlinedInput
                        className={classes.fixedTeaminputPreds}
                        id="outlined-basic"
                        type="number"
                        value={matchData.match.team_two_goals}
                        readOnly
                    />
                </Grid>
            </Grid>
        )
    }

    function getFormattedMatchData() {
        return matchData.predictions.map(element => {
            return { 
                ...element, 
                predicted_score: (element.team_one_pred + '-' + element.team_two_pred),
                name: element.name ? element.name : '',
                correct_result: gotResultCorrect(element.team_one_pred, element.team_two_pred, parseInt(matchData.match.team_one_goals), parseInt(matchData.match.team_two_goals)),
                correct_score: gotScoreCorrect(element.team_one_pred, element.team_two_pred, parseInt(matchData.match.team_one_goals), parseInt(matchData.match.team_two_goals)),
                score: calculateScore(element.team_one_pred, element.team_two_pred, parseInt(matchData.match.team_one_goals), parseInt(matchData.match.team_two_goals))
            }})
    }
    
    return (
        <>
            <HeaderReturn/>
            <Container className={classes.allPredictionContainer}>
            <Card className={classes.matchCard}>
            <Box className={classes.match}>
                <Box className={classes.predictionHistoryTeamName}>
                    <Team name={matchData.team_one.name} emoji={matchData.team_one.emoji} />
                </Box>
                {renderScore()}
                <Box className={classes.predictionHistoryTeamName}>
                    <Team name={matchData.team_two.name} emoji={matchData.team_two.emoji} />
                </Box>
            </Box>
            </Card>
            <SingleGameLeaderBoard entries={getFormattedMatchData()}/>
            </Container>
        </>
    )
}
