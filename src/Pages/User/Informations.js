import { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddInformation from "./AddInformation";
import EditInformation from "./EditInformation";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

function Informations({ userIdForInfo, setUserIdForInfo, infoOpen, setInfoOpen }) {
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(infoOpen);
    const [informations, setInformations] = useState();
    const [toBeEdited, setToBeEdited] = useState();
    const [addInfoOpen, setAddInfoOpen] = useState(false)
    const [editInfoOpen, setEditInfoOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [toBeDeleted, setToBeDeleted] = useState(null);

    const editInfo = (info) => {
        setToBeEdited(info);
        setEditInfoOpen(true);
    }

    const deleteInfo = (id) => {
        setToBeDeleted(id);
        setDeleteOpen(true);
    }

    const handleClose = () => {
        setInfoOpen(false);
        setUserIdForInfo(null);
    }

    const handleDelete = () => {
        axios.delete(`https://localhost:7020/api/Information?infoId=${toBeDeleted}`, config)
            .then(response => {
                setToBeDeleted(null);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        axios.get(`https://localhost:7020/api/Information/${userIdForInfo}`, config)
            .then(response => {
                setInformations(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    return (
        <div>
            {addInfoOpen &&
                <AddInformation
                    userIdForInfo={userIdForInfo}
                    setAddInfoOpen={setAddInfoOpen}
                    addInfoOpen={addInfoOpen}

                />
            }
            {editInfoOpen &&
                <EditInformation
                    setEditInfoOpen={setEditInfoOpen}
                    editInfoOpen={editInfoOpen}
                    toBeEdited={toBeEdited}
                />
            }
            <Dialog open={deleteOpen && toBeDeleted} onClose={() => setToBeDeleted(null)}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogActions>
                    <Button variant="contained" onClick={() => setToBeDeleted(null)}>No</Button>
                    <Button variant="contained" onClick={handleDelete}>Yes</Button>
                </DialogActions>
            </Dialog>
            <Dialog maxWidth="md" fullWidth="true" open={open} onClose={handleClose}>
                <DialogTitle>Informations</DialogTitle>
                {informations?.length > 0 ?
                    <div className="adminInfo">
                        <Button variant="outlined" color='inherit' onClick={() => setAddInfoOpen(true)}>+</Button>
                        <br/><br/>
                        <TableContainer sx={{ width: 700, wordBreak: "break-word" }} component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={100}>Title</TableCell>
                                        <TableCell width={400}>Description</TableCell>
                                        <TableCell align="right">Edit</TableCell>
                                        <TableCell>Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {informations?.map(information => (
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {information.title}
                                            </TableCell>
                                            <TableCell>{information.description}</TableCell>
                                            <TableCell align="right"><Button color='inherit' onClick={() => editInfo(information)}><EditIcon /></Button></TableCell>
                                            <TableCell><Button color='inherit' onClick={() => deleteInfo(information.id)}><DeleteIcon /></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    :
                    <div className="box"><h5>No informations found!</h5><br />
                        <Button variant="outlined" onClick={() => setAddInfoOpen(true)}>+</Button></div>
                }
            </Dialog>
        </div>
    );
}

export default Informations;