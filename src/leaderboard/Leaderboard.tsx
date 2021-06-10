import React, { useState, useEffect } from 'react';
import { goTo } from "../utils/Utils";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LiveIcon from './Live';

const useStyles = makeStyles({
  table: {
    padding: '5px'
  },
});

interface leaderBoardRecord {
  name: String,
  correct_results: number,
  correct_scores: number,
  score: number
}

export default function LeaderBoard() {
  const classes = useStyles();
  const isLive = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<leaderBoardRecord[]>([])

  useEffect(() => {
    fetch(goTo('leaderboard'), {
      method: 'GET'
    }).then(res => res.json()).then(res => {
      if (res.success) {
        console.log(res)
        setLeaderboardData(res.leaderboard)
      }
    })
  }, [setLeaderboardData])


  function renderLive() {
    if (isLive) {
      return <LiveIcon />
    } else {
      return null
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Standings</TableCell>
            <TableCell align="right">R</TableCell>
            <TableCell align="right">S</TableCell>
            <TableCell align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboardData.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {renderLive()} {(index + 1) + '. ' + row.name}
              </TableCell>
              <TableCell align="right">{row.correct_results}</TableCell>
              <TableCell align="right">{row.correct_scores}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}