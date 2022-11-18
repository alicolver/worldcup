import { makeStyles, withStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import React from "react"

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


interface ILeaderBoardRecord {
  name: string,
  correct_result: boolean,
  correct_score: boolean,
  predicted_score: string,
  score?: number
}

interface ISingleGameLeaderboardProps {
    entries: ILeaderBoardRecord[]
}

export default function SingleGameLeaderBoard(props: ISingleGameLeaderboardProps): JSX.Element {
    const classes = useStyles()

    function getRows(): JSX.Element[] {
        return (props.entries.map((row, index) => (
            <TableRow key={index} >
                <TableCell component="th" scope="row">
                    {row.name.split(" ")[0]}
                </TableCell>
                <TableCell>{row.predicted_score}</TableCell>
                <TableCell>{row.correct_result ? "Y" : "N"}</TableCell>
                <TableCell>{row.correct_score ? "Y" : "N"}</TableCell>
                <TableCell>{row.score}</TableCell>
            </TableRow>
        )))
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Player</StyledTableCell>
                        <StyledTableCell>Pred.</StyledTableCell>
                        <StyledTableCell>R</StyledTableCell>
                        <StyledTableCell>S</StyledTableCell>
                        <StyledTableCell><b>P</b></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getRows()}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
