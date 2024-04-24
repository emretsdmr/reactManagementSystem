import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import AddPermission from './AddPermission';

function Permissions() {
    const token = localStorage.getItem('token');
    const [permissions, setPermissions] = useState();
    const [toBeDeleted, setToBeDeleted] = useState();
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [permissionOpen, setPermissionOpen] = useState(false);

    const deleteUser = (id) => {
        let userId = localStorage.getItem("userId");
        if (id == userId) {
            console.log("You can't delete yourself!");
            setAlertOpen(true);
            setAlertMessage("You can't delete yourself!");
        }
        else {
            setDeleteUserOpen(true);
            setToBeDeleted(id);
        }

    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleDelete = () => {
        axios.delete(`https://localhost:7020/api/User?userId=${toBeDeleted}`, config)
            .then(response => {
                setToBeDeleted(null);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        axios.get(`https://localhost:7020/api/Permission`, config)
            .then(response => {
                setIsAuthorized(true);
                setPermissions(response.data);
            })
            .catch(error => {
                console.log(error);
                if (error.code = "ERR_BAD_REQUEST") {
                    setIsAuthorized(false);
                }
            });
    }, [])

    return (
        <div className='box'>
            {isAuthorized ? <>
                <br />
                <Alert key="secondary" variant="secondary">
                    Permissions
                </Alert>
                {alertOpen &&
                    <Alert variant="danger">
                        {alertMessage}
                    </Alert>}
                {permissionOpen &&
                    <AddPermission
                    />}
                <Dialog open={deleteUserOpen && toBeDeleted} onClose={() => setToBeDeleted(null)}>
                    <DialogTitle>Are you sure to delete this user?</DialogTitle>
                    <DialogActions>
                        <Button color="error" variant="contained" onClick={() => setToBeDeleted(null)}>No</Button>
                        <Button color="success" variant="contained" onClick={handleDelete}>Yes</Button>
                    </DialogActions>
                </Dialog>
                <TableContainer component={Paper}>
                    <br />
                    <Button variant="outlined" color='inherit' >+</Button>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Permission Type</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {permissions?.map(permission => (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {permission.userId}
                                    </TableCell>
                                    <TableCell>{permission.claimValue}</TableCell>
                                    <TableCell><Button color='inherit'><DeleteIcon /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
                :
                <>
                    <br />
                    <Alert variant="danger">
                        You are not authorized!
                    </Alert>
                </>}
        </div>
    );
}

export default Permissions;