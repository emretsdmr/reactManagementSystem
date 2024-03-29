import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import Alert from 'react-bootstrap/Alert';

function Register() {
    const [alertOpen, setAlertOpen] = useState(false);
    const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false);
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
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

    function onChange(value) {
        setIsCaptchaSuccess(true);
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
            <Card bg="light" style={{ width: '22rem' }}>
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
                            <ReCAPTCHA                                
                                sitekey="6LdeWJcpAAAAAPliznncDgjSE38TDF7yS6wAm1vv"
                                onChange={onChange}
                            />                           
                            <br/>
                            <Button disabled={!isCaptchaSuccessful} onClick={handleRegister} variant="primary">Register</Button>
                        </Form>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Register;