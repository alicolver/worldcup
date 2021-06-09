import { Box, makeStyles } from "@material-ui/core"

interface ITeamProps {
    emoji: String,
    name: String
}

const useStyles = makeStyles({
    team: {
        textAlign: 'center',
        width: '25vw'
    },
    teamEmoji: {
        fontSize: '15vw'
    },
    teamName: {
        fontSize: '4vw'
    }
})

export default function Team(props: ITeamProps) {
    const classes = useStyles()

    return (
        <Box className={classes.team}>
            <div className={classes.teamEmoji}>
                {props.emoji}
            </div>
            <div className={classes.teamName}>
                {props.name}
            </div>
        </Box>
    )
}