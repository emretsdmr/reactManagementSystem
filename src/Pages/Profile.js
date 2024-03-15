import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';

function Profile() {
    const [user, setUser] = useState();
    var token = localStorage.getItem("token");

    const config = {
        mode: 'cors',
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        let userId = localStorage.getItem("userId");
        axios.get(`https://localhost:7020/api/User/${userId}`,{
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
        <div className='content'>
        <div className='profile'>
        <Alert key="secondary" variant="secondary">
                Profile
            </Alert>
            <Card>
                <Card.Img variant="top" src="holder.js/100px160" />
                <Card.Body>
                    <Card.Title>{user?.userName}</Card.Title>
                    <Card.Text>
                        Email: {user?.email}
                        <br/>
                        Informations: {user?.informations.length}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted"></small>
                </Card.Footer>
            </Card>
        </div>
        </div>
    );
}

export default Profile;