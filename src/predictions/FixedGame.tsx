import { Box, Card, Grid, OutlinedInput } from "@material-ui/core";
import { useStyles } from "./Game";
import { IMatch } from "./Predictions";
import Team from "./Team";

export default function FixedGame(props: IMatch) {
    const classes = useStyles()

    function renderUnpredictedScore() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} className={classes.yourScore}>
                    <span className={classes.yourScoreText}
                        style={{
                            backgroundColor: props.prediction?.score === 3 ? '#16b877' : props.prediction?.score === 1 ? '#1caac9' : '#505e73'
                        }}
                    >{props.prediction?.score + ' pts'}</span>
                </Grid>
                <Grid item xs={6}>
                    <OutlinedInput
                        className={classes.fixedTeaminput}
                        id="outlined-basic"
                        type="number"
                        value={props.prediction?.team_one_pred}
                        readOnly
                    />
                </Grid>
                <Grid item xs={6}>
                    <OutlinedInput
                        className={classes.fixedTeaminput}
                        id="outlined-basic"
                        type="number"
                        value={props.prediction?.team_two_pred}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12}>
                    <span className={classes.resultText}>{(props.match.team_one_goals || 0) + '-' + (props.match.team_two_goals || 0)}</span>
                </Grid>
            </Grid>
        )
    }

    return (
        <Card className={classes.matchCard}>
            <Box className={classes.match}>
                <Box className={classes.fixedGameTeamName}>
                    <Team name={props.team_one.name} emoji={props.team_one.emoji} />
                </Box>
                {renderUnpredictedScore()}
                <Box className={classes.fixedGameTeamName}>
                    <Team name={props.team_two.name} emoji={props.team_two.emoji} />
                </Box>
            </Box>
        </Card>
    )
}