import { Button, Container, makeStyles, TextField, ThemeProvider, Typography } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { fontTheme } from "../homepage/Homepage";
import Header from "../misc/Header";
import { getJWT, resolveEndpoint } from "../utils/Utils";

const useStyles = makeStyles({
    container: {
        position: 'absolute',
        top: '20vw',
        textAlign: 'center'
    },
    gradient: {
      background: 'linear-gradient(to bottom right, rgba(255, 122, 24, 0.2), rgba(175, 0, 45, 0.2), rgba(49, 145, 151, 0.2))',
    },
    heading: {
        fontSize: '10vw',
        paddingBottom: '5vh'
    },
    first: {
        fontWeight: 'bold'
    },
    link: {
        color: '#A30E36',
        textDecoration: 'underline'
    },
    inputText: {
        width: '100%',
        textAlign: 'center'
    },
    joinButton: {
        top: '2vh',
        width: '100%',
        background: 'linear-gradient(90deg, rgba(154,12,52,1) 0%, rgba(0,0,0,1) 100%)',
        color: 'white',
        fontWeight: 'bold'
    }
})

export default function JoinLeaguePage() {
    const classes = useStyles()
    const history = useHistory()
    const [leagueName, setLeagueName] = useState({ value: '', error: false });

    const handleLeagueJoin = () => {
        fetch(resolveEndpoint('league/join'), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": getJWT()
          },
          body: JSON.stringify({
            leagueId: leagueName.value
          })
        }).then(res => {
            if (res.status === 200) {
                history.push('/home')
            } else {
                setLeagueName({ ...leagueName, error: true })
            }
        })
    }

    return (
        <ThemeProvider theme={fontTheme}>
            <Header />
            <Container className={classes.container}>
                <Typography className={classes.heading}>Join a League</Typography> 
                <Typography className={classes.first}>Enter the league code provided to you by the league owner.</Typography>
                <Typography>If you want to create a league you can create one by clicking the link below:</Typography>
                <Typography className={classes.link} onClick={() => history.push('/league/create')}>Create a League.</Typography>
                <TextField
                    id="outlined-helperText"
                    label="League Id"
                    helperText="Get your friend to send you the league id :)"
                    className={classes.inputText}
                    error={leagueName.error}
                    onChange={(input) => setLeagueName({...leagueName, value: input.target.value })}
                />
                <Button className={classes.joinButton} onClick={() => handleLeagueJoin()}>
                    Join League!    
                </Button>            
            </Container>
        </ThemeProvider>
    )
}