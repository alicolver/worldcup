import React, { useEffect, useState } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import logo from '../img/logo.svg';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { resolveEndpoint, isTokenValid, validateEmail } from '../utils/Utils';
import { SUCCESS } from '../utils/Constants';
import { Copyright } from './Copyright';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: "3rem"
  },
  logo: {
    maxHeight: '10vh'
  }
}));

const generateSignInLink = (params: URLSearchParams) => {
  return `/?${params.toString()}`
}

export default function SignUp() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [successfulSingUp, setSuccessfulSignup] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const search = new URLSearchParams(useLocation().search)

  useEffect(() => {
    isTokenValid().then(valid => {
      if (valid) {
        setValidToken(true)
      }
    })
  }, [setValidToken])

  function submitForm() {
    setIsLoading(true)
    if (!validateEmail(email)) {
      setIsLoading(false)
      setIsEmailValid(false)
      return
    }

    if (password !== confirmPassword) {
      setIsLoading(false)
      return
    }

    fetch(resolveEndpoint('auth/signup'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password,
        givenName: firstName,
        familyName: lastName
      })
    })
      .then(res => res.json())
      .then(result => {
        setIsLoading(false)
        console.log(result)
        if (result[SUCCESS] === false) {
          alert('error whilst signing up :(')
        } else {
          setSuccessfulSignup(true)
        }
      })
  }

  if (validToken) {
    return (
      <Redirect to={'/home'} />
    )
  }
  else if (successfulSingUp) {
    return (
      <Redirect to={'/'} />
    )
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img className={classes.logo} src={logo} alt={'qatar 2022 logo'} />
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <div className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(input) => setFirstName(input.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={(input) => setLastName(input.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(input) => setEmail(input.target.value)}
                  error={!isEmailValid}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(input) => setPassword(input.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(input) => setConfirmPassword(input.target.value)}
                  error={password !== confirmPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => submitForm()}
            >
              {isLoading ? <CircularProgress color="inherit" /> : "Sign Up"}
            </Button>
            <Grid container>
              <Grid item>
                <Route render={({ history }: { history: any }) => (
                  <Link onClick={() => { history.push(generateSignInLink(search)) }} variant="body2">
                    Already have an account? Sign in
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