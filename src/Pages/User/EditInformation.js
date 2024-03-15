import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function EditInformations({setEditInfoOpen, editInfoOpen, toBeEdited}) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(editInfoOpen);
    const [data, setData] = useState({        
        title: toBeEdited.title,
        description: toBeEdited.description
    });

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }    

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };


    const handleSubmit = () => {         
        axios.put(`https://localhost:7020/api/Information?infoId=${toBeEdited.id}`, data,config)    
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
        setEditInfoOpen(false);
    };    

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Information</DialogTitle>
                <DialogContent>                    
                    <TextField
                        onChange={(e) => handleChangeValue("title", e.target.value)}
                        autoFocus
                        margin="dense"
                        value={data.title}
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
                        value={data.description}
                        id="name"
                        label="Description"
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

export default EditInformations;