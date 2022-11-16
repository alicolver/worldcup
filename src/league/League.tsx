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
      marginTop: '2vh',
      marginLeft: '2vw',
      marginRight: '2vw',
      left: '0',
      width: '96vw',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      borderRadius: '2vw'
    },
    heading: {
        marginTop: '3vh',
        paddingTop: '2vh',
        fontSize: '8vw',
        paddingBottom: '1vh',
        fontWeight: 'bolder'
    },
    leagueItem: {
        flex: '0 0 50%',
        marginRight: '5px',
        borderRadius: '1vw',
        verticalAlign: 'top',
        fontWeight: 'bold',
        margin: 'auto'
    },
    leagueConfig: {
        display: 'flex',
        textAlign: 'center',
        width: '100%',
        justifyContent: 'space-around',
        fontSize: '3vw',
        marginTop: '2vh',
        paddingLeft: '0vw',
        paddingRight: '0vw'
    },
    iconStyle: {
        verticalAlign: 'bottom'
    },
    leagueContainer: {
        paddingTop: '2vh'
    },
    button: {
        borderRadius: '3vw',
        minWidth: '40vw',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        fontWeight: 'bold',
        backgroundColor: 'rgb(154,12,52)',
        color: 'white'
    }
});

export default function League() {
    const classes = useStyles()
    const history = useHistory()

    return (
        <ThemeProvider theme={fontTheme}>
            <Container>
                <Typography className={classes.heading}>Leagues</Typography>
                <Container className={classes.leagueConfig}>
                        <Button className={classes.button} onClick={() => history.push('/league/create')}>
                            <Typography><SettingsApplicationsIcon className={classes.iconStyle}/>Create</Typography>
                        </Button>
                        <Button className={classes.button} onClick={() => history.push('/league/join')}>
                            <Typography><ControlPointIcon className={classes.iconStyle}/>Join</Typography>
                        </Button>
                </Container>
                <Container className={classes.leagueTopDiv}>
                    <Container className={classes.leagueContainer}>
                        <LeaguePreview />
                    </Container>
                </Container>
            </Container>
        </ThemeProvider>
    )
}