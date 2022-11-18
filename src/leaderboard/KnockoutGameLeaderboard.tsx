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
  penalty_winners: number,
}

interface KnockoutGameLeaderboardProps {
  entries: ILeaderBoardRecord[]
  team_one_emoji: string
  team_two_emoji: string
}

export default function KnockoutGameLeaderBoard(props: KnockoutGameLeaderboardProps): JSX.Element {
    const classes = useStyles()

    function getPenaltyWinnerIcon(penalty_winners: number): string {
        if (penalty_winners === 0) {
            return ""
        }
        if (penalty_winners === 1) {
            return props.team_one_emoji
        }
        if (penalty_winners === 2) {
            return props.team_two_emoji
        }
        return "error"
    }

    function getRows(): JSX.Element[] {
        return (props.entries.map((row, index) => (
            <TableRow key={index} >
                <TableCell component="th" scope="row">
                    {row.name.split(" ")[0]}
                </TableCell>
                <TableCell>{row.predicted_score}</TableCell>
                <TableCell>{getPenaltyWinnerIcon(row.penalty_winners)}</TableCell>
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
                        <StyledTableCell>Pens</StyledTableCell>
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
