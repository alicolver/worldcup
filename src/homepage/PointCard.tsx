import {
    CircularProgress,
    Container,
    makeStyles,
    Typography,
} from "@material-ui/core"
import CountUp from "react-countup"
import React, { useEffect, useState } from "react"
import { IPointsData } from "../types/types"
import { MAIN_COLOR } from "../utils/Constants"
import { fetchAuthEndpoint } from "../utils/Auth"

const useStyles = makeStyles({
    container: {
        paddingTop: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: MAIN_COLOR,
        "& > div": {
            width: "25%",
            height: "75px",
            boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
            borderRadius: "5px",
            textAlign: "center",
            verticalAlign: "middle",
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
    },
    middle: {
        width: "40% !important",
        height: "150px !important",
    },
    score: {
        fontSize: "30px",
    },
    middleScore: {
        fontSize: "80px",
    },
    title: {
        color: "#AAAAAA",
        fontWeight: "bold",
    },
})

export default function PointsCard(props: { globalRank: number, globalRankIsLoading: boolean }): JSX.Element {
    const [pointsData, setPointsData] = useState<IPointsData | null>()
    const [pointsDataIsLoading, setPointsDataIsLoading] = useState(true)
    const classes = useStyles()

    useEffect(() => {
        setPointsDataIsLoading(true)
        fetchAuthEndpoint("points", {
            method: "GET",
        }).then((res) => {
            setPointsDataIsLoading(false)
            if (!res.ok) {
                return
            }
            return res.json()
        }).then((res) => {
            setPointsData(res.data)
        })
    }, [setPointsData])

    return (
        <Container className={classes.container}>
            <Container>
                <Typography className={classes.title}>Total</Typography>
                <Typography className={classes.score}>
                    {pointsDataIsLoading ? (
                        <CircularProgress />
                    ) : pointsData?.totalPoints ? (
                        <CountUp
                            end={pointsData.totalPoints}
                            duration={2.5}
                        />
                    ) : (
                        0
                    )}
                </Typography>
            </Container>
            <Container className={classes.middle}>
                <Typography className={classes.title}>Today</Typography>
                <Typography className={classes.middleScore}>
                    {pointsDataIsLoading ? (
                        <CircularProgress />
                    ) : pointsData?.todaysPoints ? (
                        <CountUp
                            end={pointsData.todaysPoints}
                            duration={2.5}
                        />
                    ) : (
                        0
                    )}
                    
                </Typography>
            </Container>
            <Container>
                <Typography className={classes.title}>Rank</Typography>
                <Typography className={classes.score}>
                    {props.globalRankIsLoading ? (
                        <CircularProgress />
                    ) : props.globalRank}
                </Typography>
            </Container>
        </Container>
    )
}
