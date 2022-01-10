import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, redirect, Redirect } from 'react-router-dom'
import Login from './pages/Login/Login'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Button, Typography } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path={"/login"}>
            <Login />
          </Route>
          <Route path={"/signup"}>
            <Login />
          </Route>
          <Route exact path={"/"}>
            <Homepage />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;

const Homepage = () => {
  const authContext = React.useContext(AuthContext);
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {!authContext.isAuthenticated() && <Redirect to="/login" />}
        <h2 align="center" style={{ marginTop: "180px" }}>Hi {authContext.authState.userInfo.username} </h2>
        <p align="center">Congratulations! You are logged in.</p>
        <hr />
        <p align="center">Please enjoy our webapp.</p>
        <Typography align='center'>
          <Button
            color='primary'
            size='large'
            variant='contained'
            onClick={() => authContext.logout()}
          >
            Logout
          </Button>
        </Typography>
      </Container>
    </ThemeProvider>
  )
}
