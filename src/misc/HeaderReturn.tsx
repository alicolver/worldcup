import { makeStyles } from "@material-ui/core";
import logo from '../img/logo.svg'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  logo: {
    maxHeight: '15vw'
  },
  backButton: {
    position: 'absolute',
    top: '50%',
    marginTop: '-22px',
    marginLeft: '5vw',
  },
  headerBar: {
    height: '15vw',
    marginBottom: '10vw',
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

export default function HeaderReturn() {
  const classes = useStyles()
  let history = useHistory();

  function goBack() {
    history.goBack()
  }

  return (
    <div className={classes.headerBar}>
      <IconButton className={classes.backButton} onClick={goBack}>
        <ArrowBackIcon />
      </IconButton>
      <img className={classes.logo} src={logo} alt={'qatar 2022 logo'} />
      <div className={classes.colorStrip} />
    </div>
  )
}