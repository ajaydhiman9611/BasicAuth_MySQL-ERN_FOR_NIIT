import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { Redirect, useLocation, Link as Linkto } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import './Login.style.css';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Ajay Dhiman
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {
  const authContext = React.useContext(AuthContext);
  let { pathname } = useLocation();

  let [formData, setFormData] = React.useState({});
  let [loading, setLoading] = React.useState(false);
  let [apiStatus, setApiStatus] = React.useState({
    ifError: "",
    msg: ""
  });
  let [redirect, setRedirect] = React.useState(false);


  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = formData => async e => {
    e.preventDefault();
    setLoading(true);
    console.log("FormData : ", formData);
    try {
      let { data } = await axios.post(`http://localhost:5000/api/v1/user${pathname}`, formData)
      console.log("API returned this : ", data);
      setApiStatus({
        ifError: false,
        msg: "Login Successfull, Redirecting!",
        className: "success"
      })
      authContext.setAuthState(data);
      setTimeout(() => {
        setRedirect(true);
      }, 2000);

    } catch (err) {
      setApiStatus({
        ifError: true,
        msg: "Incorrect username or password!",
        className: "error"
      })
      setTimeout(() => {
        setApiStatus({
          ifError: "",
          msg: "",
          className: ""
        });
        setLoading(false);
      }, 2000);
      console.log(err)
    }
  };


  return (
    <ThemeProvider theme={theme}>
      {redirect && <Redirect to={'/'} />}
      {authContext.isAuthenticated() && <Redirect to="/" />}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {"Let's  " + (pathname === "/signup" ? "sign you up!" : "log you in!")}
          </Typography>
          <Box component="form" method="POST" onSubmit={handleSubmit(formData)} noValidate sx={{ mt: 1 }}>
            {pathname === "/signup" && <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              type="Username"
              id="username"
              autoComplete="current-username"
              value={formData.username}
              onChange={handleOnChange}
            />}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleOnChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleOnChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Submitting..." : (pathname === "/signup" ? "Sign up" : "Log In")}
            </Button>
            <p className={`alertMsg ${apiStatus.className}`} align={'center'}>{apiStatus.msg}</p>
            <Grid container mt={1}>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Linkto to={pathname === "/signup" ? "/login" : "/signup"} variant="body2">
                  <Link>
                    {pathname === "/signup" ? "Already know us? Log in" : "Don't have an account? Sign Up"}
                  </Link>
                </Linkto>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider >
  );
}