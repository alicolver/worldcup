import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Container,
    makeStyles,
    Typography,
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { ILeague, IMatchData, IPredictionData } from "../types/types"
import {
    fetchAuthEndpoint,
    getUserid,
    hasMatchKickedOff
} from "../utils/Utils"
import HistoricGameModal from "./HistoricGameModal"
import Prediction from "./Prediction"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

interface IPredictionHistoryProps {
  leagues: ILeague[];
}

const useStyles = makeStyles({
    header: {
        paddingTop: "10px",
        paddingBottom: "20px",
        position: "relative",
        paddingLeft: 0,
        paddingRight: 0,
    },
    heading: {
        marginTop: "1rem",
        paddingTop: "1rem",
        fontSize: "2rem",
        paddingBottom: "1rem",
    },
})

interface IPreviousPrediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  gameStage: "GROUP" | "OCTOFINAL" | "QUARTERFINAL" | "SEMIFINAL" | "FINAL";
  result: {
    home: number;
    away: number;
  };
  matchDay: number;
  matchDate: string;
  matchTime: string;
  isFinished: boolean;
  prediction: {
    homeScore: number;
    awayScore: number;
  };
  points: number;
}

export function PredictionHistory(props: IPredictionHistoryProps): JSX.Element {
    const classes = useStyles()
    const [previousPredictions, setPreviousPredictions] = useState<IPreviousPrediction[] | null>(null)
    const [historyModal, setHistoryModal] = useState<IMatchData | null>(null)
    const handleClose = () => setHistoryModal(null)

    useEffect(() => {
        fetchAuthEndpoint("predictions/get-previous-predictions-for-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: getUserid(),
            }),
        }).then((res) => {
            if (!res.ok) {
                return
            }
            return res.json().then((res) => {
                setPreviousPredictions(res.data)
            })
        })
    }, [setPreviousPredictions])

    function getPreviousPredictionCards(matchData: IPreviousPrediction[]) {
        return matchData
            .sort(
                (a, b) =>
                    new Date(`${b.matchDate}T${b.matchTime}`).getTime() -
          new Date(`${a.matchDate}T${a.matchTime}`).getTime()
            )
            .map((previousPred) => {
                const predData: IPredictionData = {
                    homeScore: previousPred.prediction.homeScore,
                    awayScore: previousPred.prediction.awayScore,
                }
                const match: IMatchData = {
                    matchId: previousPred.matchId,
                    homeTeam: previousPred.homeTeam,
                    awayTeam: previousPred.awayTeam,
                    gameStage: previousPred.gameStage,
                    matchDay: previousPred.matchDay,
                    matchTime: previousPred.matchTime,
                    matchDate: previousPred.matchDate,
                    isFinished: previousPred.isFinished,
                    result: {
                        home: previousPred.result.home,
                        away: previousPred.result.away,
                    },
                }
                return (
                    <Prediction
                        key={match.matchId}
                        matchData={match}
                        predictionData={predData}
                        callback={toggleModal}
                    />
                )
            })
    }

    function toggleModal(matchData: IMatchData): void {
        if (
            !hasMatchKickedOff(matchData.matchDate, matchData.matchTime, new Date())
        )
            return
        setHistoryModal(matchData)
    }

    function renderPredictionModalIfShould(): JSX.Element {
        if (historyModal == null) return <></>
        return (
            <HistoricGameModal
                matchData={historyModal}
                leagueData={props.leagues}
                handleClose={handleClose}
            />
        )
    }

    return (
        <Container style={{ paddingBottom: "2rem" }}>
            <Box m={-3}>
                <Accordion style={{ backgroundColor: "transparent" }} elevation={0}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        style={{ padding: 0, border: 0 }}
                    >
                        <Typography className={classes.heading}>Match History</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0, border: 0 }}>
                        <Container className={classes.header}>
                            <>
                                {previousPredictions &&
                  getPreviousPredictionCards(previousPredictions)}
                            </>
                        </Container>
                    </AccordionDetails>
                </Accordion>
            </Box>
            {props.leagues.length > 0 ? renderPredictionModalIfShould() : <></>}
        </Container>
    )
}
