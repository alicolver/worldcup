import { Box, Card, Container, makeStyles, OutlinedInput, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { IMatchData } from "../types/types";
import { getImageUrl } from "../utils/s3";
import Team from "./Team";

interface IPredictionProps {
    matchData: IMatchData
}

export const useStyles = makeStyles({
    match: {
        width: '80vw',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '3vw'
    },
    game: {
        width: '80vw',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '5vh',
        position: 'relative'
    },
    teaminput: {
        width: '50px',
        height: '50px',
        fontSize: '40px',
        textAlign: 'center',
        marginTop: '4vw'
    },
    fixedTeaminput: {
        width: '50px',
        height: '50px',
        fontSize: '40px',
        textAlign: 'center',
        marginTop: '1vw'
    },
    fixedTeaminputPreds: {
        width: '50px',
        height: '50px',
        fontSize: '40px',
        textAlign: 'center',
        marginTop: '7vw'
    },
    dash: {
        fontSize: '8vw',
        marginTop: '4vw'
    },
    date: {
        fontSize: '4vw',
        marginBottom: '0.5vh',
        maringTop: '0.5vh',
        verticalAlign: 'center',
        position: 'relative',
        color: 'grey'
    },
    matchCard: {
        marginBottom: '15px',
        textAlign: 'center',
        borderRadius: '10px',
    },
    endGameButton: {
        marginBottom: '3vw'
    },
    yourScore: {
        marginTop: '3vw',
    },
    yourScoreText: {
        padding: '4px',
        borderRadius: '3px',
        color: 'white'
    },
    fixedGameTeamName: {
        marginTop: '7vw'
    },
    predictionHistoryTeamName: {
        marginTop: '3vw'
    },
    penaltyWinner: {
        fontSize: '16px',
    },
    resultText: {
        backgroundColor: '#505e73',
        padding: '4px',
        borderRadius: '3px',
        color: 'white'
    },
    allPredictionContainer: {
        marginTop: '25vw',
        marginBottom: '19vw',
        position: 'fixed'
    }
})

export default function PredictionCard(props: IPredictionProps) {
    const classes = useStyles()
    const [teamOneScore, setTeamOneScore] = useState({ score: '', error: false });
    const [teamTwoScore, setTeamTwoScore] = useState({ score: '', error: false });
    const [wasSent, setWasSent] = useState<boolean>(false)

    function getResponseGlow(): React.CSSProperties | undefined {
        return wasSent ?
            {
                border: '1px solid rgb(86, 180, 89)',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(82, 168, 100, 0.6)'
            } : wasSent ? {
                border: '1px solid rgb(199, 18, 49)',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(160, 30, 60, 0.6)'
            } : {};
    }

    function handlePrediction() {
        const scoreOne = parseInt(teamOneScore.score)
        const scoreTwo = parseInt(teamTwoScore.score)
        var areBothScoresValid = validateScores(scoreOne, scoreTwo);

        if (!areBothScoresValid) {
            return
        }

        setTeamOneScore({ ...teamOneScore, error: false })
        setTeamTwoScore({ ...teamTwoScore, error: false })
    }

    function validateScores(scoreOne: number, scoreTwo: number) {
        var areBothScoresValid = true;
        if (isNaN(scoreOne)) {
            setTeamOneScore({ ...teamOneScore, error: true });
            areBothScoresValid = false;
        }

        if (isNaN(scoreTwo)) {
            setTeamTwoScore({ ...teamTwoScore, error: true });
            areBothScoresValid = false;
        }

        return areBothScoresValid;
    }

    function renderUnpredictedScore() {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    style={getResponseGlow()}
                    id="outlined-basic"
                    value={teamOneScore.score}
                    onChange={(input) => setTeamOneScore({ ...teamOneScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamOneScore.error} />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    style={getResponseGlow()}
                    value={teamTwoScore.score}
                    onChange={(input) => setTeamTwoScore({ ...teamTwoScore, score: input.target.value })}
                    onBlur={() => handlePrediction()}
                    error={teamTwoScore.error}
                />
            </>
        )
    }

    
    return (
        <Card className={classes.matchCard}>
            <Box className={classes.date}>
                <Typography>{props.matchData.matchDate + ' - ' + props.matchData.matchTime}</Typography>
            </Box>
            <Box className={classes.match}>
                <Box>
                    <Team name={props.matchData.homeTeam} flag={getImageUrl(props.matchData.homeTeam)} />
                </Box>
                {renderUnpredictedScore()}
                <Box>
                    <Team name={props.matchData.awayTeam} flag={getImageUrl(props.matchData.awayTeam)} />
                </Box>
            </Box>
        </Card>
    )
}