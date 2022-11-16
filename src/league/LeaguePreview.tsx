import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { useState, useEffect, ReactFragment } from "react";
import { useHistory } from "react-router-dom";
import { ILeague, IUserData } from "../types/types";
import { getJWT, resolveEndpoint } from "../utils/Utils";
import ShareIcon from '@material-ui/icons/Share';
import { HOST_URL } from "../utils/Constants";

const useStyles = makeStyles({

});

export default function LeaguePreview() {
    const classes = useStyles()
    const history = useHistory()
    const [leagueData, setLeagueData] = useState<ILeague[]>([])

    useEffect(() => {
        fetch(resolveEndpoint('user/get-leagues'), {
            method: 'POST',
            headers: {
                'Authorization': getJWT()
            }
        }).then(res => {
            if (!res.ok) {
                return null
            }
            return res.json()
        }).then(res => {
            if (res !== null) {
                setLeagueData(res.data.leagues)
            }
        })
    }, [setLeagueData])

    function getRows(): ReactFragment {
        return (leagueData.map((data, index) => (
            <TableRow>
                <TableCell>{data.currentRanking}</TableCell>
                <TableCell onClick={() => history.push('/standings?leagueId=' + data.leagueId)}>{data.leagueName}</TableCell>
                <TableCell>{data.leagueId === "global" ? "" : <ShareIcon onClick={() => navigator.clipboard.writeText(`${HOST_URL}league/join?leagueId=${data.leagueId}`)} />}</TableCell>
            </ TableRow>
        )))
    }

    return (
        <TableContainer>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell><b>Rank</b></TableCell>
                        <TableCell><b>League</b></TableCell>
                        <TableCell><b>Invite</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getRows()}
                </TableBody>
            </Table>
        </TableContainer>
    )
}