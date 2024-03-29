import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from 'react-bootstrap/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function ResetPassword({resetPasswordOpen,setResetPasswordOpen,userId}) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(resetPasswordOpen);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [data, setData] = useState({
        currentPassword: '',
        newPassword: '',
        userId: userId
    });

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }

    const handleClose = () => {
        setResetPasswordOpen(false);
    }

    const handleSubmit = () => {
        axios.put(`https://localhost:7020/api/Profile`, data, config)
            .then(response => {
                console.log(response);
                setResetPasswordOpen(false);
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
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={(e) => handleChangeValue("currentPassword", e.target.value)}
                        autoFocus
                        margin="dense"
                        id="currentPassword"
                        label="Current Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={(e) => handleChangeValue("newPassword", e.target.value)}
                        autoFocus
                        margin="dense"
                        id="newPassword"
                        label="New Password"
                        type="password"
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