import {
    Container,
    createMuiTheme,
    makeStyles,
    Toolbar,
} from "@material-ui/core"
import { useEffect, useState } from "react"
import PointsCard from "../leaderboard/PointCard"
import League from "../league/League"
import Header from "../misc/Header"
import Predictions from "../predictions/Predictions"
import { ILeague, IMatchData } from "../types/types"
import { getJWT, resolveEndpoint } from "../utils/Utils"
import React from "react"

const useStyles = makeStyles({
    logo: {
        maxHeight: "15vw",
    },
    homepage: {
        position: "relative",
        left: 0,
        width: "100%",
    },
})

export const fontTheme = createMuiTheme({
    typography: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    },
})

interface IGetMatches {
    imminentMatches: IMatchData[];
    nextMatches: IMatchData[];
}

function Homepage(): JSX.Element {
    const classes = useStyles()
    const [matchData, setMatchData] = useState<IGetMatches>({
        imminentMatches: [],
        nextMatches: [],
    })
    const [leagueData, setLeagueData] = useState<ILeague[]>([])
    const [leagueDataIsLoading, setLeagueDataIsLoading] = useState(false)
    const [globalRank, setGlobalRank] = useState<number>(0)

    useEffect(() => {
        fetch(resolveEndpoint("match/get-upcoming"), {
            method: "GET",
            headers: {
                Authorization: getJWT(),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return
                }
                return res.json()
            })
            .then((res) => {
                setMatchData(res.data)
            })
        setLeagueDataIsLoading(true)
        fetch(resolveEndpoint("user/get-leagues"), {
            method: "POST",
            headers: {
                Authorization: getJWT(),
            },
        })
            .then((res) => {
                setLeagueDataIsLoading(false)
                if (!res.ok) {
                    return null
                }
                return res.json()
            })
            .then((res) => {
                if (res !== null) {
                    setLeagueData(res.data.leagues)
                    setGlobalRank(
                        leagueData.filter((league) => league.leagueId === "global")[0]
                            .currentRanking
                    )
                }
            })
    }, [setMatchData, setLeagueData, setLeagueDataIsLoading])

    return (
        <>
            <Header />
            <Toolbar />
            <Container className={classes.homepage} maxWidth="xs">
                <PointsCard
                    globalRank={globalRank}
                    globalRankIsLoading={leagueDataIsLoading}
                />
                {matchData.imminentMatches.length > 0 ? (
                    <Predictions
                        heading="Next Games"
                        matchData={matchData.imminentMatches}
                    />
                ) : (
                    <></>
                )}
                <League
                    leagueData={leagueData}
                    leagueDataIsLoading={leagueDataIsLoading}
                />
                {matchData.nextMatches.length > 0 ? (
                    <Predictions
                        heading="Upcoming Games"
                        matchData={matchData.nextMatches}
                    />
                ) : (
                    <></>
                )}
            </Container>
        </>
    )
}

export default Homepage
