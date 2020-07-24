import React from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Link } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { green } from '@material-ui/core/colors';
import { loadCSS } from 'fg-loadcss';
import axios from 'axios';

export default function Movies({ session }) {
    const [dataTable, setDataTable] = React.useState([]);
    const moviesRef = React.useRef();

    React.useEffect(() => {
        console.log("ENTER");
        var apiBaseUrl = "https://test-itcrowdrag.herokuapp.com/movie/list/movie/";
        // b2d71e2718c0bfaabd5740c8cb0c2d34e3d7d487
        var headers = { header: { "Access-Control-Allow-Origin": "*" } };
        axios.get(apiBaseUrl, headers)
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    setDataTable(response.data.results);
                }
                else {
                    console.log("Username does not exists", response.data.non_field_errors);
                    alert("Username does not exist");
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
            <Link href='/register/movie'><Icon className="fa fa-plus-circle" color="primary" /></Link>
            <Table ref={moviesRef}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Tittle</TableCell>
                        <TableCell align="center">Release Year</TableCell>
                        <TableCell align="center">Casting</TableCell>
                        <TableCell align="center">Directors</TableCell>
                        <TableCell align="center">Producers</TableCell>
                        {session && (<TableCell align="center">Options</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataTable.map((data, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell align="center">{data.tittle}</TableCell>
                                <TableCell align="center">{data.release_year}</TableCell>
                                <TableCell align="center">{data.casting.map((data, x) => { return (<p key={x}>{`${data.first_name} ${data.last_name}[${data.aliases}]`}</p>); })}</TableCell>
                                <TableCell align="center">{data.directors.map((data, x) => { return (<p key={x}>{`${data.first_name} ${data.last_name}[${data.aliases}]`}</p>); })}</TableCell>
                                <TableCell align="center">{data.producers.map((data, x) => { return (<p key={x}>{`${data.first_name} ${data.last_name}[${data.aliases}]`}</p>); })}</TableCell>
                                {session && (<TableCell align="center">
                                    <Link href='/update/movie'><Icon className="fa fa-edit" style={{ color: green[500] }} /></Link>
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