import { Container, makeStyles, Typography } from '@material-ui/core'
import './styles/card.css'

const useStyles = makeStyles({
    container: {
        display: 'flex',                
        flexDirection: 'row',            /* default value; can be omitted */
        flexWrap: 'nowrap',              /* default value; can be omitted */
        justifyContent: 'space-between',
        alignItems: 'center',
        '& > div': {
            width: '25%',
            height: '75px',
            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
            borderRadius: '5px',
            textAlign: 'center',
            verticalAlign: 'middle',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
        }
    },
    middle: {
        width: '40% !important',
        height: '150px !important',
    },
    score: {
        color: '#9a0c34',
    },
    title: {
        color: '#AAAAAA',
    }
})

export default function PointsCard() {
    const classes = useStyles()

    return (
        <Container className={classes.container}>
            <Container>
                <Typography className={classes.title}>Total</Typography>
                <Typography className={classes.score}>109</Typography>
            </Container>
            <Container className={classes.middle}>
                <Typography className={classes.title}>Today</Typography>
                <Typography className={classes.score}>9</Typography>
            </Container>
            <Container>
                <Typography className={classes.title}>Rank</Typography>
                <Typography className={classes.score}>9</Typography>
            </Container>
        </Container>
    )
}