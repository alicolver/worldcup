import {
    CircularProgress,
    Container,
    makeStyles,
    Typography,
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { ILeague, IPointsData } from "../types/types"
import { getJWT, resolveEndpoint } from "../utils/Utils"

const useStyles = makeStyles({
    container: {
        paddingTop: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#9a0c34",
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
        fetch(resolveEndpoint("points"), {
            method: "GET",
            headers: {
                Authorization: getJWT(),
            },
        }).then((res) => {
            setPointsDataIsLoading(false)
            if (!res.ok) {
                return
            }
            return res.json()
        }).then((res) => {
            console.log(res.data[0])
            setPointsData(res.data[0])
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
                        pointsData.totalPoints
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
                        pointsData.todaysPoints
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
