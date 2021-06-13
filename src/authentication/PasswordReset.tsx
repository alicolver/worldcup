import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { goTo, isTokenValid } from '../utils/Utils';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Ali Colver & Luke Ely
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function PasswordReset() {
  const classes = useStyles();
  const [email, setEmail] = useState({ value: '', error: false });
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validToken, setValidToken] = useState(false);
  const [successfulReset, setSuccessfulReset] = useState(false);

  useEffect(() => {
    isTokenValid().then(valid => {
      if (valid) {
        setValidToken(true)
      }
    })
  }, [setValidToken])

  function sendOtp() {
    fetch(goTo('reset-password'), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result["error-message"] === "") {
            setSuccessfulReset(true)
        } else {
            alert('Error resetting password try again later')
        }
    });
  }

  function resetPassword() {
      if (password !== confirmPassword) {
          return
      }

    fetch(goTo('reset-password'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            otp: otp,
            newPassword: password
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result["error-message"] === "") {
            alert('Check your email for your OTP')
        } else {
            alert('Error sending OTP try again later')
        }
    });
  }

  if (validToken) {
    return (
      <Redirect to={'/home'} />
    )
  } else if (successfulReset) {
    return (
        <Redirect to={'/login'}/>
    )
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Recover Password
          </Typography>
          <div className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(input) => setEmail({ ...email, value: input.target.value })}
              error={email.error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => sendOtp()}
            >
              Request OTP
            </Button>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="One Time Password"
              type="password"
              id="password"
              autoComplete="OTP"
              onChange={(input) => setOtp(input.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(input) => setPassword(input.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(input) => setConfirmPassword(input.target.value)}
              error={password !== confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => resetPassword()}
            >
              Reset Password
            </Button>
            <Grid container>
              <Grid item>
                <Route render={({ history }: { history: any }) => (
                  <Link onClick={() => { history.push('/signup') }} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                )} />
              </Grid>
            </Grid>
          </div>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}