import LeaderBoard from "./Leaderboard";
import React from "react";
import { makeStyles } from "@material-ui/core";
import Header from "../misc/Header";
import BottomNav from "../misc/BottomNav";

const useStyles = makeStyles({
    leaderboard: {
      padding: '5px',
      marginTop: '50px',
    },
  });
  

export default function LeaderboardPage() {
    const classes = useStyles();

    return(
        <React.Fragment>
          <Header/>
            <div className={classes.leaderboard}>
            <LeaderBoard/>                
            </div>
          <BottomNav value={'/standings'}/>
        </React.Fragment>
    )
}