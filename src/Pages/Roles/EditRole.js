import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function EditRole({setEditRoleOpen, editRoleOpen, toBeEdited}) {
    const [open, setOpen] = useState(editRoleOpen);
    const [data, setData] = useState({
        id: toBeEdited?.id,   
        name: toBeEdited?.name
    });

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }    

    const handleSubmit = () => {         
        axios.put(`https://localhost:7020/api/Role`, data)    
        .then(response => {            
          console.log(response);
          setOpen(false);
          window.location.reload();
        })
          .catch(error => {
            console.log(error);
          });
    }

    const handleClose = () => {
        setEditRoleOpen(false);
    };    

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogContent>                    
                    <TextField
                        onChange={(e) => handleChangeValue("name", e.target.value)}
                        autoFocus
                        margin="dense"
                        value={data.name}
                        id="name"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                    />                                        
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditRole;