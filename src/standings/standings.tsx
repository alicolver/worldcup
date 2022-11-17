import { Container, createMuiTheme, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, ThemeProvider, Typography } from "@material-ui/core"
import { Key, ReactFragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../misc/Header";
import { capitalizeFirstLetter, getJWT, resolveEndpoint } from "../utils/Utils";

export const fontTheme = createMuiTheme({
    typography: {
        fontFamily: [
            'Source Sans Pro',
            'sans-serif',
        ].join(','),
    },
});

interface userData {
    familyName: string
    userId: string
    leagueIds: string[]
    givenName: string
}

interface getLeagueData {
    leagueId: string
    leagueName: string
    users: userData[]
}

const useStyles = makeStyles({
    heading: {
        marginTop: '3vh',
        paddingTop: '2vh',
        fontSize: '8vw',
        paddingBottom: '1vh',
        fontWeight: 'bolder'
    },
    subHeading: {
        fontSize: '5vw',
    },
    standings: {
        position: 'absolute',
        top: '15vw',
        left: 0,
        width: '100%',
        marginBottom: '30vw'
    },
    tableContainer: {
        content: "",
        position: 'absolute',
        top: '100%',
        marginTop: '2vh',
        marginLeft: '2vw',
        marginRight: '2vw',
        left: '0',
        width: '96vw',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        borderRadius: '2vw'
    },
})

export const Standings = () => {
    const classes = useStyles()
    const [leagueData, setLeagueData] = useState<getLeagueData | undefined>(undefined)
    const search = new URLSearchParams(useLocation().search)
    const leagueId = search.get("leagueId")
    console.log({
        leagueId: leagueId,
    })
    const leagueName = leagueData === undefined ? "" : leagueData.leagueName

    useEffect(() => {
        fetch(resolveEndpoint("league/get"), {
            method: "POST",
            headers: {
                Authorization: getJWT(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                leagueId: leagueId,
            })
        })
            .then((res) => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            })
            .then((res) => {
                if (res !== null) {
                    console.log(res)
                    setLeagueData(res.data);
                }
            });
    }, [leagueId])

    function getRows(): ReactFragment {
        if (leagueData === undefined) {
            return []
        }
        return leagueData.users.map((user) => {
            return (
                <TableRow key={user.userId}>
                    <TableCell>=1</TableCell>
                    <TableCell>{capitalizeFirstLetter(user.givenName)} {capitalizeFirstLetter(user.familyName)}</TableCell>
                    <TableCell>0</TableCell>
                </TableRow>
            )
        })
    }

    return (
        <ThemeProvider theme={fontTheme}>
            <Header />
            <Container className={classes.standings}>
                <ThemeProvider theme={fontTheme}>
                    <Container>
                        <Typography className={classes.heading}>Standings</Typography>
                        <Typography className={classes.subHeading}>League - {leagueName}</Typography>
                    </Container>
                    <Container className={classes.tableContainer}>
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
                            <TableBody>{getRows()}</TableBody>
                        </Table>
                    </Container>
                </ThemeProvider>
            </Container>
        </ThemeProvider>
    )
}