import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function EditPermission({ claims, setClaims, setEditPermOpen, editPermOpen, toBeEditedPerm }) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(editPermOpen);
    const [checked, setChecked] = useState(true);
    const [isManageUser, setIsManageUser] = useState(false);
    const [isManageRole, setIsManageRole] = useState(false);
    const [isManageInfo, setIsManageInfo] = useState(false);
    const [data, setData] = useState({
        id: "",   
        claimValue: ""
    })

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    /*;

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }    
   
    */

    const handleClose = () => {
        setEditPermOpen(false);
        setClaims([]);
    };

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleSubmit = () => {         
        axios.put(`https://localhost:7020/api/Permission?roleId=${toBeEditedPerm}`, data ,config)    
        .then(response => {            
          console.log(response);
          setOpen(false);
          window.location.reload();
        })
          .catch(error => {
            console.log(error);
          });
    }

    useEffect(() => {
        claims.map(claim => {
            if (claim == "ManageUser") {
                setIsManageUser(true);
            }
            if (claim == "ManageInformations") {
                setIsManageInfo(true);
            }
            if (claim == "ManageRoles") {
                setIsManageRole(true);
            }
        })
    }, [claims])

    return (
        <Dialog open={open} onClose={handleClose}>
            <div className="editPerm">
                <DialogTitle>Edit Role</DialogTitle>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox checked={isManageRole} onChange={handleChange} />
                        }
                        label="Manage Roles"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={isManageUser} onChange={handleChange} />
                        }
                        label="Manage User"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={isManageInfo} onChange={handleChange} />
                        }
                        label="Manage Informations"
                    />
                </FormGroup>
                <DialogActions>
                    <Button onClick={handleSubmit}>Apply</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </div>
        </Dialog >
    );
}

export default EditPermission;