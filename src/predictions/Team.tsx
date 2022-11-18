import { Box, makeStyles, Typography } from "@material-ui/core"

interface ITeamProps {
    flag: string,
    name: string
}

const useStyles = makeStyles({
    team: {
        textAlign: 'center',
    },
    teamFlag: {
        borderRadius: '5px',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
        width: '100px'
    },
    teamName: {
        fontSize: '4vw'
    }
})

export default function Team(props: ITeamProps) {
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