import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import logo from '../img/logo.svg';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { resolveEndpoint, isTokenValid, setAuthToken } from '../utils/Utils';
import { test } from '../serviceWorkerRegistration'
import { Copyright } from './Copyright';
import { IUserTextInput } from '../types/types';

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
  logo: {
    maxHeight: '30vh'
  }
}));

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState<IUserTextInput>({ value: '', error: false });
  const [password, setPassword] = useState<IUserTextInput>({ value: '', error: false });
  const [validToken, setValidToken] = useState<boolean>(false);

  useEffect(() => {
    isTokenValid().then(valid => {
      if (valid === true) {
        setValidToken(true)
      }
    })
  }, [setValidToken])

  const handleLogin = (history: any) => () => {
    fetch(resolveEndpoint('auth/login'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    }).then(res => {
      if (res.status === 307) {
        history.push({
          pathname: '/reset',
          state: { email: email },
        })
        return null
      }

      if (res.status >= 400) {
        setPassword({ ...password, error: true });
        setEmail({ ...email, error: true });
        return null;
      }
      return res.json()
    })
      .then(result => {
        if (result !== null) {
          setAuthToken(result["token"]);
          setValidToken(true)
          test()
        }
      });
  };

  if (validToken) {
    return (
      <Redirect to={'/home'} />
    )
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <img className={classes.logo} src={logo} alt={'qatar 2022 logo'} />
          <Typography component="h1" variant="h5">
            Sign in
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
              onChange={(input) => setPassword({ ...password, value: input.target.value })}
              error={password.error}
            />
            <Route render={({ history }: { history: any }) => (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleLogin(history)}
              >
                Sign In
              </Button>
            )} />
            <Grid container>
              <Grid item>
                <Route render={({ history }: { history: any }) => (
                  <Link onClick={() => { history.push('/signup') }} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                )} />
              </Grid>
              <Grid item>
                <Route render={({ history }: { history: any }) => (
                  <Link onClick={() => { history.push('/reset') }} variant="body2">
                    {"Forgotten your password? Reset it here"}
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