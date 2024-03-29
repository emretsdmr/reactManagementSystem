import { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import UserLogo from './user.png'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import LockIcon from '@mui/icons-material/Lock';
import ResetPassword from './ResetPassword';
import ResetUsername from './ResetUsername';
import BadgeIcon from '@mui/icons-material/Badge';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function Profile({ userId }) {
    var token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const [userRoles, setUserRoles] = useState();
    const [resetUsernameOpen, setResetUsernameOpen] = useState(false);
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [profileLetter, setProfileLetter] = useState();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const config = {
        mode: 'cors',
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        axios.get(`https://localhost:7020/api/User/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setUser(response.data);
                setProfileLetter(Array.from(response.data.userName)[0])
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        axios.get(`https://localhost:7020/api/Role/UserRole?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setUserRoles(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    return (
        <div className='profile'>
            {resetUsernameOpen &&
                <ResetUsername
                    currentUsername={user.userName}
                    resetUsernameOpen={resetUsernameOpen}
                    setResetUsernameOpen={setResetUsernameOpen}
                    userId={userId}
                />
            }
            {resetPasswordOpen &&
                <ResetPassword
                    resetPasswordOpen={resetPasswordOpen}
                    setResetPasswordOpen={setResetPasswordOpen}
                    userId={userId}
                />
            }
            <Alert key="secondary" variant="secondary">
                Profile
            </Alert>
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {profileLetter}
                        </Avatar>
                    }
                    title={user?.userName}
                    subheader={"Informations: " + user?.informations.length}
                />
                <CardMedia
                    component="img"
                    height="330"
                    image={UserLogo}
                    alt="Paella dish"
                />
                <CardContent>
                    <Typography>
                        Roles:
                        <Typography variant="body2" color="text.secondary">{userRoles?.map(role => role.roleName) + ","}</Typography>
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton onClick={() => setResetUsernameOpen(true)} aria-label="add to favorites">
                        <BadgeIcon /> <Typography variant="caption" color="text.secondary">Change Username</Typography>
                    </IconButton>
                    <IconButton onClick={() => setResetPasswordOpen(true)} aria-label="add to favorites">
                        <LockIcon /> <Typography variant="caption" color="text.secondary">Change Password</Typography>
                    </IconButton>
                </CardActions>
            </Card>
        </div>

    );
}

export default Profile;