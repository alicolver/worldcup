import { Card, Box, Typography, makeStyles } from "@material-ui/core"
import Cancel from "@mui/icons-material/Cancel"
import CheckCircle from "@mui/icons-material/CheckCircle"
import React from "react"
import { IMatchData } from "../types/types"
import { getImageUrl } from "../utils/s3"
import { isDraw, isKnockout } from "../utils/Utils"
import { HomeOrAway, matchCardUseStyles } from "./Prediction"
import Team from "./Team"

interface IHistoricGameProps {
    matchData: IMatchData
}

const useStyles = makeStyles({
    teamInput: {
        width: "50px",
        height: "50px",
        textAlign: "center",
        marginTop: "15px",
        "@media (max-width: 380px)": {
            fontSize: "25px",
            width: "40px",
            height: "40px",
        },
        color: "black"
    }
})

export default function HistoricGame(props: IHistoricGameProps): JSX.Element {
    const classes = matchCardUseStyles()
    const scoreClasses = useStyles()

    function renderScore(): JSX.Element {
        return (
            <>
                <div className={scoreClasses.teamInput}>
                    <Typography variant="h3">
                        {props.matchData.result? props.matchData.result.home : "0"}
                    </Typography>
                </div>
                <div className={scoreClasses.teamInput}>
                    <Typography variant="h3">
                        {props.matchData.result? props.matchData.result.away : "0"}
                    </Typography>
                </div>
            </>
        )
    }

    function getIconIfRequired(team: HomeOrAway): JSX.Element | null {
        if (!isKnockout(props.matchData.gameStage) || !isDraw(props.matchData)) return null
        const didTeamWin = team === HomeOrAway.HOME && props.matchData.toGoThrough === "HOME" 
            || team === HomeOrAway.AWAY && props.matchData.toGoThrough === "AWAY"
        if (didTeamWin) return <CheckCircle fontSize="large" className={classes.icon} />
        return <Cancel fontSize="large" className={classes.icon} />
    }

    return (
        <div>
            <Card className={classes.matchCardHistoric}>
                <Box className={classes.date}>
                    <Typography>{props.matchData.isFinished ? "MATCH RESULT" : "LIVE SCORE"}</Typography>
                </Box>
                <Box className={classes.match}>
                    <Box>
                        <Team 
                            name={props.matchData.homeTeam} 
                            flag={getImageUrl(props.matchData.homeTeam)}
                            iconToRender={getIconIfRequired(HomeOrAway.HOME)}
                        />
                    </Box>
                    {renderScore()}
                    <Box>
                        <Team 
                            name={props.matchData.awayTeam} 
                            flag={getImageUrl(props.matchData.awayTeam)} 
                            iconToRender={getIconIfRequired(HomeOrAway.AWAY)}
                        />
                    </Box>
                </Box>
            </Card>
        </div>
    )
}