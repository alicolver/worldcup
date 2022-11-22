import { Card, Box, Typography, OutlinedInput } from "@material-ui/core"
import React from "react"
import { IMatchData } from "../types/types"
import { getImageUrl } from "../utils/s3"
import { matchCardUseStyles } from "./Prediction"
import Team from "./Team"

interface IHistoricGameProps {
    matchData: IMatchData
}

export default function HistoricGame(props: IHistoricGameProps): JSX.Element {
    const classes = matchCardUseStyles()

    function renderScore(): JSX.Element {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    value={props.matchData.result? props.matchData.result.home : "0"}
                    disabled
                />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    value={props.matchData.result ? props.matchData.result.away : "0"}
                    disabled
                />
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