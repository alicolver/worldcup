import { Box, Card, makeStyles } from "@material-ui/core";
import { IMatch } from "./Predictions";
import Team from "./Team";

const useStyles = makeStyles({
    match: {
        width: '80vw',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '3vh'
    },
    game: {
        width: '80vw',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '5vh',
        position: 'relative'
    },
    teaminput: {
        width: '10vw',
        height: '8vw',
        fontSize: '4vw',
        marginTop: '6vw'
    },
    dash: {
        fontSize: '8vw',
        marginTop: '4vw'
    },
    date: {
        fontSize: '5vw',
        marginBottom: '1.5vh',
        verticalAlign: 'center',
        position: 'relative'
    },
    matchCard: {
        marginBottom: '4vh',
        textAlign: 'center'
    }
})

export default function FixedGame(props: IMatch) {
    const classes = useStyles()

    function renderPredictedScore() {
        return (
            <span className={classes.dash}>{props.prediction?.team_one_pred + '-' + props.prediction?.team_two_pred}</span>
        )
    }

    return (
        <Card className={classes.matchCard}>
            <Box className={classes.match}>
                <Box>
                    <Team name={props.team_one.name} emoji={props.team_one.emoji} />
                </Box>
                {renderPredictedScore()}
                <Box>
                    <Team name={props.team_two.name} emoji={props.team_two.emoji} />
                </Box>
            </Box>
            <Box className={classes.date}>
                {props.match.match_date + ' ' + props.match.kick_off_time.substring(0, props.match.kick_off_time.length - 3)}
            </Box>
        </Card>
    )
}