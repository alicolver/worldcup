import { Container, createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import BottomNav from '../misc/BottomNav';
import Header from '../misc/Header';
import Prediction from '../predictions/Predictions';

const useStyles = makeStyles({
  logo: {
    maxHeight: '15vw'
  },
  homepage: {
    position: 'absolute',
    top: '15vw',
    left: 0,
    width: '100%',
    marginBottom: '30vw'
  }
});

export const fontTheme = createMuiTheme({
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
      <ThemeProvider theme={fontTheme}>
        <Header/>
      <Container className={classes.homepage}>
        <Prediction />
      </Container>
      <BottomNav value={'/home'}/>
      </ThemeProvider>
    )
}

export default Homepage;