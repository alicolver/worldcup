import { Box, Card, makeStyles, Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { MAIN_COLOR } from "../utils/Constants"
import { getJWT, resolveEndpoint } from "../utils/Utils"

interface IPoints {
    userId: string;
    pointsHistory: number[]
    totalPoints: number,
    livePoints: number,
    todaysPoints: number
}

interface IGraphEntry {
    name: string,
    points: number
}

const defaultPoints: IPoints = {
    userId: "",
    pointsHistory: [],
    totalPoints: 0,
    livePoints: 0,
    todaysPoints: 0
}

const useStyles = makeStyles({
    heading: {
        fontSize: "2rem",
        paddingBottom: "1rem",
    },
    card: {
        width: "100%",
        height: "250px",
        marginBottom: "10px",
        margin: "auto",
        borderRadius: "8px"
    },
    graph: {
        marginTop: "10px",
        marginBottom: "10px"
    },
    graphLabel: {
        marginLeft: "10%",
        marginTop: "10px",
        fontSize: "1rem"
    }
})

export default function Analytics(): JSX.Element {
    const classes = useStyles()
    const [points, setPoints] = useState<IPoints>(defaultPoints)

    useEffect(() => {
        fetch(resolveEndpoint("points"), {
            method: "GET",
            headers: {
                Authorization: getJWT()
            }
        }).then(res => {
            if (!res.ok) return
            res.json().then(res => {
                setPoints(res.data[0])
            })
        })
    }, [setPoints])

    function getGraph(): JSX.Element {
        const graphEntries: IGraphEntry[] = points.pointsHistory.map((val, index) => ({ name: "Day " + (index + 1).toString(), points: val }))
        console.log(graphEntries)
        return (
            <ResponsiveContainer width="100%" height="100%" className={classes.graph}>
                <LineChart
                    data={graphEntries}
                    width={350}
                    height={200}
                    style={{  fontFamily: "sans-serif" }}
                    margin={{
                        top: 5,
                        right: 25,
                        left: -10,
                        bottom: 50
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="points" stroke={MAIN_COLOR} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        )
    }

    return points.pointsHistory.length > 0 
        ? (
            <Box>
                <Typography className={classes.heading}>Analytics</Typography>
                <Card className={classes.card}>
                    <Typography className={classes.graphLabel}>Daily Points</Typography>
                    {getGraph()}
                </Card>
            </Box>
        ) : <></>
}