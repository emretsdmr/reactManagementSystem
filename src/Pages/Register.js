import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function Register() {
    const [alertOpen, setAlertOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true)
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const validData = () => {
        if (data.email.length && data.password.length > 6) {
            setIsDisabled(false);
        }
    }

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
        validData();
    }

    const handleRegister = () => {
        setAlertOpen(false);
        axios.post(`https://localhost:7020/register`, data)
            .then(response => {
                setAlertOpen('success');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            })
            .catch(error => {
                setAlertOpen('danger');
                console.log(error);
            });
    }

    return (
        <div className='box'>
            {alertOpen == "success" &&
                <Alert variant={alertOpen}>
                    You've successfully registered!
                </Alert>}
            {alertOpen == "danger" &&
                <Alert variant={alertOpen}>
                    Invalid email or password!
                </Alert>}
            <Card bg="light" style={{ width: '18rem' }}>
                <Card.Header>Register</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email"
                                    onChange={(e) => handleChangeValue("email", e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password"
                                    onChange={(e) => handleChangeValue("password", e.target.value)} />
                            </Form.Group>
                            <Button disabled={isDisabled} onClick={handleRegister} variant="primary">Register</Button>
                        </Form>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Register;