import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
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
        axios.delete(`https://localhost:7020/api/Role?id=${toBeDeleted}`,config)
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
        axios.get(`https://localhost:7020/api/Role`,config)
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
        <div className='content'>
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
                            <Button variant="contained" onClick={() => setToBeDeleted(null)}>No</Button>
                            <Button variant="contained" onClick={handleDelete}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles?.map(role => (
                                <tr>
                                    <td>{role.name}</td>
                                    <td><button onClick={() => editRole(role)}><EditIcon /></button></td>
                                    <td><button onClick={() => deleteRole(role.id)} ><DeleteIcon /></button></td>
                                </tr>
                            ))}
                        </tbody>
                        <br />
                        <Button variant="contained" onClick={() => setAddRoleOpen(true)}>Add Role</Button>
                    </Table>
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