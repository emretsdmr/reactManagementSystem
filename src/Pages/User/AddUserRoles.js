import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

function AddUserRoles({ rolesToAdd, userIdForInfo, addUserRoleOpen, setAddUserRoleOpen }) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(addUserRoleOpen);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [data, setData] = useState({
        roleId: rolesToAdd[0].id,
        userId: userIdForInfo
    });

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }

    const handleClose = () => {
        setAddUserRoleOpen(false);
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleSubmit = () => {    
        axios.post(`https://localhost:7020/api/Role/UserRole`, data,config)
            .then(response => {
                setAddUserRoleOpen(false);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
                setAlertOpen(true);
                setAlertMessage(error.response.data);
            });
    }


    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
           {alertOpen && <Alert variant="danger">
                        {alertMessage}
                    </Alert>}
                <DialogTitle>Add Role</DialogTitle>
                <DialogContent>
                    Role: <br />
                    <select value={data?.roleId} onChange={(e) => handleChangeValue("roleId", e.target.value)}>
                        {rolesToAdd?.map(role => (
                            <option value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Add Role</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddUserRoles;