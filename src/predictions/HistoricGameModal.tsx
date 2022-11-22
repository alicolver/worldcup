import { Dialog, makeStyles, MenuItem, Select } from "@material-ui/core"
import React, { ReactFragment, useEffect, useState } from "react"
import { ILeague, IMatchData, IUserPrediction } from "../types/types"
import { getJWT, resolveEndpoint } from "../utils/Utils"
import HistoricGame from "./HistoricGame"
import PredictionsTable from "./PredictionsTable"

interface IHistoricGamePageProps {
    matchData: IMatchData;
    leagueData: ILeague[];
    handleClose: () => void;
}

const useStyles = makeStyles({
    modalRoot: {
        textAlign: "center",
        top: "10%",
        position: "absolute",
        width: "90%",
        marginBottom: "10%",
        overflow: "scroll",
        maxHeight: "80%"
    },
    confirm: {
        margin: "auto"
    },
    selector: {
        width: "80%",
        margin: "auto"
    }
})

export default function HistoricGameModal(props: IHistoricGamePageProps): JSX.Element {
    const classes = useStyles()
    const [selectedLeague, setSelectedLeague] = useState<ILeague>(props.leagueData[0])
    const [predictionData, setPredictionData] = useState<IUserPrediction[]>([])

    useEffect(() => {
        fetch(resolveEndpoint("predictions/get-match-predictions-for-league"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getJWT(),
            },
            body: JSON.stringify({
                leagueId: selectedLeague.leagueId,
                matchId: props.matchData.matchId,
            })
        }).then(res => {
            if (!res.ok) return            
            res.json().then(res => {
                const predData: IUserPrediction[] = res.data
                const filtered: IUserPrediction[] = predData.filter(data => (
                    typeof data.awayScore !== "undefined" && typeof data.homeScore !== "undefined" &&
                    data.awayScore !== null && data.homeScore !== null
                ))
                setPredictionData(filtered)
            })
        })
    }, [setPredictionData, selectedLeague, props.matchData.matchId])
    
    function getSelection(): ReactFragment {
        return props.leagueData.map(league => (
            <MenuItem value={league.leagueId} key={league.leagueId}>{league.leagueName}</MenuItem>
        ))
    }

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
        const newLeague: ILeague | undefined = props.leagueData.find(league => league.leagueId === event.target.value as string)
        if (!newLeague) return
        setSelectedLeague(newLeague)
    }

    return(
        <Dialog
            open
            onClose={props.handleClose}
            classes={{ paper: classes.modalRoot}}
        >
            <HistoricGame matchData={props.matchData} />
            <Select
                value={selectedLeague.leagueId}
                onChange={handleChange}
                autoWidth
                label="League"
                className={classes.selector}
            >
                {getSelection()}
            </Select>
            <PredictionsTable predictionData={predictionData} />
        </Dialog>
    )
}