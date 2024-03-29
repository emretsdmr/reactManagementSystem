import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUserRoles from './User/AddUserRoles';

function UserRoles({ userIdForInfo, setUserIdForInfo, roleOpen, setRoleOpen }) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(roleOpen);
    const [roles, setRoles] = useState();
    const [rolesToAdd, setRolesToAdd] = useState();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addUserRoleOpen, setAddUserRoleOpen] = useState(false);
    const [data, setData] = useState({
        roleId: '',
        userId: userIdForInfo
    });

    const handleClose = () => {
        setRoleOpen(false);
        setUserIdForInfo(null);
    }

    const deleteRole = (id) => {
        setData({ ...data, roleId: id });
        setDeleteOpen(true);
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        data: data
    };

    const handleDelete = () => {
        axios.delete(`https://localhost:7020/api/Role/UserRole`, config)
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        axios.get(`https://localhost:7020/api/Role/UserRole?userId=${userIdForInfo}`, config)
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        axios.get(`https://localhost:7020/api/Role`, config)
            .then(response => {
                setRolesToAdd(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    return (
        <div>
            {addUserRoleOpen &&
                <AddUserRoles
                    rolesToAdd={rolesToAdd}
                    userIdForInfo={userIdForInfo}
                    addUserRoleOpen={addUserRoleOpen}
                    setAddUserRoleOpen={setAddUserRoleOpen}
                />}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogActions>
                    <Button variant="contained" color='error' onClick={() => setDeleteOpen(false)}>No</Button>
                    <Button variant="contained" color='success' onClick={handleDelete}>Yes</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Roles</DialogTitle>
                <div className='box'>
                    <Button variant="outlined" color='inherit' onClick={() => setAddUserRoleOpen(true)}>+</Button>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles?.map(role => (
                                    <TableRow
                                        key={role.roleName}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {role.roleName}
                                        </TableCell>
                                        <TableCell><Button color='inherit' onClick={() => deleteRole(role.roleId)} ><DeleteIcon /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Dialog >
        </div >
    );
}

export default UserRoles;