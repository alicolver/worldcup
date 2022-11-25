import { Card, Box, Typography, makeStyles } from "@material-ui/core"
import React from "react"
import { IMatchData } from "../types/types"
import { getImageUrl } from "../utils/s3"
import { matchCardUseStyles } from "./Prediction"
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

    return (
        <div>
            <Card className={classes.matchCardHistoric}>
                <Box className={classes.date}>
                    <Typography>{props.matchData.isFinished ? "MATCH RESULT" : "LIVE SCORE"}</Typography>
                </Box>
                <Box className={classes.match}>
                    <Box>
                        <Team name={props.matchData.homeTeam} flag={getImageUrl(props.matchData.homeTeam)} />
                    </Box>
                    {renderScore()}
                    <Box>
                        <Team name={props.matchData.awayTeam} flag={getImageUrl(props.matchData.awayTeam)} />
                    </Box>
                </Box>
            </Card>
        </div>
    )
}