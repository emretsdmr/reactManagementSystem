import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
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
                    <Button variant="contained" onClick={() => setDeleteOpen(false)}>No</Button>
                    <Button variant="contained" onClick={handleDelete}>Yes</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Roles</DialogTitle>
                <div className='box'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles?.map(role => (
                                <tr>
                                    <td>{role.roleName}</td>
                                    <td><button onClick={() => deleteRole(role.roleId)}><DeleteIcon /></button></td>
                                </tr>
                            ))}
                        </tbody>
                        <br />
                        <Button variant="outlined" onClick={() => setAddUserRoleOpen(true)}>Add Role</Button>
                    </Table>
                </div>
            </Dialog >
        </div >
    );
}

export default UserRoles;