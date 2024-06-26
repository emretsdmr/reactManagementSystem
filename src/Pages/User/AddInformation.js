import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from 'react-bootstrap/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function AddCategory({ userIdForInfo, addInfoOpen, setAddInfoOpen }) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(addInfoOpen);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [data, setData] = useState({
        title: '',
        description: '',
        userId: userIdForInfo
    });

    const handleClose = () => {
        setAddInfoOpen(false);
    };

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleSubmit = () => {
        axios.post(`https://localhost:7020/api/Information`, data, config)
            .then(response => {
                console.log(response);
                setAddInfoOpen(false);
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
                <DialogTitle>Add Information</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={(e) => handleChangeValue("title", e.target.value)}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={(e) => handleChangeValue("description", e.target.value)}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button color='inherit' onClick={handleClose}>Cancel</Button>
                    <Button color='success' variant="contained" onClick={handleSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddCategory;