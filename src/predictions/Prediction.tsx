import { Box, Card, makeStyles, OutlinedInput, Typography } from "@material-ui/core"
import CircleIcon from "@mui/icons-material/Circle"
import { useEffect, useState } from "react"
import { IMatchData, IPredictionData, IScore, IWasSent } from "../types/types"
import { calculateScore, getResponseGlow, hasMatchKickedOff, isKnockout, parseDate, sendScore, validateScores } from "../utils/Utils"
import Team from "./Team"
import React from "react"
import { getFlagEmoji, getImageUrl } from "../utils/s3"
import { MAIN_COLOR } from "../utils/Constants"
import CheckCircle from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import HelpIcon from "@mui/icons-material/Help"
import Cancel from "@mui/icons-material/Cancel"

interface IPredictionProps {
    matchData: IMatchData,
    predictionData: IPredictionData,
    callback: (matchData: IMatchData) => void
}

export enum HomeOrAway {
    HOME,
    AWAY
}

export const matchCardUseStyles = makeStyles({
    match: {
        width: "90%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
    },
    game: {
        width: "95%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        marginTop: "5vh",
        position: "relative"
    },
    teaminput: {
        width: "50px",
        height: "50px",
        textAlign: "center",
        marginTop: "15px",
        fontSize: "40px",
        "@media (max-width: 380px)": {
            fontSize: "25px",
            width: "40px",
            height: "40px",
        },
    },
    date: {
        fontSize: "8px",
        marginBottom: "2px",
        maringTop: "2px",
        verticalAlign: "center",
        position: "relative",
        color: "grey"
    },
    matchCard: {
        marginBottom: "15px",
        textAlign: "center",
        borderRadius: "10px",
        position: "relative"
    },
    matchCardHistoric: {
        marginBottom: "15px",
        textAlign: "center",
        borderRadius: "10px",
        position: "relative",
        marginLeft: "5px",
        marginRight: "5px",
        marginTop: "5px"
    },
    penaltyWinner: {
        fontSize: "16px",
    },
    resultText: {
        backgroundColor: "#505e73",
        padding: "4px",
        borderRadius: "3px",
        color: "white"
    },
    allPredictionContainer: {
        marginTop: "15px",
        marginBottom: "10px",
        position: "fixed"
    },
    iconStyle: {
        verticalAlign: "bottom",
    },
    liveTab: {
        display: "inline-flex",
        marginLeft: "3px"
    },
    points: {
        position: "absolute",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        backgroundColor: MAIN_COLOR,
        color: "white",
        verticalAlign: "middle",
        fontWeight: "bold",
        bottom: "5px",
        fontSize: "12px",
        "@media (max-width: 380px)": {
            width: "20px",
            height: "20px",
            bottom: "3px",
        },
    },
    endMatch: {
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: MAIN_COLOR,
        color: "white",
        marginBottom: "5px"
    },
    icon: {
        position: "absolute",
        margin: "auto",
        verticalAlign: "middle",
        left: "32px",
        top: "20px",
        "@media (max-width: 380px)": {
            fontSize: "16px",
            left: "28px"
        },
        "@media (max-width: 340px)": {
            fontSize: "12px",
            left: "22px",
            top: "15px"
        },
        "@media (max-width: 310px)": {
            fontSize: "8px"
        },
    }
})

export const defaultWasSent = { success: false, error: false }

