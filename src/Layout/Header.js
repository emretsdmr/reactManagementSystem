import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import HeaderLogo from './logo2.png'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Button from '@mui/material/Button';
import { useAuth } from "../Auth/Auth.js";

function Header({ userId }) {
    var token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const { dispatch } = useAuth();

    const handleLogout = () => {
        dispatch({ type: 'logout' })
        window.location.reload();
    }

    useEffect(() => {
        axios.get(`https://localhost:7020/api/User/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    return (
        <div className="header">
            <Navbar.Brand href="/"><img height={30} src={HeaderLogo} />
                &nbsp;
                Management System
            </Navbar.Brand>
        </div>
    );
}

export default Header;