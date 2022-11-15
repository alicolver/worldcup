import { ThemeProvider, Container, Typography, makeStyles, Button } from "@material-ui/core"
import { fontTheme } from "../homepage/Homepage"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import LeaguePreview from "./LeaguePreview";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    leagueTopDiv: {
      content: "",
      position: 'absolute',
      top: '100%',
      marginTop: '5vh',
      marginLeft: '2vw',
      marginRight: '2vw',
      left: '0',
      width: '96vw',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      borderRadius: '2vw'
    },
    heading: {
        paddingTop: '2vh',
        fontSize: '5vw',
        paddingBottom: '1vh'
    },
    heading2: {
        fontSize: '4vw',
        paddingBottom: '1vh'
    },
    leagueItem: {
        flex: '0 0 50%',
        marginRight: '5px',
        borderRadius: '1vw',
        fontSize: '0.9rem !important',
        verticalAlign: 'top',
        fontWeight: 'bold'
    },
    leagueConfig: {
        display: 'flex',
        textAlign: 'center',
        width: '100%',
        justifyContent: 'space-around',
        fontSize: '3vw'
    },
    iconStyle: {
        verticalAlign: 'bottom'
    },
    leagueContainer: {
        paddingTop: '2vh'
    }
});


export default function League() {
    const classes = useStyles()
    const history = useHistory()

    return (
        <ThemeProvider theme={fontTheme}>
            <Container className={classes.leagueTopDiv}>
                <Typography className={classes.heading}>Leagues</Typography>
                <Container className={classes.leagueConfig}>
                    <Button variant="outlined" className={classes.leagueItem} onClick={() => history.push('/league/create')}>
                        <Typography><SettingsApplicationsIcon className={classes.iconStyle}/>Create League</Typography>
                    </Button>
                    <Button variant="outlined" className={classes.leagueItem} onClick={() => history.push('/league/join')}>
                        <Typography><ControlPointIcon className={classes.iconStyle}/>Join League</Typography>
                    </Button>
                </Container>
                <Container className={classes.leagueContainer}>
                    <Typography className={classes.heading2}>Your Leagues</Typography>
                    <LeaguePreview />
                </Container>
            </Container>
        </ThemeProvider>
    )
}