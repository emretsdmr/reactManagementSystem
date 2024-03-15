import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddInformation from "./AddInformation";
import EditInformation from "./EditInformation";

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
        axios.delete(`https://localhost:7020/api/Information?infoId=${toBeDeleted}`,config)
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
        axios.get(`https://localhost:7020/api/Information/${userIdForInfo}`,config)
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
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Informations</DialogTitle>
                {informations?.length > 0 ?
                    <div className="box">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {informations?.map(info => (
                                    <tr>
                                        <td>{info.title}</td>
                                        <td>{info.description}</td>
                                        <td><button onClick={() => editInfo(info)}><EditIcon /></button></td>
                                        <td><button onClick={() => deleteInfo(info.id)}><DeleteIcon /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                            <br />
                            <Button variant="outlined" onClick={() => setAddInfoOpen(true)}>Add Info</Button>
                        </Table>
                    </div>
                    :
                    <div className="box"><h5>No informations found!</h5><br />
                        <Button variant="outlined" onClick={() => setAddInfoOpen(true)}>Add Info</Button></div>
                }
            </Dialog>
        </div>
    );
}

export default Informations;