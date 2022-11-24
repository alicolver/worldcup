import React, { useState, useEffect } from "react"
import { fetchAuthEndpoint, getJWT, resolveEndpoint } from "../utils/Utils"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { Redirect, useHistory } from "react-router-dom"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"

const useStyles = makeStyles({
    table: {
        padding: "5px"
    },
})

const StyledTableCell = withStyles(() => ({
    head: {
        backgroundColor: "#1caac9",
        color: "white",
    },
    body: {
        fontSize: 14,
    },
}))(TableCell)


interface leaderBoardRecord {
    name: string,
    correct_results: number,
    correct_scores: number,
    score: number,
    userid: number,
    is_user: boolean,
}

export default function LeaderBoard(): JSX.Element {
    const classes = useStyles()
    const [invalidResponse, setInvalidResponse] = useState<boolean>(false)
    const [isLive, setIsLive] = useState(false)
    const [leaderboardData, setLeaderboardData] = useState<leaderBoardRecord[]>([])

    const history = useHistory()

    useEffect(() => {
        fetchAuthEndpoint("leaderboard", {
            method: "GET",
        }).then(res => res.json()).then(res => {
            if (res.success === true) {
                setLeaderboardData(res.leaderboard)
            } else {
                setInvalidResponse(true)
            }
        })

        fetchAuthEndpoint("match/in-progress", {
            method: "GET",
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setIsLive(res.matches.length > 0)
            }
        })

    }, [setLeaderboardData])


    function renderLive() {
        if (isLive) {
            return <FiberManualRecordIcon style={{ color: "green", paddingRight: "3vw" }} />
        } else {
            return <></>
        }
    }

    function generateHistoryRedirect(user: leaderBoardRecord) {
        return () => {
            if (user.is_user) {
                history.push("/history/")
            } else {
                history.push("/history/" + user.userid)
            }
        }
    }

    function getRows() {
        return (leaderboardData.map((row, index) => (
            <TableRow key={index} onClick={generateHistoryRedirect(row)} >
                <TableCell>{index === 0 ? index + 1 : (leaderboardData[index - 1].score === row.score ? "=" : index + 1)}</TableCell>
                <TableCell component="th" scope="row">
                    {row.name.split(" ")[0]}
                </TableCell>
                <TableCell align={"left"}>{renderLive()}</TableCell>
                <TableCell>{row.correct_results}</TableCell>
                <TableCell>{row.correct_scores}</TableCell>
                <TableCell align="center"><b>{row.score}</b></TableCell>
            </TableRow>
        )))
    }

    if (invalidResponse) {
        return (
            <Redirect to={"/"} />
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell>Player</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell>R</StyledTableCell>
                        <StyledTableCell>S</StyledTableCell>
                        <StyledTableCell align="center"><b>Pts</b></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getRows()}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
