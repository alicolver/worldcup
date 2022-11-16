import {
  makeStyles,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useState, useEffect, ReactFragment } from "react";
import { useHistory } from "react-router-dom";
import { ILeague } from "../types/types";
import { getJWT, resolveEndpoint } from "../utils/Utils";
import ShareIcon from "@material-ui/icons/Share";
import { HOST_URL } from "../utils/Constants";
import { Alert } from "@mui/material";

const useStyles = makeStyles({
  table: {
    marginBottom: "2vh",
  },
});

export default function LeaguePreview() {
  const classes = useStyles();
  const history = useHistory();
  const [leagueData, setLeagueData] = useState<ILeague[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(resolveEndpoint("user/get-leagues"), {
      method: "POST",
      headers: {
        Authorization: getJWT(),
      },
    })
      .then((res) => {
        if (!res.ok) {
          return null;
        }
        return res.json();
      })
      .then((res) => {
        if (res !== null) {
          setLeagueData(res.data.leagues);
        }
      });
  }, [setLeagueData]);

  const handleShareClick = (link: string) => {
    setOpen(true);
    navigator.clipboard.writeText(link);
  };

  function getRows(): ReactFragment {
    return leagueData.map((data, index) => (
      <TableRow key={data.leagueId}>
        <TableCell>
          {data.users.filter((user) => user.rank === data.currentRanking)
            .length === 1
            ? data.currentRanking
            : "=" + data.currentRanking}
        </TableCell>
        <TableCell
          onClick={() => history.push("/standings?leagueId=" + data.leagueId)}
        >
          {data.leagueName}
        </TableCell>
        <TableCell>
          {data.leagueId === "global" ? (
            ""
          ) : (
            <ShareIcon
              onClick={() =>
                handleShareClick(
                  `${HOST_URL}league/join?leagueId=${data.leagueId}`
                )
              }
            />
          )}
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <TableContainer className={classes.table}>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{
            width: "300px",
            "& .MuiAlert-message": { textAlign: "center", width: "inherit" },
          }}
        >
          League link copied to clipboard!
        </Alert>
      </Snackbar>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Rank</b>
            </TableCell>
            <TableCell>
              <b>League</b>
            </TableCell>
            <TableCell>
              <b>Invite</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </TableContainer>
  );
}
