import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Informations from './Informations';
import UserRoles from '../UserRoles';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

function Users() {
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState();
    const [filteredUser, setFilteredUser] = useState();
    const [infoOpen, setInfoOpen] = useState(false);
    const [roleOpen, setRoleOpen] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState();
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
    const [userIdForInfo, setUserIdForInfo] = useState();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleInfo = (id) => {
        setInfoOpen(true);
        setUserIdForInfo(id);
    }

    const handleRoles = (id) => {
        setRoleOpen(true);
        setUserIdForInfo(id);
    }

    const deleteUser = (id) => {
        let userId = localStorage.getItem("userId");
        if (id == userId) {
            console.log("You can't delete yourself!");
            setAlertOpen(true);
            setAlertMessage("You can't delete yourself!");
        }
        else {
            setDeleteUserOpen(true);
            setToBeDeleted(id);
        }

    }

    const handleDelete = () => {
        axios.delete(`https://localhost:7020/api/User?userId=${toBeDeleted}`)
            .then(response => {
                setToBeDeleted(null);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const findUser = (value) => {
        users.map(user => {
            if (user.userName === value) {
                setFilteredUser(user);
            }
            if (value == "") {
                setFilteredUser();
            }
        })
    }

    const handleChangeValue = (value) => {
        findUser(value);
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        axios.get(`https://localhost:7020/api/User`, config)
            .then(response => {
                setIsAuthorized(true);
                setUsers(response.data);
            })
            .catch(error => {
                console.log(error);
                if (error.code = "ERR_BAD_REQUEST") {
                    setIsAuthorized(false);
                }
            });
    }, [])

    return (
        <div className='content'>
            {isAuthorized ? <>
                <br />
                <Alert key="secondary" variant="secondary">
                    Users
                </Alert>
                {alertOpen &&
                    <Alert variant="danger">
                        {alertMessage}
                    </Alert>}
                {roleOpen &&
                    <UserRoles
                        userIdForInfo={userIdForInfo}
                        setUserIdForInfo={setUserIdForInfo}
                        roleOpen={roleOpen}
                        setRoleOpen={setRoleOpen}
                    />
                }
                {infoOpen &&
                    <Informations
                        userIdForInfo={userIdForInfo}
                        setUserIdForInfo={setUserIdForInfo}
                        infoOpen={infoOpen}
                        setInfoOpen={setInfoOpen}
                    />
                }
                <Dialog open={deleteUserOpen && toBeDeleted} onClose={() => setToBeDeleted(null)}>
                    <DialogTitle>Are you sure to delete this user?</DialogTitle>
                    <DialogActions>
                        <Button variant="contained" onClick={() => setToBeDeleted(null)}>No</Button>
                        <Button variant="contained" onClick={handleDelete}>Yes</Button>
                    </DialogActions>
                </Dialog>
                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm"><SearchIcon />Username:</InputGroup.Text>
                    <Form.Control
                        onChange={(e) => handleChangeValue(e.target.value)}
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                    />
                    <InputGroup.Text id="inputGroup-sizing-sm"><button onClick={() => setFilteredUser(null)}><RestartAltIcon /></button></InputGroup.Text>
                </InputGroup>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Informations</th>
                            <th>Role(s)</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUser ?
                            <>
                                <tr>
                                    <td>{filteredUser.id}</td>
                                    <td>{filteredUser.userName}</td>
                                    <td>{filteredUser.email}</td>
                                    <td><button onClick={() => handleInfo(filteredUser.id)}>{filteredUser.informations.length}</button></td>
                                    <td><button onClick={() => handleRoles(filteredUser.id)}><SupervisedUserCircleIcon /></button></td>
                                    <td><button onClick={() => deleteUser(filteredUser.id)}><DeleteIcon /></button></td>
                                </tr>
                            </>
                            :
                            <>
                                {users?.map(user => (
                                    <tr>
                                        <td>{user.id}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td><button onClick={() => handleInfo(user.id)}>{user.informations.length}</button></td>
                                        <td><button onClick={() => handleRoles(user.id)}><SupervisedUserCircleIcon /></button></td>
                                        <td><button onClick={() => deleteUser(user.id)}><DeleteIcon /></button></td>
                                    </tr>
                                ))}
                            </>
                        }
                    </tbody>
                </Table></>
                :
                <>
                    <br />
                    <Alert variant="danger">
                        You are not authorized!
                    </Alert>
                </>}
        </div>
    );
}

export default Users;