import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../Auth/Auth.js';
import Alert from 'react-bootstrap/Alert';
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";

function Login() {
    const { setAuthTokens, dispatch } = useAuth();
    const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [data, setData] = useState({
        Username: '',
        Password: '',
    });

    const handleChangeValue = (field, value) => {
        setData({ ...data, [field]: value });
    }

    const handleLogin = () => {
        setAlertOpen(false);
        axios.post(`https://localhost:7020/api/Auth/LoginUser`, data)
            .then(response => {
                if (response.data.authenticateResult) {
                    dispatch({ type: 'login', token: response.data.authToken, expireDate: response.data.accessTokenExpireDate, userId: response.data.userId })
                    setAlertOpen('success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
                else {
                    setAlertOpen('danger');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    function onChange(value) {
        setIsCaptchaSuccess(true);
        //console.log("Captcha value:", value);
    }

    return (
        <div className='box'>
            {alertOpen == "success" &&
                <Alert variant={alertOpen}>
                    Login successful!
                </Alert>}
            {alertOpen == "danger" &&
                <Alert variant={alertOpen}>
                    Invalid username or password!
                </Alert>}
            <Card bg="light" style={{ width: '22rem' }}>
                <Card.Header>Login</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email"
                                    onChange={(e) => handleChangeValue("Username", e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password"
                                    onChange={(e) => handleChangeValue("Password", e.target.value)} />
                            </Form.Group>                           
                            <ReCAPTCHA                                
                                sitekey="6LdeWJcpAAAAAPliznncDgjSE38TDF7yS6wAm1vv"
                                onChange={onChange}
                            />                           
                            <br/>
                            <Button disabled={!isCaptchaSuccessful} onClick={handleLogin} variant="primary">Login</Button>
                        </Form>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Login;