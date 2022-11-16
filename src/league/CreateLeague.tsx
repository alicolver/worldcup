import { ThemeProvider, Container, Typography, TextField, Button, makeStyles } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { fontTheme } from "../homepage/Homepage"
import Header from "../misc/Header"
import { IUserTextInput } from "../types/types"
import { getJWT, resolveEndpoint } from "../utils/Utils"

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


export default function CreateLeaguePage() {
    const classes = useStyles()
    const history = useHistory()
    const [leagueName, setLeagueName] = useState<IUserTextInput>({ value: '', error: false })
    const [success, setSuccess] = useState<boolean>(false)
    const [isWaiting, setIsWaiting] = useState<boolean>(false)

    useEffect(() => { }, [setSuccess, setIsWaiting])

    const handleLeagueCreate = () => {
        setIsWaiting(true)
        fetch(resolveEndpoint('league/create'), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": getJWT()
          },
          body: JSON.stringify({
            leagueName: leagueName.value
          })
        }).then(res => {
            setIsWaiting(false)
            if (res.status !== 200) {
                setLeagueName({ ...leagueName, error: true })
                alert('League Name already in use, try again')
            } else {
                history.push("/home")
                setSuccess(true)
                setTimeout(function() { setSuccess(false) }, 2000)
            }
        })
    }

    return (
        <ThemeProvider theme={fontTheme}>
            <Header />
            <Container className={classes.container}>
                <Typography className={classes.heading}>Create a League</Typography> 
                <Typography className={classes.first}>Enter your league name to create a private league for you and friends.</Typography>
                <TextField
                    id="outlined-helperText"
                    label="League Name"
                    className={classes.inputText}
                    onChange={(input) => setLeagueName({ ...leagueName, value: input.target.value })}
                    error={leagueName.error}
                    style={
                        success ? {
                            boxShadow: '0 0 5px rgba(20, 219, 96, 1)',
                            border: '1px solid rgba(20, 219, 96, 1)'
                        } : {}
                    }
                />
                <Button className={classes.joinButton} onClick={() => handleLeagueCreate()}>
                    {success ? 'SUCCESS' : isWaiting ? 'creating...' : 'Create League!' }
                </Button>            
            </Container>
        </ThemeProvider>
    )
}