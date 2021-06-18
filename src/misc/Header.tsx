import { makeStyles } from "@material-ui/core";
import logo from '../img/logo.svg'
import { deleteJWT } from "../utils/Utils";

const useStyles = makeStyles({
  logo: {
    maxHeight: '15vw'
  },
  headerBar: {
    maxHeight: '15vw',
    marginBottom: '5vw',
    position: 'fixed',
    width: '100%',
    backgroundColor: 'white',
    top: 0,
    zIndex: 10
  },
  colorStrip: {
    content: "",
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '100%',
    height: '4px',
    background: 'linear-gradient(130deg,#ff7a18,#af002d 41.07%,#319197 76.05%)'
  }
});

export default function Header() {
  const classes = useStyles()

  function logout() {
    deleteJWT()
    window.location.reload();
  }

  return (
    <div className={classes.headerBar} onClick={logout} >
      <img className={classes.logo} src={logo} alt={'euro logo'} />
      <div className={classes.colorStrip} />
    </div>
  )
}