import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, FormControl } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function RegisterMovie({ session }) {
    const [tittle, setTittle] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const registerPersonRef = React.useRef();
    const classes = useStyles();
    const history = useHistory();


    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([0, 1, 2, 3]);
    const [right, setRight] = React.useState([4, 5, 6, 7]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = (items) => (
        <Paper className={classes.paper}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`List item ${value + 1}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    React.useEffect(() => {
        if (!session) {
            history.push("/login");
        }
    }, [session, history]);

    function validateForm() {
        return tittle.length > 0 && releaseYear.length > 0;
    }

    function handleSubmit(event) {
        if (localStorage.getItem('token')) {
            if (validateForm()) {
                var apiBaseUrl = "https://test-itcrowdrag.herokuapp.com/movie/register/movie/";
                // b2d71e2718c0bfaabd5740c8cb0c2d34e3d7d487
                var headers = { headers: { "Authorization": `Token ${localStorage.getItem('token')}`, } };
                var payload = {
                    tittle: tittle,
                    release_year: releaseYear
                }
                axios.post(apiBaseUrl, payload, headers)
                    .then(function (response) {
                        console.log(response.status, response);
                        if (response.status === 201) {
                            console.log("Person reister", response.data);
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
                            if (error.response.data.tittle) {
                                alert(`Title: ${error.response.data.tittle}`);
                            }
                            if (error.response.data.release_year) {
                                alert(`Release Year: ${error.response.data.release_year}`);
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
                    label="Enter movie tittle"
                    value={tittle}
                    onChange={e => setTittle(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <TextField
                    className={classes.margin}
                    type="number"
                    label="Enter movie release year"
                    value={releaseYear}
                    onChange={e => setReleaseYear(e.target.value)}
                />
            </FormControl>
            <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                <Grid item>{customList(left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
          </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
          </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
          </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
          </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right)}</Grid>
            </Grid>
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <Button variant="contained" color='primary' onClick={(event) => handleSubmit(event)} >Submit</Button>
            </FormControl>
        </div>

    );
}
