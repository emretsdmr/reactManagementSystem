import React, {useState, useEffect} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function AddRole({ addRoleOpen, setAddRoleOpen }) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(addRoleOpen);
    const [data, setData] = useState({
        name:'',
    });

    const handleClose = () => {
        setAddRoleOpen(false);
    };

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleSubmit = () => {
        axios.post(`https://localhost:7020/api/Role`, data,config)
        .then(response => {
            console.log(response);
            setAddRoleOpen(false);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Role</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={(e) => handleChangeValue("name", e.target.value)}
                        autoFocus
                        margin="dense"
                        value={data.name}
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddRole;