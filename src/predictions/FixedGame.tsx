import { Box, Card, OutlinedInput } from "@material-ui/core";
import { dateToOrdinal } from "../utils/Utils";
import { useStyles } from "./Game";
import { IMatch } from "./Predictions";
import Team from "./Team";

export default function FixedGame(props: IMatch) {
    const classes = useStyles()

    function renderUnpredictedScore() {
        return (
            <>
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    type="number"
                    value={props.prediction?.team_one_pred}
                    readOnly
                    />
                <OutlinedInput
                    className={classes.teaminput}
                    id="outlined-basic"
                    type="number"
                    value={props.prediction?.team_two_pred}
                    readOnly
                     />
            </>
        )
    }

    function getDate(): string {
       return props.match.match_date.split('-')[2]
    }

    return (
        <Card className={classes.matchCard}>
            <Box className={classes.date}>
                {getDate() + dateToOrdinal(parseInt(getDate())) + ' ' + props.match.kick_off_time.substring(0, props.match.kick_off_time.length - 3)}
            </Box>
            <Box className={classes.match}>
                <Box>
                    <Team name={props.team_one.name} emoji={props.team_one.emoji} />
                </Box>
                {renderUnpredictedScore()}
                <Box>
                    <Team name={props.team_two.name} emoji={props.team_two.emoji} />
                </Box>
            </Box>
        </Card>
    )
}