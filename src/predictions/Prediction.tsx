import { Card, Container, makeStyles, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { IMatchData } from "../types/types";
import { getImageUrl } from "../utils/s3";

interface IPredictionProps {
    matchData: IMatchData
}

export const useStyles = makeStyles({
    matchCard: {
        marginTop: '10px'
    },
    date: {
        textAlign: 'center'
    },
    leftFlag: {
        height: '50px',
    },
    rightFlag: {
        height: '50px',
    },
    input: {
        height: '50px',
        width: '50px'
    },
    homeStack: {
        width: '4rem'
    },
    awayStack: {
        width: '4rem'
    },
    predictionContainer: {
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#9a0c34',
        paddingLeft: '0',
        paddingRight: '0',
        '& > div': {
            width: '20%',
            height: '75px',
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
        }
    }
})


export default function PredictionCard(props: IPredictionProps) {
    const classes = useStyles()
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


    return (
        <Card className={classes.matchCard}>
            <Typography className={classes.date}>{props.matchData.matchDate} - {props.matchData.matchTime}</Typography>
            <Container className={classes.predictionContainer}>
                <Container>
                    <img 
                        className={classes.leftFlag} 
                        src={getImageUrl(props.matchData.homeTeam)}
                        alt={props.matchData.homeTeam}
                    />
                    <Typography>{props.matchData.homeTeam}</Typography>
                </Container>
                <Container>
                    <TextField 
                        variant="outlined" 
                        className={classes.input} 
                    />
                </Container>
                <Container>
                    <TextField 
                        variant="outlined" 
                        className={classes.input}
                    />
                </Container>
                <Container>
                    <img 
                        className={classes.rightFlag} 
                        src={getImageUrl(props.matchData.awayTeam)}
                        alt={props.matchData.awayTeam}
                    />
                    <Typography>{props.matchData.awayTeam}</Typography>
                </Container>
            </Container>
        </Card>
    )
}