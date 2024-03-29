import * as React from 'react';
import List from '@mui/material/List';
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/Auth.js";
import Divider from '@mui/material/Divider';
import Button from 'react-bootstrap/Button';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';


function Sidebar() {
    const { dispatch } = useAuth();
    const anchor = "left";
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, left: open });
    };

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
        <div>
            <React.Fragment key={anchor}>
                <div className="sidebarButton">
                <Button size='sm' onClick={toggleDrawer(anchor, true)} variant="light"><MenuIcon/></Button>
                </div>
                <Drawer

                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                >
                    <Box
                        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 200 }}
                        role="presentation"
                        onClick={toggleDrawer(anchor, false)}
                        onKeyDown={toggleDrawer(anchor, false)}
                    >
                        <div className="sidebar">
                            <List>
                                {navItems.map(([value, path]) => (
                                    <Link to={path}>
                                        {value}
                                    </Link>
                                ))}
                                <br />
                                <Divider />
                                <Divider />
                                <Divider />
                                <br />
                                <Button variant="danger" onClick={handleLogout}>
                                    <PowerSettingsNewIcon />
                                </Button>
                            </List>
                        </div>
                    </Box>
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export default Sidebar;