import { makeStyles } from "@material-ui/core";
import logo from '../img/logo.svg'

const useStyles = makeStyles((theme) => ({
  logo: {
    maxHeight: '15vw',
    marginBottom: '5vw',
    position: 'fixed',
    top: 0
  }
}));

export default function Header() {
    const classes = useStyles()

    return(
        <>
          <img className={classes.logo} src={logo} alt={'euro logo'}/>
        </>
    )
}