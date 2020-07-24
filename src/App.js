import React from 'react';
import { MuiThemeProvider, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { AppBar, Menu, Toolbar, IconButton, Typography, Link, MenuItem } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './containers/Login';
import Home from './containers/Home';
import Persons from './containers/Persons';
import RegisterPerson from './containers/RegisterPerson';
import UpdatePerson from './containers/UpdatePerson';
import Movies from './containers/Movies';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  toopbar: {
    marginTop: 10,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const theme = createMuiTheme({
});

export default function App() {
  const history = useHistory();
  const [auth, setAuth] = React.useState(true);
  const appRef = React.useRef();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl)

  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const openMenu = Boolean(anchorElMenu)

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [setAuth]);


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrincilaMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  function logOut() {
    if (window.confirm("Are you sure exit?")) {
      if (localStorage.getItem('token')) {

        var apiBaseUrl = `https://test-itcrowdrag.herokuapp.com/users/sign_out/`;
        var headers = {
          headers: {
            "Authorization": `Token ${localStorage.getItem('token')}`,
          }
        };

        axios.get(apiBaseUrl, headers)
          .then(function (response) {
            console.log("DELETE PERSON RESONSED", response.status, response);
            if (response.status === 200) {
              console.log("EXIT", response.data);
              alert("Good Bye");
              localStorage.removeItem('token');
              history.push('/');
            }
            else {
              alert("ERROR");
            }
          })
          .catch(function (error) {
            console.log("ERROR ", error.response);
            alert("Catch a error");
            if (error.response) {
              if (error.response.status === 401) {
                localStorage.removeItem('token');
                history.push('/');
              }
            }
          });
      } else {
        alert("Is necesary user login");
        history.push('/');
      }
    }
  }

  return (
    <Router>
      <div ref={appRef} className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <AppBar position="static" >
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="pincipal menu"
                aria-controls="pincipal-menu"
                aria-haspopup="true"
                onClick={handlePrincilaMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="pincipal-menu"
                anchorEl={anchorElMenu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={openMenu}
                onClose={handleCloseMenu}
              >
                <MenuItem><Link href='/persons'>Persons</Link></MenuItem>
                <MenuItem><Link href='/movies'>Movies</Link></MenuItem>
              </Menu>

              <Typography variant="h6" className={classes.title}>React App</Typography>
              {auth ? (
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem><Link onClick={e => logOut()}>Logout</Link></MenuItem>
                  </Menu>
                </div>
              ) : <Link color="inherit" href='/login'>Login</Link>}
            </Toolbar>
          </AppBar>
          <Container maxWidth="xl" className={classes.toopbar}>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login' component={Login} />
              <Route path='/persons' component={() => <Persons session={auth} />} />
              <Route path='/register/person' component={() => <RegisterPerson session={auth} />} />
              <Route exact path='/update/person/:personId' component={UpdatePerson} />
              <Route path='/movies' component={() => <Movies session={auth} />} />
            </Switch>
          </Container>
        </MuiThemeProvider>
      </div>
    </Router>
  );

}
