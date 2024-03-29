import { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';

function MyInformations() {
    const [informations, setInformations] = useState();
    var token = localStorage.getItem("token");

    useEffect(() => {
        let userId = localStorage.getItem("userId");
        axios.get(`https://localhost:7020/api/Information/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setInformations(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    return (
        <div className="informations">
            <br />
            <Alert key="secondary" variant="secondary">
                My Informations
            </Alert>
            {informations?.length > 0 ?
                <TableContainer sx={{ width: 470, wordBreak: "break-word" }} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={70}>Title</TableCell>
                                <TableCell width={200}>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {informations?.map(information => (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {information.title}
                                    </TableCell>
                                    <TableCell>{information.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                :

                <TableContainer sx={{ width: 470, wordBreak: "break-word" }} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            No informations found!
                        </TableHead>
                    </Table>
                </TableContainer>
            }
        </div>
    );
}

export default MyInformations;