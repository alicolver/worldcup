import {
    Container,
    createMuiTheme,
    makeStyles,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    TableCell,
    TablePagination,
} from "@material-ui/core"
import { ReactFragment, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Header from "../misc/Header"
import { capitalizeFirstLetter } from "../utils/Utils"
import { LinearProgress } from "@mui/material"
import React from "react"
import { getMovement } from "../utils/LeaderboardMovement"
import { fetchAuthEndpoint } from "../utils/Auth"

export const fontTheme = createMuiTheme({
    typography: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    },
})

interface IUserDataInLeague {
  familyName: string;
  userId: string;
  leagueIds: string[];
  givenName: string;
  totalPoints: number;
  rank: number;
  previousTotalPoints: number;
  yesterdayRank: number;
}

interface IGetLeagueData {
  leagueId: string;
  leagueName: string;
  users: IUserDataInLeague[];
}

const useStyles = makeStyles({
    heading: {
        marginTop: "1.75rem",
        paddingTop: "1rem",
        fontSize: "2rem",
        paddingBottom: "1rem",
    },
    subHeading: {
        fontSize: "1.5rem",
    },
    standings: {
        position: "relative",
        left: 0,
        width: "100%",
    },
    leagueContainer: {
        paddingTop: "1rem",
    },
    leagueTopDiv: {
        content: "",
        top: "100%",
        marginTop: "1.5rem",
        paddingLeft: "0 !important",
        paddingRight: "0 !important",
        left: "0",
        width: "95%",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: "2vw",
    },
    table: {
        marginBottom: "2rem",
    },
})

export const Standings = (): JSX.Element => {
    const classes = useStyles()
    const [leagueData, setLeagueData] = useState<IGetLeagueData | undefined>(
        undefined
    )
    const [isLoading, setIsLoading] = useState(false)
    const search = new URLSearchParams(useLocation().search)
    const leagueId = search.get("leagueId")
    const leagueName = leagueData === undefined ? "" : leagueData.leagueName
    const [currentPage, setCurrentPage] = useState<number>(0)
    const rowsPerPage = 10

    useEffect(() => {
        setIsLoading(true)
        fetchAuthEndpoint("league/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                leagueId: leagueId,
            }),
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
                    setLeagueData(res.data)
                }
            })
    }, [leagueId])

    function getRows(): ReactFragment {
        if (leagueData === undefined) {
            return []
        }
        return leagueData.users
            .sort((a, b) => a.rank - b.rank)
            .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
            .map((user, index) => {
                return (
                    <TableRow key={user.userId}>
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
                                {getMovement(user.rank, user.yesterdayRank)}
                                <div style={{ paddingLeft: "0.6rem" }}>
                                    {index === 0
                                        ? user.rank
                                        : leagueData.users[index + currentPage * rowsPerPage - 1]
                                            .rank === user.rank
                                            ? "="
                                            : index + currentPage * rowsPerPage + 1}
                                </div>
                            </Container>
                        </TableCell>
                        <TableCell
                            style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
                        >
                            {capitalizeFirstLetter(user.givenName)}{" "}
                            {capitalizeFirstLetter(user.familyName)}
                        </TableCell>
                        <TableCell>{user.totalPoints}</TableCell>
                    </TableRow>
                )
            })
    }

    return (
        <>
            <Header />
            <Toolbar />
            <Container className={classes.standings} maxWidth="xs">
                <Container>
                    <Typography className={classes.heading}>Standings</Typography>
                    <Typography className={classes.subHeading}>
                        League - {leagueName}
                    </Typography>
                </Container>
                <Container className={classes.leagueTopDiv}>
                    <Container className={classes.leagueContainer}>
                        <Container className={classes.table}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <b>Rank</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Name</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Score</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading && (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <LinearProgress color="inherit" />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!isLoading && getRows()}
                                </TableBody>
                                {leagueData && leagueData?.users.length > 10 && (
                                    <TablePagination
                                        count={leagueData?.users.length || 0}
                                        rowsPerPage={rowsPerPage}
                                        page={currentPage}
                                        onChangePage={(ignored, page) => setCurrentPage(page)}
                                        rowsPerPageOptions={[]}
                                    />
                                )}
                            </Table>
                        </Container>
                    </Container>
                </Container>
            </Container>
        </>
    )
}
