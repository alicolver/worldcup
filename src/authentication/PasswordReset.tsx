import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import logo from '../img/logo.svg';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { resolveEndpoint, isTokenValid } from "../utils/Utils";
import { Copyright } from "./Copyright";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: "3rem",
  },
  logo: {
    maxHeight: '10vh'
  }
}));

interface PasswordResetProps {
  location?: {
    state?: {
      email?: {
        value: string;
      };
    };
  };
}

export default function PasswordReset(props: PasswordResetProps) {
  const [otpIsLoading, setOtpIsLoading] = useState(false);
  const [resetPassIsLoading, setResetPassIsLoading] = useState(false);
  const classes = useStyles();
  const [email, setEmail] = useState({
    value: props.location?.state?.email?.value || "",
    error: false,
  });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [successfulReset, setSuccessfulReset] = useState(false);

  useEffect(() => {
    isTokenValid().then((valid) => {
      if (valid) {
        setValidToken(true);
      }
    });
  }, [setValidToken]);

  function sendOtp(): void {
    setOtpIsLoading(true);
    fetch(resolveEndpoint("auth/reset"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
      }),
    }).then((result) => {
      setOtpIsLoading(false);
      if (result.status !== 200) {
        alert("Error creating OTP try again later");
      }
    }).catch(() => {
      setOtpIsLoading(false);
      alert("Error creating OTP try again later")
    })
  }

  function resetPassword(): void {
    setResetPassIsLoading(true);
    if (password !== confirmPassword) {
      return;
    }

    fetch(resolveEndpoint("auth/confirm"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        confirmationCode: otp,
        password: password,
      }),
    }).then((result) => {
      setResetPassIsLoading(false);
      if (result.status === 200) {
        setSuccessfulReset(true);
      } else {
        alert("Error resetting password");
      }
    });
  }

  if (validToken) {
    return <Redirect to={"/home"} />;
  } else if (successfulReset) {
    return <Redirect to={"/"} />;
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <img className={classes.logo} src={logo} alt={'qatar 2022 logo'} />
          <Typography component="h1" variant="h5">
            Reset Password
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
              value={email.value}
              autoFocus
              onChange={(input) =>
                setEmail({ ...email, value: input.target.value })
              }
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
              {otpIsLoading ? (
                <CircularProgress style={{ padding: "5px" }} color="inherit" />
              ) : (
                "Request verification code"
              )}
            </Button>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Verification Code"
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
              {resetPassIsLoading ? (
                <CircularProgress style={{ padding: "5px" }} color="inherit" />
              ) : (
                "Reset Password"
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Route
                  render={({ history }: { history: any }) => (
                    <Link
                      onClick={() => {
                        history.push("/");
                      }}
                      variant="body2"
                    >
                      {"Remembered your password? Sign in"}
                    </Link>
                  )}
                />
              </Grid>
              <Grid item>
                <Route
                  render={({ history }: { history: any }) => (
                    <Link
                      onClick={() => {
                        history.push("/signup");
                      }}
                      variant="body2"
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  )}
                />
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
