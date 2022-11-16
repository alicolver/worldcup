import { Container, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import qatar from "../img/qatar.png";
import { deleteJWT } from "../utils/Utils";
import LogoutIcon from "@mui/icons-material/Logout";

const useStyles = makeStyles({
  logo: {
    height: "6vh",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  headerBar: {
    marginBottom: "5vw",
    position: "fixed",
    width: "100%",
    background:
      "linear-gradient(90deg, rgba(154,12,52,1) 0%, rgba(0,0,0,1) 100%)",
    top: 0,
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
    <>
      <Container
        className={classes.headerBar}
        onClick={() => history.push("/home")}
        style={{ padding: "0.5rem", display: "flex", alignItems: "center" }}
      >
        <img className={classes.logo} src={qatar} alt={"qatar 2022 logo"} />
        <LogoutIcon onClick={() => logout()}
          sx={{ color: "#FFFFFF", position: "fixed", right: "15px" }}
        />
      </Container>
    </>
  );
}
