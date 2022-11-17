import { Box, Container, makeStyles, Typography } from "@material-ui/core"
import { IMatchData } from "../types/types"
import PredictionCard from "./Prediction"

interface IPredictionsProps {
    heading: string,
    matchData: IMatchData[]
}

const useStyles = makeStyles({
    header: {
        paddingTop: '10px',
        position: 'relative'
    },
    heading: {
        marginTop: "1rem",
        paddingTop: "1rem",
        fontSize: "2rem",
        paddingBottom: "1rem",
    }
})

export default function Predictions(props: IPredictionsProps) {
    const classes = useStyles()

    function getPredictionCards(matchData: IMatchData[]) {
        return (matchData.map(match => <PredictionCard matchData={match}/>))
    }

    return props.matchData.length > 0 
        ? (
            <Box m={-2}>
            <Container className={classes.header}>
                <Typography className={classes.heading}>{props.heading}</Typography>
                {getPredictionCards(props.matchData)}
            </ Container>
            </Box>
        ) 
        : (<></>)
}