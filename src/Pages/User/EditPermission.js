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

function EditPermission({ userClaims, setUserClaims, setEditPermOpen, editPermOpen, toBeEditedPerm }) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(editPermOpen);
    const [checked, setChecked] = useState(true);
    const [data, setData] = useState([]);
    const [manageUser, setManageUser] = useState({
        userId: toBeEditedPerm,
        claimType: 'ManageUser',
        claimValue: false,
    });
    const [manageRole, setManageRole] = useState({
        userId: toBeEditedPerm,
        claimType: 'ManageRoles',
        claimValue: false
    });
    const [manageInfo, setManageInfo] = useState({
        userId: toBeEditedPerm,
        claimType: 'ManageInformations',
        claimValue: false
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
        setUserClaims([]);
    };

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const postRequestForPolicy = () => {
        ; debugger
        axios.put(`https://localhost:7020/api/Permission/edituserPolicy`, data, config)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSubmit = () => {
        [manageUser, manageRole, manageInfo].map(claim => {
            if (claim.claimType == 'ManageUser') {
                if (claim.claimValue === true) {
                    setData((prev) => [...prev, { ...claim, claimValue: 'True' }])
                }
                else {
                    setData((prev) => [...prev, { ...claim, claimValue: 'False' }])
                }
            }
            if (claim.claimType == 'ManageRoles') {
                if (claim.claimValue === true) {
                    setData((prev) => [...prev, { ...claim, claimValue: 'True' }])
                }
                else {
                    setData((prev) => [...prev, { ...claim, claimValue: 'False' }])
                }
            }
            if (claim.claimType == 'ManageInformations') {
                if (claim.claimValue === true) {
                    setData((prev) => [...prev, { ...claim, claimValue: 'True' }])
                }
                else {
                    setData((prev) => [...prev, { ...claim, claimValue: 'False' }])
                }

            }
        })
    }

    useEffect(() => {
        userClaims.map(claim => {
            if (claim.claimType == "ManageUser") {
                setManageUser({ ...manageUser, id: claim.id, claimType: claim.claimType, claimValue: claim.claimValue == 'True' ? true : false });
            }
            if (claim.claimType == "ManageInformations") {
                setManageInfo({ ...manageInfo, id: claim.id, claimType: claim.claimType, claimValue: claim.claimValue == 'True' ? true : false });
            }
            if (claim.claimType == "ManageRoles") {
                setManageRole({ ...manageRole, id: claim.id, claimType: claim.claimType, claimValue: claim.claimValue == 'True' ? true : false });
            }
        })
    }, [userClaims]);

    useEffect(() => {
        if (data.length > 0) {
            postRequestForPolicy();
        }
    }, [data])


    return (
        <Dialog open={open} onClose={handleClose}>
            <div className="editPerm">
                <DialogTitle>Edit Permissions</DialogTitle>
                <FormGroup>
                    {/*[manageUser,manageInfo,manageUser].map(claim => )*/}
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