import { Box, Card, Checkbox, Grid, OutlinedInput } from "@material-ui/core";
import { useStyles } from "./Game";
import { IMatch } from "./Predictions";
import Team from "./Team";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Route } from "react-router-dom";

const scoreToColour = new Map<number, string>()
scoreToColour.set(0, '#505e73')
scoreToColour.set(1, '#1caac9')
scoreToColour.set(2, '#1caac9')
scoreToColour.set(3, '#16b877')
scoreToColour.set(4, '#ab1db8')
scoreToColour.set(5, '#bfa72e')

export default function FixedGame(props: IMatch) {
    const classes = useStyles()

    function renderUnpredictedScore() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} className={classes.yourScore}>
                    <span className={classes.yourScoreText}
                        style={{
                            backgroundColor: scoreToColour.get(props.prediction?.score || 0)
                        }}
                    >{(props.prediction?.score || 0) + ' pts'}</span>
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
        <Route render={({ history }: { history: any }) => (
            <Card className={classes.matchCard} onClick={() => { history.push('/match/' + props.match.matchid) }}>
                {props.in_progress ?
                    <div style={{ position: 'absolute', left: '6vw', paddingTop: '1vh' }}>
                        <FiberManualRecordIcon style={{ color: 'green' }} />
                    </div> :
                    <></>
                }
                <Box className={classes.match}>
                    <Box className={classes.fixedGameTeamName}>
                        <Team name={props.team_one.name} emoji={props.team_one.emoji} />
                    </Box>
                    {renderUnpredictedScore()}
                    <Box className={classes.fixedGameTeamName}>
                        <Team name={props.team_two.name} emoji={props.team_two.emoji} />
                    </Box>
                </Box>
                {
                    props.match.is_knockout &&
                    <Box>
                        <Checkbox
                            checked={props.prediction?.penalty_winners === 1}
                            disabled
                        />
                        Penalty Winners
                        <Checkbox
                            checked={props.prediction?.penalty_winners === 2}
                            disabled
                        />
                    </Box>
                }
            </Card>
        )} />
    )
}