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

function EditPermission({ roleClaims, setRoleClaims, setEditPermOpen, editPermOpen, toBeEditedPerm }) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(editPermOpen);
    const [checked, setChecked] = useState(true);
    const [manageUser, setManageUser] = useState({
        id: '',
        claimType: '',
        claimValue: ''
    });
    const [manageRole, setManageRole] = useState({
        id: '',
        claimType: '',
        claimValue: ''
    });
    const [manageInfo, setManageInfo] = useState({
        id: '',
        claimType: '',
        claimValue: ''
    });

    const handleChange = (checked, claim) => {
        if (claim == 'manageUser') {
            setManageUser({ ...manageUser, claimValue: checked })
        }
        if (claim == 'manageInfo') {
            setManageInfo({ ...manageInfo, claimValue: checked })
        }
        if (claim == 'manageRole') {
            setManageRole({ ...manageRole, claimValue: checked })
        }
    };

    const handleClose = () => {
        setEditPermOpen(false);
        setRoleClaims([]);
    };

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };    

    const handleSubmit = () => {
        axios.put(`https://localhost:7020/api/Permission/updateRolePolicies?roleId=${toBeEditedPerm}`, [manageInfo,manageUser,manageRole], config)
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
        roleClaims.map(claim => {
            if (claim.claimType == "ManageUser") {
                setManageUser({ ...manageUser, id: claim.id, claimType: claim.claimType, claimValue: claim.claimValue ==='True' ? true : false });
            }
            if (claim.claimType == "ManageInformations") {
                setManageInfo({ ...manageUser, id: claim.id, claimType: claim.claimType, claimValue: claim.claimValue ==='True' ? true : false });
            }
            if (claim.claimType == "ManageRoles") {
                setManageRole({ ...manageUser, id: claim.id, claimType: claim.claimType, claimValue: claim.claimValue ==='True' ? true : false });
            }
        })
    }, [roleClaims]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <div className="editPerm">
                <DialogTitle>Edit Permissions</DialogTitle>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox checked={manageRole.claimValue} onChange={(event) => handleChange(event.target.checked, 'manageRole')} />
                        }
                        label="Manage Roles"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={manageUser.claimValue} onChange={(event) => handleChange(event.target.checked, 'manageUser')} />
                        }
                        label="Manage User"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={manageInfo.claimValue} onChange={(event) => handleChange(event.target.checked, 'manageInfo')} />
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