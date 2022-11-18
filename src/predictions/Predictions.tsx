import { Box, Container, makeStyles, Typography } from "@material-ui/core"
import { useEffect, useState } from "react"
import { IMatchData, IPredictionData } from "../types/types"
import { getJWT, resolveEndpoint } from "../utils/Utils"
import { EMPTY_PREDICTION } from "./Constants"
import Prediction from "./Prediction"

interface IPredictionsProps {
    heading: string,
    matchData: IMatchData[]
}

const useStyles = makeStyles({
    header: {
        paddingTop: '10px',
        paddingBottom: '20px',
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
    const [predictionData, setPredictionData] = useState<Map<string, IPredictionData>>(new Map())
    const [hasFetched, setHasFetched] = useState<boolean>(false)

    function getPredictionCards(matchData: IMatchData[]) {
        return (matchData.map(match => {
            const predData: IPredictionData = predictionData.has(match.matchId) 
                ? predictionData.get(match.matchId)!
                : EMPTY_PREDICTION;
            
            // TODO: this is such a hack but I couldn't get the callback to work
            return hasFetched 
                ? <Prediction key={match.matchId} matchData={match} predictionData={predData}/>
                : <></>
        }))
    }

    useEffect(() => {
        fetch(resolveEndpoint('predictions/fetch'), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': getJWT()
            },
            body: JSON.stringify({
                matchIds: props.matchData.map(data => data.matchId)
            })
        }).then(res => {
            if (!res.ok) {
                setHasFetched(true)
                return
            }
            return res.json().then(res => {
                const asMap: Map<string, IPredictionData> = new Map(Object.entries(res.body))
                setPredictionData(asMap)
                setHasFetched(true)
            })
        })
    }, [setPredictionData, setHasFetched, props.matchData])

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