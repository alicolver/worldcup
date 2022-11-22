import { Box, Card, makeStyles, OutlinedInput, Typography } from "@material-ui/core"
import CircleIcon from "@mui/icons-material/Circle"
import { useEffect, useState } from "react"
import { IMatchData, IPredictionData, IScore, IWasSent } from "../types/types"
import { calculateScore, getResponseGlow, hasMatchKickedOff, parseDate, sendScore, validateScores } from "../utils/Utils"
import Team from "./Team"
import React from "react"
import { getFlagEmoji, getImageUrl } from "../utils/s3"
import { MAIN_COLOR } from "../utils/Constants"

interface IPredictionProps {
    matchData: IMatchData,
    predictionData: IPredictionData,
    callback: (matchData: IMatchData) => void
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
    }
})

export const defaultWasSent = { success: false, error: false }

export default function PredictionCard(props: IPredictionProps): JSX.Element {
    const classes = matchCardUseStyles()
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

    useEffect(() => {
        setWasSent({ success: false, error: false })
        hasMatchKickedOff(props.matchData.matchDate, props.matchData.matchTime, new Date())
    }, [setTeamOneScore, setTeamTwoScore, setHasKickedOff])

    function handlePrediction(): void {
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

        setTeamOneScore({ ...teamOneScore, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })

        sendScore(scoreOne, scoreTwo, props.matchData.matchId, "predictions/make", setWasSent)
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

    return (
        <div>
            {renderLiveTabIfShould()}
            <Card className={classes.matchCard} onClick={() => props.callback(props.matchData)}>
                <Box className={classes.date}>
                    <Typography>{parseDate(props.matchData.matchDate) + " - " + props.matchData.matchTime}</Typography>
                </Box>
                <Box className={classes.match}>
                    <Box>
                        <Team name={props.matchData.homeTeam} flag={getImageUrl(props.matchData.homeTeam)} />
                    </Box>
                    {renderScore()}
                    <Box>
                        <Team name={props.matchData.awayTeam} flag={getImageUrl(props.matchData.awayTeam)} />
                    </Box>
                    {hasKickedOff ? renderPoints() : <></>}
                </Box>
            </Card>
        </div>
    )
}