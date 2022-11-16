import { makeStyles } from "@material-ui/core";
import qatar from '../img/qatar.png'
import { deleteJWT } from "../utils/Utils";

const useStyles = makeStyles({
  logo: {
    height: '6vh',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  headerBar: {
    marginBottom: '5vw',
    position: 'fixed',
    width: '100%',
    background: 'linear-gradient(90deg, rgba(154,12,52,1) 0%, rgba(0,0,0,1) 100%)',
    top: 0,
    zIndex: 10,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
  }
});

export default function Header() {
  const classes = useStyles()

  function logout() {
    deleteJWT()
    window.location.reload();
  }

  return (
    <div className={classes.headerBar} onClick={logout} style={{ padding: "0.5rem" }}>
      <img className={classes.logo} src={qatar} alt={'qatar 2022 logo'} />
    </div>
  )
}