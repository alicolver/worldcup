import { Container, createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import League from '../league/League';
import BottomNav from '../misc/BottomNav';
import Header from '../misc/Header';
import Prediction from '../predictions/Predictions';
import { isAdminCheck } from "../utils/Utils";

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
      <Header />
      <Container className={classes.homepage}>
        <League />
      </Container>
    </ThemeProvider>
  )
}

export default Homepage;