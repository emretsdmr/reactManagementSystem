import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
import KeyIcon from '@mui/icons-material/Key';
import EditPermission from './EditPermission';

function Users() {
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState();
    const [filteredUser, setFilteredUser] = useState();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [infoOpen, setInfoOpen] = useState(false);
    const [roleOpen, setRoleOpen] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState();
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
    const [userIdForInfo, setUserIdForInfo] = useState();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [editPermOpen, setEditPermOpen] = useState(false);
    const [toBeEditedPerm, setToBeEditedPerm] = useState();
    const [userClaims, setUserClaims] = useState([]);

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

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleDelete = () => {
        axios.delete(`https://localhost:7020/api/User?userId=${toBeDeleted}`, config)
            .then(response => {
                setToBeDeleted(null);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const findUserT = (value) => {
        users.map(user => {
            if ((user.userName).includes(value)) {                
                filteredUsers.map(x => {       
                    ;debugger             
                    if(user.userName !== x.userName){                        
                        filteredUsers.push({user});
                    }
                })                
            }
            if (value == "") {
                setFilteredUsers();
            }
        })
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
        findUserT(value);
    }

    const editPermission = (id) => {
        setToBeEditedPerm(id);
        axios.get(`https://localhost:7020/api/Permission/getUserPolicies?userId=${id}`, config)
            .then(response => {
                response.data.map(d => {
                    setUserClaims((prev) => [...prev, {id: d.id, claimType:d.claimType, claimValue: d.claimValue}])
                })
            })
            .catch(error => {
                console.log(error);
            });
        setEditPermOpen(true);
    }

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
                {editPermOpen &&
                        <EditPermission
                            setEditPermOpen={setEditPermOpen}
                            editPermOpen={editPermOpen}
                            toBeEditedPerm={toBeEditedPerm}
                            userClaims={userClaims}
                            setUserClaims={setUserClaims}
                        />
                    }
                <Dialog open={deleteUserOpen && toBeDeleted} onClose={() => setToBeDeleted(null)}>
                    <DialogTitle>Are you sure to delete this user?</DialogTitle>
                    <DialogActions>
                        <Button color="error" variant="contained" onClick={() => setToBeDeleted(null)}>No</Button>
                        <Button color="success" variant="contained" onClick={handleDelete}>Yes</Button>
                    </DialogActions>
                </Dialog>
                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm"><SearchIcon />Username:</InputGroup.Text>
                    <Form.Control
                        onChange={(e) => handleChangeValue(e.target.value)}
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                    />
                    <InputGroup.Text id="inputGroup-sizing-sm"><Button color="inherit" onClick={() => setFilteredUser(null)}><RestartAltIcon /></Button></InputGroup.Text>
                </InputGroup>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Informations</TableCell>
                                <TableCell>Role(s)</TableCell>
                                <TableCell>Permissions</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUser ?
                                <>
                                    <TableRow
                                        key={filteredUser.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {filteredUser.userName}
                                        </TableCell>
                                        <TableCell>{filteredUser.userName}</TableCell>
                                        <TableCell>{filteredUser.email}</TableCell>
                                        <TableCell><button onClick={() => handleInfo(filteredUser.id)}>{filteredUser.informations.length}</button></TableCell>
                                        <TableCell><button onClick={() => handleRoles(filteredUser.id)}><SupervisedUserCircleIcon /></button></TableCell>                                        
                                        <TableCell><button onClick={() => deleteUser(filteredUser.id)}><DeleteIcon /></button></TableCell>
                                    </TableRow>
                                </> :
                                <>{users?.map(user => (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {user.id}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Button color='inherit' onClick={() => handleInfo(user.id)}>{user.informations.length}</Button></TableCell>
                                        <TableCell><Button color='inherit' onClick={() => handleRoles(user.id)}><SupervisedUserCircleIcon /></Button></TableCell>
                                        <TableCell><Button color='inherit' onClick={() => editPermission(user.id)}><KeyIcon /></Button></TableCell>
                                        <TableCell><Button color='inherit' onClick={() => deleteUser(user.id)}><DeleteIcon /></Button></TableCell>
                                    </TableRow>
                                ))}
                                </>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
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