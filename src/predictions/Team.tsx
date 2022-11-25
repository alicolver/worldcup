import { Box, makeStyles, Typography } from "@material-ui/core"
import React from "react"

interface ITeamProps {
    flag: string,
    name: string
}

const useStyles = makeStyles({
    team: {
        textAlign: "center",
    },
    teamFlag: {
        borderRadius: "5px",
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
        width: "100px",
        "@media (max-width: 380px)": {
            width: "90px"
        },
        "@media (max-width: 340px)": {
            width: "80px"
        },
        "@media (max-width: 310px)": {
            width: "40px"
        }
    },
    teamName: {
        fontSize: "4vw"
    }

})

export default function Team(props: ITeamProps): JSX.Element {
    const classes = useStyles()

    return (
        <Box className={classes.team}>
            <img alt={props.name} className={classes.teamFlag} src={props.flag} />
            <div className={classes.teamName}>
                <Typography>{props.name}</Typography>
            </div>
        </Box>
    )
}