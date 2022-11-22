import { Container, Typography, makeStyles, Button, Grid } from "@material-ui/core"
import ControlPointIcon from "@mui/icons-material/ControlPoint"
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications"
import LeaguePreview from "./LeaguePreview"
import { useHistory } from "react-router-dom"
import React from "react"
import { ILeague } from "../types/types"

const useStyles = makeStyles({
    leagueTopDiv: {
        content: "",
        position: "relative",
        top: "100%",
        marginTop: "1.5rem",
        left: "0",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: "2vw",
    },
    heading: {
        marginTop: "1.75rem",
        fontSize: "2rem",
        paddingBottom: "1rem",
    },
    leagueItem: {
        flex: "0 0 50%",
        marginRight: "5px",
        borderRadius: "1vw",
        verticalAlign: "top",
        fontWeight: "bold",
        margin: "auto",
    },
    leagueConfig: {
        display: "flex",
        textAlign: "center",
        width: "100%",
        justifyContent: "space-around",
        marginTop: "qrem",
        paddingLeft: "0vw",
        paddingRight: "0vw",
    },
    iconStyle: {
        verticalAlign: "bottom",
    },
    leagueContainer: {
        paddingTop: "1rem",
    },
    button: {
        borderRadius: "1rem",
        width: "100%",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        fontWeight: "bold",
        backgroundColor: "rgb(154,12,52)",
        color: "white",
    },
})

export default function League(props: { leagueData: ILeague[], leagueDataIsLoading: boolean }): JSX.Element {
    const classes = useStyles()
    const history = useHistory()

    return (
        <>
            <Typography className={classes.heading}>Leagues</Typography>
            <Container className={classes.leagueConfig}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            className={classes.button}
                            onClick={() => history.push("/league/create")}
                        >
                            <SettingsApplicationsIcon className={classes.iconStyle} />
                            <Typography style={{ paddingLeft: "0.1rem" }}>Create</Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            className={classes.button}
                            onClick={() => history.push("/league/join")}
                        >
                            <ControlPointIcon className={classes.iconStyle} />
                            <Typography style={{ paddingLeft: "0.1rem" }}>Join</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <Container className={classes.leagueTopDiv}>
                <Container className={classes.leagueContainer}>
                    <LeaguePreview leagueData={props.leagueData} leagueDataIsLoading={props.leagueDataIsLoading} />
                </Container>
            </Container>
        </>
    )
}
