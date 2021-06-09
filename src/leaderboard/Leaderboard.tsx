import React, { useState } from 'react';
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
    name: String, correctResults: number, correctScores: number, points: number
}

function createData(name: String, correctResults: number, correctScores: number, points: number): leaderBoardRecord {
  return { name, correctResults, correctScores, points };
}

const rows: leaderBoardRecord[] = [
  createData('Ali', 1, 3, 10),
  createData('Luke', 4, 5, 19)
];

export default function LeaderBoard() {
  const classes = useStyles();
  const isLive = useState(false);

  function renderLive() {
      if (isLive) {
          return <LiveIcon/>
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
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {renderLive()} {(index + 1) + '. ' + row.name}
              </TableCell>
              <TableCell align="right">{row.correctResults}</TableCell>
              <TableCell align="right">{row.correctScores}</TableCell>
              <TableCell align="right">{row.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}