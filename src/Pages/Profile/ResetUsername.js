import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from 'react-bootstrap/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function ResetPassword({currentUsername,resetUsernameOpen,setResetUsernameOpen,userId}) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(resetUsernameOpen);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [data, setData] = useState({
        newUsername: '',
        userId: userId
    });

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }

    const handleClose = () => {
        setResetUsernameOpen(false);
    }

    const handleSubmit = () => {
        axios.put(`https://localhost:7020/api/Profile/resetUsername`, data, config)
            .then(response => {
                console.log(response);
                setResetUsernameOpen(false);
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
                <DialogTitle>Reset Username</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={(e) => handleChangeValue("newUsername", e.target.value)}
                        autoFocus
                        margin="dense"
                        id="currentPassword"
                        value={currentUsername}
                        type="name"
                        fullWidth
                        variant="standard"
                    />                    
                </DialogContent>
                <DialogActions>
                    <Button color='error' variant="contained" onClick={handleClose}>Cancel</Button>
                    <Button color='success' variant="contained" onClick={handleSubmit}>Reset</Button>
                </DialogActions>
            </Dialog>
        </div>
      );
}

export default ResetPassword;