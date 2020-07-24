import React from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Link } from '@material-ui/core';
import { loadCSS } from 'fg-loadcss';
import Icon from '@material-ui/core/Icon';
import { green } from '@material-ui/core/colors';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function Persons({ session }) {
    const [dataTable, setDataTable] = React.useState([]);
    const personsRef = React.useRef();
    const history = useHistory();

    React.useEffect(() => {
        console.log("ENTER");
        var apiBaseUrl = "https://test-itcrowdrag.herokuapp.com/person/list/person/";
        var headers = { header: { "Access-Control-Allow-Origin": "*" } };
        axios.get(apiBaseUrl, headers)
            .then(function (response) {
                if (response.status === 200) {
                    setDataTable(response.data.results);
                }
                else {
                    console.log("Error", response.data.non_field_errors);
                    alert("Error");
                }
            })
            .catch(function (error) {
                console.log("ERROR ", error.response);
            });
        const node = loadCSS(
            'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
            document.querySelector('#font-awesome-css'),
        );

        return () => {
            node.parentNode.removeChild(node);
        };

    }, []);

    function deletePerson(id) {
        if (window.confirm("Are you sure delete this person element?")) {
            if (localStorage.getItem('token')) {

                var apiBaseUrl = `https://test-itcrowdrag.herokuapp.com/person/delete/${id}/person/`;
                var headers = {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem('token')}`,
                    }
                };

                axios.delete(apiBaseUrl, headers)
                    .then(function (response) {
                        console.log("DELETE PERSON RESONSED", response.status, response);
                        if (response.status === 204) {
                            console.log("Delete successfull", response.data);
                            alert("Person Delete successfull");
                            history.push('/persons');
                        }
                        else {
                            alert("ERROR");
                        }
                    })
                    .catch(function (error) {
                        console.log("ERROR ", error.response);
                        alert("Catch a error");
                        if(error.response){
                            if(error.response.status === 401){
                                localStorage.removeItem('token');
                                history.push('/login');
                            }
                        }
                    });
            } else {
                alert("Is necesary user login");
                history.push('/login');
            }
        }
    }

    return (
        <TableContainer>
            {session && (<center><Link href='/register/person'><Icon className="fa fa-plus-circle" color="primary" /></Link></center>)}
            <Table ref={personsRef}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">First Name</TableCell>
                        <TableCell align="center">Last Name</TableCell>
                        <TableCell align="center">Aliases</TableCell>
                        {session && (<TableCell align="center">Options</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataTable.map((data, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell align="center">{data.first_name}</TableCell>
                                <TableCell align="center">{data.last_name}</TableCell>
                                <TableCell align="center">{data.aliases}</TableCell>
                                {session && (<TableCell align="center">
                                    <Link href={`/update/person/${data.id}/`}><Icon className="fa fa-edit" style={{ color: green[500] }} /></Link>
                                &nbsp;
                                    <Link onClick={e => deletePerson(data.id)}><Icon className="fa fa-trash" color="secondary" /></Link>
                                </TableCell>)}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}