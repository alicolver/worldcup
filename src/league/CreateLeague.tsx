import { ThemeProvider, Container, Typography, TextField, Button, makeStyles } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { fontTheme } from "../homepage/Homepage"
import Header from "../misc/Header"

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
                />
                <Button className={classes.joinButton}>
                    Create League!    
                </Button>            
            </Container>
        </ThemeProvider>
    )
}