export default function PredictionCard(props: IPredictionProps): JSX.Element {
    const classes = matchCardUseStyles()
    const selectedIcon: JSX.Element = <CheckCircle color="success" fontSize="large" className={classes.icon} />
    const unselectedIcon: JSX.Element = <Cancel color="error" fontSize="large" className={classes.icon} />
    const [teamOneScore, setTeamOneScore] = useState<IScore>({
        score: props.predictionData.homeScore == null ? "" : props.predictionData.homeScore.toString(),
        error: false
    })
    const [teamTwoScore, setTeamTwoScore] = useState<IScore>({
        score: props.predictionData.awayScore == null ? "" : props.predictionData.awayScore.toString(),
        error: false
    })
    const [wasSent, setWasSent] = useState<IWasSent>(defaultWasSent)
    const [hasKickedOff, setHasKickedOff] = useState<boolean>(
        hasMatchKickedOff(
            props.matchData.matchDate,
            props.matchData.matchTime,
            new Date()
        )
    )
    const [teamToProgress, setTeamToProgress] = useState<HomeOrAway | null>(
        props.predictionData.toGoThrough ? HomeOrAway[props.predictionData.toGoThrough] : null
    )
    const [homeIcon, setHomeIcon] = useState<JSX.Element | null>(getIconFromPrediction(HomeOrAway.HOME))
    const [awayIcon, setAwayIcon] = useState<JSX.Element | null>(getIconFromPrediction(HomeOrAway.AWAY))

    function getIconFromPrediction(team: HomeOrAway): JSX.Element | null {
        if (!props.predictionData.toGoThrough) return null
        return team === HomeOrAway[props.predictionData.toGoThrough] ? selectedIcon : unselectedIcon
    }

    useEffect(() => {
        setWasSent({ success: false, error: false })
        hasMatchKickedOff(props.matchData.matchDate, props.matchData.matchTime, new Date())
    }, [setTeamOneScore, setTeamTwoScore, setHasKickedOff, setHomeIcon, setAwayIcon, setTeamToProgress])

    function handlePrediction(team?: HomeOrAway): void {
        const scoreOne = parseInt(teamOneScore.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        const areBothScoresValid = validateScores(
            scoreOne, 
            scoreTwo,
            teamOneScore,
            teamTwoScore,
            setTeamOneScore,
            setTeamTwoScore
        )
        if (!areBothScoresValid) return
        if (isKnockout(props.matchData.gameStage)) {
            if (scoreOne === scoreTwo) {
                if (!homeIcon || !awayIcon || teamToProgress === null) {
                    setHomeIcon(<HelpIcon fontSize="large" className={classes.icon} />)
                    setAwayIcon(<HelpIcon fontSize="large" className={classes.icon} />)
                    return
                }
            } else {
                setHomeIcon(null)
                setAwayIcon(null)
            }
        } else {
            setTeamToProgress(null)
        }

        const toGoThrough = scoreOne > scoreTwo 
            ? HomeOrAway.HOME
            : scoreTwo > scoreOne 
                ? HomeOrAway.AWAY
                : team !== null && typeof team !== "undefined"
                    ? team
                    : teamToProgress
        
        setTeamOneScore({ ...teamOneScore, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })

        sendScore(scoreOne, scoreTwo, toGoThrough, props.matchData.matchId, "predictions/make", setWasSent)
    }

    function getResultString(): string {
        if (!props.matchData.result) return ""
        const homeFlag = getFlagEmoji(props.matchData.homeTeam)
        const awayFlag = getFlagEmoji(props.matchData.awayTeam)
        const homeScore = props.matchData.result.home
        const awayScore = props.matchData.result.away
        return ": " + homeFlag + " " + homeScore + ":" + awayScore + " " + awayFlag
    }

    function renderLiveTab(): JSX.Element {
        return (
            <div className={classes.liveTab}>
                <CircleIcon htmlColor={MAIN_COLOR} className={classes.iconStyle} />
                <Typography style={{ paddingLeft: "0.1rem" }}>
                    LIVE{getResultString()}
                </Typography>
            </div>
        )
    }

    function getPoints(): number {
        if (!props.matchData.result) return calculateScore(
            props.predictionData.homeScore,
            props.predictionData.awayScore,
            0,
            0
        )

        return calculateScore(
            props.predictionData.homeScore,
            props.predictionData.awayScore,
            props.matchData.result.home,
            props.matchData.result.away
        )
    }

    function renderPoints(): JSX.Element {
        return (
            <div className={classes.points}>
                <Typography>{getPoints()}</Typography>
            </div>
        )
    }

    function renderScore(): JSX.Element {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    style={getResponseGlow(wasSent)}
                    id="outlined-basic"
                    value={teamOneScore.score}
                    onChange={(input) => setTeamOneScore({ ...teamOneScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamOneScore.error}
                    disabled={hasKickedOff}
                    inputProps={{ maxLength: 1 }}
                />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    style={getResponseGlow(wasSent)}
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamTwoScore.error}
                    disabled={hasKickedOff}
                    inputProps={{ maxLength: 1 }}
                />
            </>
        )
    }

    function renderLiveTabIfShould(): JSX.Element {
        return hasKickedOff && !props.matchData.isFinished
            ? renderLiveTab()
            : <></>
    }
    
    function getIconIfRequired(team: HomeOrAway): JSX.Element | null {
        if (!isKnockout(props.matchData.gameStage)) return null
        const homeScore = parseInt(teamOneScore.score)
        const awayScore = parseInt(teamTwoScore.score)
        if (isNaN(homeScore) || isNaN(awayScore)) return null
        if (homeScore !== awayScore) return null
        return team === HomeOrAway.HOME ? homeIcon : awayIcon
    }

    function setIcons(team: HomeOrAway): void {
        const homeScore = parseInt(teamOneScore.score)
        const awayScore = parseInt(teamTwoScore.score)
        if (isNaN(homeScore) || isNaN(awayScore)) return
        if (homeScore !== awayScore) return

        setTeamToProgress(team)
        if (team === HomeOrAway.HOME) {
            setHomeIcon(selectedIcon)
            setAwayIcon(unselectedIcon)
        } else {
            setAwayIcon(selectedIcon)
            setHomeIcon(unselectedIcon)
        }
        handlePrediction(team)
    }

    function setIconsHome(): void {
        if (hasKickedOff) return
        setIcons(HomeOrAway.HOME)
    }

    function setIconsAway(): void {
        if (hasKickedOff) return
        setIcons(HomeOrAway.AWAY)
    }

    return (
        <div>
            {renderLiveTabIfShould()}
            <Card className={classes.matchCard} onClick={() => props.callback(props.matchData)}>
                <Box className={classes.date}>
                    <Typography>{parseDate(props.matchData.matchDate) + " - " + props.matchData.matchTime}</Typography>
                </Box>
                <Box className={classes.match}>
                    <Box>
                        <Team 
                            name={props.matchData.homeTeam} 
                            flag={getImageUrl(props.matchData.homeTeam)} 
                            iconToRender={getIconIfRequired(HomeOrAway.HOME)}
                            callback={setIconsHome}
                        />
                    </Box>
                    {renderScore()}
                    <Box>
                        <Team 
                            name={props.matchData.awayTeam} 
                            flag={getImageUrl(props.matchData.awayTeam)} 
                            iconToRender={getIconIfRequired(HomeOrAway.AWAY)}
                            callback={setIconsAway}
                        />
                    </Box>
                    {hasKickedOff ? renderPoints() : <></>}
                </Box>
            </Card>
        </div>
    )
}