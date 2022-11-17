import { Box, makeStyles, Typography } from "@material-ui/core"
import { BorderColor } from "@material-ui/icons"

interface ITeamProps {
    flag: string,
    name: String
}

const useStyles = makeStyles({
    team: {
        textAlign: 'center',
        width: '25vw'
    },
    teamFlag: {
        borderRadius: '5px',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
    },
    teamName: {
        fontSize: '4vw'
    }
})

export default function Team(props: ITeamProps) {
    const classes = useStyles()

    return (
        <Box className={classes.team}>
            <img className={classes.teamFlag} src={props.flag} />
            <div className={classes.teamName}>
                <Typography>{props.name}</Typography>
            </div>
        </Box>
    )
}