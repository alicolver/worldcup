import { Box, Container, makeStyles, Typography } from "@material-ui/core"
import { IMatchData } from "../types/types"
import React from "react"
import Game from "./Game"

interface IPredictionsProps {
    heading: string,
    matchData: IMatchData[]
}

const useStyles = makeStyles({
    header: {
        paddingTop: "10px",
        paddingBottom: "20px",
        position: "relative"
    },
    heading: {
        marginTop: "1rem",
        paddingTop: "1rem",
        fontSize: "2rem",
        paddingBottom: "1rem",
    }
})

export default function Predictions(props: IPredictionsProps): JSX.Element {
    const classes = useStyles()

    function getGameCards(matchData: IMatchData[]) {
        return matchData.map(match => <Game key={match.matchId} matchData={match} />)
    }

    return props.matchData.length > 0
        ? (
            <Box m={-2}>
                <Container className={classes.header}>
                    <Typography className={classes.heading}>{props.heading}</Typography>
                    {getGameCards(props.matchData)}
                </ Container>
            </Box>
        )
        : (<></>)
}