import { Container, makeStyles, Typography } from "@material-ui/core"
import React from "react"

const useStyles = makeStyles({
    container: {
        paddingTop: "30px",
        display: "flex",               
        justifyContent: "space-between",
        alignItems: "center",
        color: "#9a0c34",
        "& > div": {
            width: "25%",
            height: "75px",
            boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
            borderRadius: "5px",
            textAlign: "center",
            verticalAlign: "middle",
            overflow: "hidden",
            whiteSpace: "nowrap"
        }
    },
    middle: {
        width: "40% !important",
        height: "150px !important",
    },
    score: {
        fontSize: "30px"
    },
    middleScore: {
        fontSize: "80px"
    },
    title: {
        color: "#AAAAAA",
        fontWeight: "bold"
    }
})

export default function PointsCard(): JSX.Element {
    const classes = useStyles()

    return (
        <Container className={classes.container}>
            <Container>
                <Typography className={classes.title}>Total</Typography>
                <Typography className={classes.score}>0</Typography>
            </Container>
            <Container className={classes.middle}>
                <Typography className={classes.title}>Today</Typography>
                <Typography className={classes.middleScore}>0</Typography>
            </Container>
            <Container>
                <Typography className={classes.title}>Rank</Typography>
                <Typography className={classes.score}>=1</Typography>
            </Container>
        </Container>
    )
}