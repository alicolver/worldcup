import { Box, makeStyles, Typography } from "@material-ui/core"
import React from "react"

interface ITeamProps {
    flag: string
    name: string
    iconToRender?: JSX.Element | null
    callback?: () => void
}

const useStyles = makeStyles({
    team: {
        textAlign: "center",
        position: "relative"
    },
    teamFlag: {
        position: "relative",
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
    },
})

export default function Team(props: ITeamProps): JSX.Element {
    const classes = useStyles()

    function renderIconIfRequired(): JSX.Element {
        if (!props.iconToRender) return <></>
        return props.iconToRender
    }
    
    return (
        <Box 
            className={classes.team} 
            onClick={() => {
                if (!props.callback) return
                props.callback()
            }}
        >
            <img
                alt={props.name} 
                className={classes.teamFlag} 
                src={props.flag}
                style={props.iconToRender ? { opacity: 0.5 } : {}}
            />
            {renderIconIfRequired()}
            <div className={classes.teamName}>
                <Typography>{props.name}</Typography>
            </div>
        </Box>
    )
}