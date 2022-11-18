import { Container, createMuiTheme, makeStyles, Toolbar } from "@material-ui/core"
import { useEffect, useState } from "react"
import PointsCard from "../leaderboard/PointCard"
import League from "../league/League"
import Header from "../misc/Header"
import Predictions from "../predictions/Predictions"
import { IMatchData } from "../types/Types"
import { getJWT, resolveEndpoint } from "../utils/Utils"
import React from "react"

const useStyles = makeStyles({
    logo: {
        maxHeight: "15vw"
    },
    homepage: {
        position: "relative",
        left: 0,
        width: "100%"
    }
})

export const fontTheme = createMuiTheme({
    typography: {
        fontFamily: [
            "Source Sans Pro",
            "sans-serif",
        ].join(","),
    },
})

interface IGetMatches {
  imminentMatches: IMatchData[],
  nextMatches: IMatchData[]
}

function Homepage(): JSX.Element {
    const classes = useStyles()
    const [matchData, setMatchData] = useState<IGetMatches>({ imminentMatches: [], nextMatches: []})

    useEffect(() => {
        fetch(resolveEndpoint("match/get-upcoming"), {
            method: "GET",
            headers: {
                "Authorization": getJWT()
            }
        }).then(res => {
            if (!res.ok) {
                return
            }
            return res.json()
        }).then(res => {
            console.log(res.data)
            setMatchData(res.data)
        })
    }, [setMatchData])

    return (
        <>
            <Header />
            <Toolbar/>
            <Container className={classes.homepage} maxWidth="xs">
                <PointsCard />
                {matchData.imminentMatches.length > 0 ? <Predictions heading="Next Games" matchData={matchData.imminentMatches}/> : <></>}
                <League />
                {matchData.nextMatches.length > 0 ? <Predictions heading="Upcoming Games" matchData={matchData.nextMatches}/> : <></>}
            </Container>
        </>
    )
}

export default Homepage