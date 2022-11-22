import { Box, Card, makeStyles, Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { MAIN_COLOR } from "../utils/Constants"
import { getJWT, resolveEndpoint } from "../utils/Utils"

interface IPoints {
    userId: string
    pointsHistory: number[]
    totalPoints: number
    livePoints: number
    todaysPoints: number
}

interface IGraphEntry {
    name: string
    dailyPoints: number
    totalPoints: number
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
                setPoints(res.data)
            })
        })
    }, [setPoints])

    function getGraph(): JSX.Element {
        let totalPoints = 0
        const data: IGraphEntry[] = points.pointsHistory.map((val, index) => { 
            totalPoints += val
            return { name: "Day " + (index + 1).toString(), dailyPoints: val, totalPoints: totalPoints }})
        return (
            <ResponsiveContainer width="100%" height="100%" className={classes.graph}>
                <ComposedChart
                    width={350}
                    height={200}
                    data={data}
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
                    <Bar dataKey="dailyPoints" barSize={20}  fill="#9A0C34" />
                    <Line dataKey="totalPoints" type="monotone"  stroke={MAIN_COLOR} />
                </ComposedChart>
            </ResponsiveContainer>
        )
    }

    return typeof points !== "undefined" && points.pointsHistory.length > 0 
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