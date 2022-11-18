import {
    Container,
    makeStyles,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core"
import { useState, useEffect, ReactFragment } from "react"
import { useHistory } from "react-router-dom"
import { ILeague } from "../types/types"
import { getJWT, resolveEndpoint } from "../utils/Utils"
import ShareIcon from "@material-ui/icons/Share"
import { HOST_URL } from "../utils/Constants"
import { Alert, LinearProgress } from "@mui/material"
import React from "react"
import { getMovement } from "../utils/LeaderboardMovement"

const useStyles = makeStyles({
    table: {
        marginBottom: "1rem",
        position: "relative",
        paddingBottom: "5px"
    },
})

export default function LeaguePreview(): JSX.Element {
    const classes = useStyles()
    const history = useHistory()
    const [leagueData, setLeagueData] = useState<ILeague[]>([])
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetch(resolveEndpoint("user/get-leagues"), {
            method: "POST",
            headers: {
                Authorization: getJWT(),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return null
                }
                return res.json()
            })
            .then((res) => {
                setIsLoading(false)
                if (res !== null) {
                    setLeagueData(res.data.leagues)
                }
            })
    }, [setLeagueData])

    const handleShareClick = (link: string) => {
        setOpen(true)
        navigator.clipboard.writeText(link)
    }

    function getRows(): ReactFragment {
        return leagueData.map((data, index) => (
            <TableRow key={data.leagueId}>
                <TableCell>
                    <Container
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            width: "100%",
                            textAlign: "left",
                            padding: "0",
                        }}
                    >
                        {getMovement(data.currentRanking, data.previousRanking)}
                        <div style={{ paddingLeft: "0.6rem" }}>
                            {data.users.filter((user) => user.rank === data.currentRanking)
                                .length === 1
                                ? data.currentRanking
                                : "=" + data.currentRanking}
                        </div>
                    </Container>
                </TableCell>
                <TableCell
                    onClick={() => history.push("/standings?leagueId=" + data.leagueId)}
                    style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
                >
                    {data.leagueName}
                </TableCell>
                <TableCell>
                    {data.leagueId === "global" ? (
                        ""
                    ) : (
                        <ShareIcon
                            onClick={() =>
                                handleShareClick(
                                    `${HOST_URL}league/join?leagueId=${data.leagueId}`
                                )
                            }
                        />
                    )}
                </TableCell>
            </TableRow>
        ))
    }

    return (
        <TableContainer className={classes.table}>
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity="success"
                    sx={{
                        width: "300px",
                        "& .MuiAlert-message": { textAlign: "center", width: "inherit" },
                    }}
                >
          League link copied to clipboard!
                </Alert>
            </Snackbar>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <b>Rank</b>
                        </TableCell>
                        <TableCell>
                            <b>League</b>
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <LinearProgress color="inherit" />
                            </TableCell>
                        </TableRow>
                    )
                    }

                    {!isLoading && getRows()}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
