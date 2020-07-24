import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, FormControl } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));

export default function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const loginRef = React.useRef();
    const classes = useStyles();
    const history = useHistory()

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        console.log("ENTER");
        if (validateForm()) {
            var apiBaseUrl = "https://test-itcrowdrag.herokuapp.com/users/sign_in/";
            // b2d71e2718c0bfaabd5740c8cb0c2d34e3d7d487
            var headers = { header: { "Access-Control-Allow-Origin": "*" } };
            var payload = {
                "username": username,
                "password": password
            }
            axios.post(apiBaseUrl, payload, headers)
                .then(function (response) {
                    console.log(response.status, response);
                    if (response.status === 200) {
                        console.log("Login successfull", response.data);
                        localStorage.setItem('token', response.data.token);
                        history.replace('/');
                    }
                    else {
                        console.log("Username does not exists", response.data.non_field_errors);
                        alert("Username does not exist");
                    }
                })
                .catch(function (error) {
                    console.log("ERROR ", error.response);
                    if (error.response.data.username) {
                        alert(`Username: ${error.response.data.username}`);
                    }
                    if (error.response.data.password) {
                        alert(`Password: ${error.response.data.password}`);
                    }
                    if (error.response.data.non_field_errors) {
                        alert(`Detail ${error.response.data.non_field_errors}`);
                    }
                });
        } else {
            alert("is necessary username and password");
        }
    }

    return (
        <div ref={loginRef}>
            <FormControl fullWidth className={classes.margin} variant="outlined">
            <TextField
                className={classes.margin}
                label="Enter your Username"
                value={username}
                onChange={e => setUserName(e.target.value)}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
            />
            </FormControl>
            <FormControl fullWidth className={classes.margin} variant="outlined">
            <TextField
                className={classes.margin}
                type="password"
                value={password}
                label="Enter your Password"
                onChange={e => setPassword(e.target.value)}
            />
            </FormControl>
            <FormControl fullWidth className={classes.margin} variant="outlined">
            <Button variant="contained" color='primary' onClick={(event) => handleSubmit(event)} >Submit</Button>
            </FormControl>
        </div>

    );
}
