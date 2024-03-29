import {
    Container,
    createMuiTheme,
    makeStyles,
    Toolbar,
} from "@material-ui/core"
import { useEffect, useState } from "react"
import PointsCard from "./PointCard"
import League from "../league/League"
import Header from "../misc/Header"
import Predictions from "../predictions/Predictions"
import { ILeague, IMatchData } from "../types/types"
import React from "react"
import AboutModal from "../about/About"
import Games from "../predictions/Games"
import Analytics from "../analytics/Analytics"
import { PredictionHistory } from "../predictions/PredictionHistory"
import { fetchAuthEndpoint } from "../utils/Auth"
import { hasMatchKickedOff } from "../utils/Match"

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
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    useEffect(() => {
        fetchAuthEndpoint("match/get-upcoming", {
            method: "GET",
        }).then((res) => {
            if (!res.ok) {
                return
            }
            return res.json()
        }).then((res) => {
            setMatchData(res.data)
        })
        setLeagueDataIsLoading(true)
        fetchAuthEndpoint("user/get-leagues", {
            method: "POST",
        }).then((res) => {
            setLeagueDataIsLoading(false)
            if (!res.ok) {
                return null
            }
            return res.json()
        }).then((res) => {
            if (res !== null) {
                setLeagueData(res.data.leagues)
                const fetchedLeagueData: ILeague[] = res.data.leagues
                const globalRank = fetchedLeagueData.filter((league) => league.leagueId === "global")[0].currentRanking || 0
                setGlobalRank(globalRank)
            }
        })
        fetchAuthEndpoint("auth/check-admin", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then(res => { setIsAdmin(res.status === 200) })
    }, [setMatchData, setLeagueData, setLeagueDataIsLoading, setIsAdmin])

    function renderLiveGamesIfAdmin(): JSX.Element {
        const liveMatches = matchData.imminentMatches.filter(data => hasMatchKickedOff(data.matchDate, data.matchTime, new Date()) && !data.isFinished)
        return isAdmin && liveMatches.length > 0
            ? <Games heading="Admin Match Updates" matchData={liveMatches}/>
            : <></>
    }

    return (
        <>
            <Header />
            <Toolbar />
            <Container className={classes.homepage} maxWidth="xs">
                <AboutModal />
                {renderLiveGamesIfAdmin()}
                <PointsCard
                    globalRank={globalRank}
                    globalRankIsLoading={leagueDataIsLoading}
                />
                {matchData.imminentMatches.length > 0 ? (
                    <Predictions
                        heading={`Next Game ${matchData.imminentMatches.length > 0 ? "s" : ""}`}
                        matchData={matchData.imminentMatches}
                        leagues={leagueData}
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
                        heading={`Upcoming Game${matchData.nextMatches.length > 0 ? "s" : ""}`}
                        matchData={matchData.nextMatches}
                        leagues={leagueData}
                    />
                ) : (
                    <></>
                )}
                <PredictionHistory leagues={leagueData}/>
                <Analytics />
            </Container>
        </>
    )
}

export default Homepage
