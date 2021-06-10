import { BottomNavigation, BottomNavigationAction, makeStyles } from "@material-ui/core";
import BarChartIcon from '@material-ui/icons/BarChart';
import HistoryIcon from '@material-ui/icons/History';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import { Route } from "react-router-dom";

const useStyles = makeStyles({
    root: {
      width: '100vw',
      backgroundColor: '#1caac9',
      position: 'fixed',
      bottom: 0,
      left: 0
    },
  });
  
interface IBottomNavProps {
    value: string
}

export default function BottomNav(props: IBottomNavProps) {
    const classes = useStyles()

    return(
        <Route render={({history}: {history: any}) => (
            <BottomNavigation
            value={props.value}
            onChange={(ignored, newValue) => {
                history.push(newValue)
            }}
            showLabels
            className={classes.root}
            >
            <BottomNavigationAction label="Standings" value="/standings" icon={<BarChartIcon />} />
            <BottomNavigationAction label="Predict" value="/home" icon={<SportsSoccerIcon />} />
            <BottomNavigationAction label="History" value="/history" icon={<HistoryIcon />} />
            </BottomNavigation>
        )}/>

    )
}