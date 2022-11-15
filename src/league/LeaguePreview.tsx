import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { useState, useEffect, ReactFragment } from "react";
import { ILeague, IUserData } from "../types/types";
import { getJWT, resolveEndpoint } from "../utils/Utils";

const useStyles = makeStyles({

});

export default function LeaguePreview() {
    const classes = useStyles()
    const [leagueData, setLeagueData] = useState<ILeague[]>([])

    useEffect(() => {
        fetch(resolveEndpoint('user/get-leagues'), {
            method: 'POST',
            headers: {
                'Authorization': getJWT()
            }
        }).then(res => res.json())
        .then(res => setLeagueData(res.data.leagues))
    }, [setLeagueData])

    function getRows(): ReactFragment {
        return (leagueData.map((data, index) => (
            <TableRow>
                <TableCell>{index}</TableCell>
                <TableCell>{data.leagueName}</TableCell>
            </ TableRow>
        )))
    }

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
                {getRows()}
                </TableBody>
            </Table>
        </TableContainer>
    )
}