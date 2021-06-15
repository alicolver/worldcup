import LeaderBoard from "./Leaderboard";
import React from "react";
import { makeStyles, ThemeProvider, Typography } from "@material-ui/core";
import Header from "../misc/Header";
import BottomNav from "../misc/BottomNav";
import { fontTheme } from "../homepage/Homepage";
import { isAdminCheck } from "../utils/Utils";

const useStyles = makeStyles({
  leaderboard: {
    padding: '5px',
    marginTop: '50px',
    marginBottom: '10vw',
    paddingTop: '5vw',
    paddingBottom: '10vw'
  },
  upcomingGames: {
    fontSize: '8vw',
    paddingTop: '4vw',
    paddingBottom: '4vw',
    textAlign: 'center',
    fontFamily: [
      'Source Sans Pro',
      'sans-serif',
    ].join(',')
  }
});

export default function LeaderboardPage() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={fontTheme}>
      <Header />
      <div className={classes.leaderboard}>
        <Typography className={classes.upcomingGames}>Standings</Typography>
        <LeaderBoard />
      </div>
      <BottomNav value={'/standings'} admin={isAdminCheck()} />
    </ThemeProvider>
  )
}