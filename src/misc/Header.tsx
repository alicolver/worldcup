import { makeStyles } from "@material-ui/core";
import logo from '../img/logo.svg'

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
  }
});

export default function Header() {
    const classes = useStyles()

    return(
        <div className={classes.headerBar}>
          <img className={classes.logo} src={logo} alt={'euro logo'}/>
        </div>
    )
}