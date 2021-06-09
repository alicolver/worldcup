import { Container, createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import logo from '../img/logo.svg';
import Prediction from '../predictions/Predictions';

const useStyles = makeStyles({
  logo: {
    maxHeight: '15vh'
  },
  homepage: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundImage: 'linear-gradient(#1caac9, #0da1a3)',
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
      </ThemeProvider>
    )
}

export default Homepage;