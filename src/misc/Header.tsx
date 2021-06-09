import { AppBar, Button, makeStyles, Toolbar } from "@material-ui/core";
import logo from '../img/logo.svg'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
      flexGrow: 1,
      width:'100%',
      height:'100%'
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    headerLogo: {
        maxWidth: 50,
        alignSelf: 'center'
    }
  }));

export default function Header() {
    const classes = useStyles()

    return(
        <AppBar position="static" className={classes.root}>
            <Toolbar className={classes.root}>
                <img className={classes.headerLogo} src={logo} alt="logo" />
                <Button color="inherit">Logout</Button>
            </Toolbar>
        </AppBar>
    )
}