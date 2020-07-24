import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, FormControl } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function UpdatePerson({ match }) {
    const [id, setID] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [aliases, setAliases] = useState("");
    const registerPersonRef = React.useRef();
    const classes = useStyles();
    const history = useHistory();
    React.useEffect(() => {
        var apiBaseUrl = "https://test-itcrowdrag.herokuapp.com/person/list/person/";
        var headers = { header: { "Access-Control-Allow-Origin": "*" } };
        axios.get(apiBaseUrl, headers)
            .then(function (response) {
                if (response.status === 200) {
                    response.data.results.map((data)=>{
                        if(data.id === parseInt(match.params.personId)){
                            setID(data.id);
                            setLastName(data.last_name);
                            setFirstName(data.first_name);
                            setAliases(data.aliases);
                        }
                        return true;
                    });
                }
            })
            .catch(function (error) {
                console.log("ERROR ", error.response);
                history.replace('/persons');
            });
    }, [match, history]);

    function validateForm() {
        return firstName.length > 0 && lastName.length > 0 && aliases.length > 0;
    }

    function handleSubmit(event) {
        if (localStorage.getItem('token')) {
            if (validateForm()) {
                var apiBaseUrl = `https://test-itcrowdrag.herokuapp.com/person/update/${id}/person/`;
                // b2d71e2718c0bfaabd5740c8cb0c2d34e3d7d487
                var headers = { headers: { "Authorization": `Token ${localStorage.getItem('token')}`, } };
                var payload = {
                    first_name: firstName,
                    last_name: lastName,
                    aliases: aliases
                }
                axios.put(apiBaseUrl, payload, headers)
                    .then(function (response) {
                        console.log(response.status, response);
                        if (response.status === 200) {
                            console.log("Person update", response.data);
                            alert("Person register success");
                            history.replace('/persons');
                        }
                        else {
                            console.log("Username does not exists", response.data.non_field_errors);
                            alert("Person does not exist");
                        }
                    })
                    .catch(function (error) {
                        console.log("ERROR ", error.response);
                        alert("Catch a error");
                        if (error.response) {
                            if (error.response.status === 401) {
                                localStorage.removeItem('token');
                                history.push('/login');
                            }
                            if (error.response.data.first_name) {
                                alert(`First Name: ${error.response.data.first_name}`);
                            }
                            if (error.response.data.last_name) {
                                alert(`Last Name: ${error.response.data.last_name}`);
                            }
                            if (error.response.data.aliases) {
                                alert(`Aliases: ${error.response.data.aliases}`);
                            }
                        }
                    });
            } else {
                alert("is necessary username and password");
            }
        } else {
            alert("Is necesary user login");
            history.push('/login');
        }
    }

    return (
        <div ref={registerPersonRef}>
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <TextField
                    className={classes.margin}
                    label="Enter person first name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <TextField
                    className={classes.margin}
                    label="Enter person last name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <TextField
                    className={classes.margin}
                    value={aliases}
                    label="Enter person aliase"
                    onChange={e => setAliases(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <Button variant="contained" color='primary' onClick={(event) => handleSubmit(event)} >Submit</Button>
            </FormControl>
        </div>

    );
}
