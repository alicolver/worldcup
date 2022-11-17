import { Container, createMuiTheme, makeStyles, Toolbar } from '@material-ui/core';
import { useEffect, useState } from 'react';
import PointsCard from '../leaderboard/PointCard';
import League from '../league/League';
import Header from '../misc/Header';
import Predictions from '../predictions/Predictions';
import { IMatchData } from '../types/types';
import { mockMatchData } from '../utils/Constants';
import { getJWT, resolveEndpoint } from '../utils/Utils';

const useStyles = makeStyles({
  logo: {
    maxHeight: '15vw'
  },
  homepage: {
    position: 'relative',
    left: 0,
    width: '100%'
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

interface IGetMatches {
  imminentMatches: IMatchData[],
  nextMatches: IMatchData[]
}

function Homepage() {
  const classes = useStyles();
  const [matchData, setMatchData] = useState<IGetMatches>({ imminentMatches: [], nextMatches: []})

  useEffect(() => {
    fetch(resolveEndpoint('match/get-upcoming'), {
      method: 'GET',
      headers: {
        'Authorization': getJWT()
      }
    }).then(res => {
      if (!res.ok) {
        return
      }
      return res.json()
    }).then(res => {
      setMatchData({
        imminentMatches: [mockMatchData, mockMatchData, mockMatchData],
        nextMatches: [mockMatchData, mockMatchData, mockMatchData]
      })
    })
  }, [setMatchData])

  return (
    <>
      <Header />
      <Toolbar/>
      <Container className={classes.homepage} maxWidth="xs">
        <PointsCard />
        <Predictions heading="Next Games" matchData={matchData.imminentMatches}/>
        {/* <League /> */}
        <Predictions heading="Upcoming Games" matchData={matchData.nextMatches}/>
      </Container>
    </>
  )
}

export default Homepage;