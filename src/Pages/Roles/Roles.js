import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import AddRole from './AddRole';
import EditRole from './EditRole';
import Alert from 'react-bootstrap/Alert';

function Roles() {
    const token = localStorage.getItem('token');
    const [roles, setRoles] = useState();
    const [addRoleOpen, setAddRoleOpen] = useState(false);
    const [editRoleOpen, setEditRoleOpen] = useState(false);
    const [toBeEdited, setToBeEdited] = useState();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const addRole = () => {
        setAddRoleOpen(true);
    }

    const editRole = (role) => {
        setEditRoleOpen(true);
        setToBeEdited(role);
    }

    const deleteRole = (id) => {
        setToBeDeleted(id);
        setDeleteOpen(true);
    }

    const handleDelete = () => {
        axios.delete(`https://localhost:7020/api/Role?id=${toBeDeleted}`, config)
            .then(response => {
                setToBeDeleted(null);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        axios.get(`https://localhost:7020/api/Role`, config)
            .then(response => {
                setIsAuthorized(true);
                setRoles(response.data);
            })
            .catch(error => {
                console.log(error);
                if (error.code = "ERR_BAD_REQUEST") {
                    setIsAuthorized(false);
                }
            });
    }, [])

    return (
        <div className='roles'>
            {isAuthorized ?
                <>
                    <br />
                    <Alert key="secondary" variant="secondary">
                        Roles
                    </Alert>
                    {addRoleOpen &&
                        <AddRole
                            setAddRoleOpen={setAddRoleOpen}
                            addRoleOpen={addRoleOpen}
                        />
                    }
                    {editRoleOpen &&
                        <EditRole
                            setEditRoleOpen={setEditRoleOpen}
                            editRoleOpen={editRoleOpen}
                            toBeEdited={toBeEdited}
                        />
                    }
                    <Dialog open={deleteOpen && toBeDeleted} onClose={() => setToBeDeleted(null)}>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogActions>
                            <Button color='error' variant="contained" onClick={() => setToBeDeleted(null)}>No</Button>
                            <Button color='success' variant="contained" onClick={handleDelete}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Edit</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles?.map(role => (
                                    <TableRow
                                        key={role.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {role.name}
                                        </TableCell>
                                        <TableCell><Button color='inherit' onClick={() => editRole(role)}><EditIcon /></Button></TableCell>
                                        <TableCell><Button color='inherit' onClick={() => deleteRole(role.id)} ><DeleteIcon /></Button></TableCell>
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
                    </Alert></>
            }
        </div>
    );
}

export default Roles;