import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

const useStyles = makeStyles({

});

export default function LeaguePreview() {
    const classes = useStyles()

    return (
        <TableContainer>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>League</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                
                </TableBody>
            </Table>
        </TableContainer>
    )
}