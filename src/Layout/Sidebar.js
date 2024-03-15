import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/Auth.js";
import Divider from '@mui/material/Divider';
import Alert from 'react-bootstrap/Alert';

function Sidebar() {
    const { dispatch } = useAuth();
    const navItems = [
        ['Home', '/'],
        ['Profile', '/profile'],
        ['Users', '/users'],
        ['Roles', '/roles'],
        ['My Infos', '/myinformations']
    ];

    const handleLogout = () => {
        dispatch({ type: 'logout' })
        window.location.reload();
    }

    return (
        <div className="sidebar">
            <List>
                {navItems.map(([value, path]) => (
                    <ListItem key={value} >
                        <Link to={path}>
                            <ListItemButton sx={{ textAlign: 'center' }}>
                                <ListItemText primary={value} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
                <Divider />
                <Divider />
                <br />
                <ListItem><ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
                    <ListItemText primary="Logout" />
                </ListItemButton></ListItem>
            </List>
        </div>
    );
}

export default Sidebar;