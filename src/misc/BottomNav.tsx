import { BottomNavigation, BottomNavigationAction, makeStyles } from "@material-ui/core"
import BarChartIcon from "@material-ui/icons/BarChart"
import HistoryIcon from "@material-ui/icons/History"
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer"
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount"
import { Route } from "react-router-dom"
import { History } from "history"
import React from "react"

const useStyles = makeStyles({
    root: {
        width: "100vw",
        position: "fixed",
        bottom: 0,
        left: 0
    },
})

interface IBottomNavProps {
    value: string
    admin: boolean
}

export default function BottomNav(props: IBottomNavProps): JSX.Element {
    const classes = useStyles()

    function getAdminPage() {
        return props.admin ?
            <BottomNavigationAction label="Admin" value="/admin" icon={<SupervisorAccountIcon />} /> :
            <></>
    }

    return (
        <Route render={({ history }: { history: History }) => (
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
                {getAdminPage()}
            </BottomNavigation>
        )} />

    )
}