import { AppBar, Box, Container, makeStyles, Toolbar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import qatar from "../img/qatar.png";
import { deleteJWT } from "../utils/Utils";
import LogoutIcon from "@mui/icons-material/Logout";

const useStyles = makeStyles({
  logo: {
    height: "20px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  headerBar: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    padding: "0.5rem",
    margin: 0,
    width: "100%",
    background:
      "linear-gradient(90deg, rgba(154,12,52,1) 0%, rgba(0,0,0,1) 100%)",
    zIndex: 10,
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
  },
});

export default function Header() {
  const classes = useStyles()
  const history = useHistory()

  function logout() {
    deleteJWT()
    window.location.reload();
  }

  return (
    <Box>
      <AppBar className={classes.headerBar}>
        <img className={classes.logo} src={qatar} alt={"qatar 2022 logo"} onClick={() => history.push("/home")}/>
        <LogoutIcon onClick={() => logout()}
          sx={{ color: "#FFFFFF", position: "absolute", right: "15px" }}
        />
      </AppBar>
    </Box>
  );
}
