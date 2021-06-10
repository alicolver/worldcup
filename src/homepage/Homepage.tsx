import { Container, createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import logo from '../img/logo.svg';
import BottomNav from '../misc/BottomNav';
import Prediction from '../predictions/Predictions';

const useStyles = makeStyles({
  logo: {
    maxHeight: '15vw'
  },
  homepage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
});

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Source Sans Pro',
      'sans-serif',
    ].join(','),
  },
});

function Homepage() {
  const classes = useStyles();
    return (
      <ThemeProvider theme={theme}>
      <Container className={classes.homepage}>
        <img className={classes.logo} src={logo} alt={'euro logo'}/>
        <Prediction />
      </Container>
      <BottomNav value={'/home'}/>
      </ThemeProvider>
    )
}

export default Homepage;