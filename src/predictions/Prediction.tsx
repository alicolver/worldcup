import { Box, Card, makeStyles, OutlinedInput, Typography } from "@material-ui/core"
import CircleIcon from "@mui/icons-material/Circle"
import { useEffect, useState } from "react"
import { IMatchData, IPredictionData } from "../types/types"
import { calculateScore, getJWT, hasMatchKickedOff, parseDate, resolveEndpoint } from "../utils/Utils"
import Team from "./Team"
import React from "react"
import { getFlagEmoji, getImageUrl } from "../utils/s3"
import { MAIN_COLOR } from "../utils/Constants"

interface IPredictionProps {
    matchData: IMatchData,
    predictionData: IPredictionData
}

export const useStyles = makeStyles({
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
    }
})

const defaultWasSent = { success: false, error: false }

export default function PredictionCard(props: IPredictionProps): JSX.Element {
    const classes = useStyles()
    const [teamOneScore, setTeamOneScore] = useState({
        score: props.predictionData.homeScore == null ? "" : props.predictionData.homeScore.toString(),
        error: false
    })
    const [teamTwoScore, setTeamTwoScore] = useState({
        score: props.predictionData.awayScore == null ? "" : props.predictionData.awayScore.toString(),
        error: false
    })
    const [wasSent, setWasSent] = useState(defaultWasSent)
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

    function sendPrediction(homeScore: number, awayScore: number) {
        console.log(props.matchData.matchId)
        fetch(resolveEndpoint("predictions/make"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getJWT()
            },
            body: JSON.stringify({
                homeScore: homeScore,
                awayScore: awayScore,
                matchId: props.matchData.matchId
            })
        }).then(res => {
            if (!res.ok) {
                setWasSent({ success: false, error: true })
                return
            }
            setWasSent({ success: true, error: false })
            return res.json().then(result => {
                if (result !== null) {
                    setTimeout(function () {
                        setWasSent(defaultWasSent)
                    }, 500)
                }
            })
        })
    }

    function getResponseGlow(): React.CSSProperties | undefined {
        return wasSent.success ?
            {
                border: "1px solid rgb(86, 180, 89)",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(82, 168, 100, 0.6)"
            } : wasSent.error ? {
                border: "1px solid rgb(199, 18, 49)",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(160, 30, 60, 0.6)"
            } : {}
    }

    function handlePrediction(): void {
        const scoreOne = parseInt(teamOneScore.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        const areBothScoresValid = validateScores(scoreOne, scoreTwo)

        if (!areBothScoresValid) return

        setTeamOneScore({ ...teamOneScore, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })

        sendPrediction(scoreOne, scoreTwo)
    }

    function validateScores(scoreOne: number, scoreTwo: number): boolean {
        let areBothScoresValid = true
        if (isNaN(scoreOne) || scoreOne < 0) {
            setTeamOneScore({ ...teamOneScore, error: true })
            areBothScoresValid = false
        }

        if (isNaN(scoreTwo) || scoreTwo < 0) {
            setTeamTwoScore({ ...teamTwoScore, error: true })
            areBothScoresValid = false
        }

        return areBothScoresValid
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
                    style={getResponseGlow()}
                    id="outlined-basic"
                    value={teamOneScore.score}
                    onChange={(input) => setTeamOneScore({ ...teamOneScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamOneScore.error}
                    disabled={hasKickedOff}
                />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    style={getResponseGlow()}
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamTwoScore.error}
                    disabled={hasKickedOff}
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
            <Card className={classes.matchCard}>
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