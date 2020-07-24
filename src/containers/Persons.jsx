import React from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Link } from '@material-ui/core';
import { loadCSS } from 'fg-loadcss';
import Icon from '@material-ui/core/Icon';
import { green } from '@material-ui/core/colors';
import axios from 'axios';

export default function Persons({ session }) {
    const [dataTable, setDataTable] = React.useState([]);
    const personsRef = React.useRef();
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

    return (
        <TableContainer>
            <Link href='/register/person'><Icon className="fa fa-plus-circle" color="primary" /></Link>
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
                                <Link href='/update/person'><Icon className="fa fa-edit" style={{ color: green[500] }} /></Link>
                                &nbsp;
                                <Link ><Icon className="fa fa-trash" color="secondary" /></Link>
                                </TableCell>)}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}