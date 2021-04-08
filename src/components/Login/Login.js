import React, { useContext, useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { userContext } from '../../App';
import { firebaseConfigFrameWork, handleFbSignIn, handleGoogleSignIn, handleLogIn, handleSignUp } from './LoginManager';

const Login = () => {
    // access firebase config
    firebaseConfigFrameWork();
    const [newUser, setNewUser] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailValid: true,
        passwordValid: true,
        confirmPasswordValid: true,
        error: ''
    });
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    // For using sign in with google
    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                if (res.email) {
                    handleLogInUser(res, true);
                }
                else {
                    const newUser = {
                        error: res
                    }
                    setLoggedInUser(newUser);
                }
            })
    }

    // For using sign in with facebook
    const fbSignIn = () => {
        handleFbSignIn()
            .then(res => {
                if (res.email) {
                    handleLogInUser(res, true);
                }
                else {
                    const newUser = {
                        error: res
                    }
                    setLoggedInUser(newUser);
                }
            })
    }

    // For using login and signup
    const handleSubmit = (event) => {
        if (!newUser && user.email && user.password) {
            setSpinner(true);
            handleLogIn(user.email, user.password)
                .then(res => {
                    if (res.email) {
                        handleLogInUser(res, true);
                    }
                    else {
                        const newUser = {
                            error: res
                        }
                        setLoggedInUser(newUser);
                        setSpinner(false);
                    }
                })
        }
        if (newUser && user.email && user.password && user.confirmPassword) {
            setSpinner(true);
            if (user.password.length === user.confirmPassword.length) {
                handleSignUp(user.name, user.email, user.confirmPassword)
                    .then(res => {
                        if (res.email) {
                            handleLogInUser(res, false);
                            const userDetail = { ...user };
                            userDetail.error = "";
                            setUser(userDetail);
                            setSpinner(false);
                        }
                        else {
                            const newUser = {
                                error: res
                            }
                            setLoggedInUser(newUser);
                            const userDetail = { ...user };
                            userDetail.error = "";
                            setUser(userDetail);
                            setSpinner(false);
                        }
                    })
            }
            else {
                const userDetail = { ...user };
                userDetail.error = "Confirm password do not match";
                setUser(userDetail);
                setSpinner(false);
            }
        }
        event.preventDefault();
    }

    // For accessing user information from input and validating data
    const handleBlur = (event) => {
        let isValid = true;
        if (event.target.name === 'email') {
            isValid = /\S+@\S+\.\S+/.test(event.target.value);
        }
        if (event.target.name === 'password') {
            isValid = event.target.value.length >= 6 && /\d{1}/.test(event.target.value);
        }
        if (isValid) {
            const newUser = { ...user };
            newUser[event.target.name] = event.target.value;
            newUser[event.target.name + "Valid"] = true;
            setUser(newUser);
        }
        else {
            const newUser = { ...user };
            newUser[event.target.name + "Valid"] = false;
            setUser(newUser);
        }
    }

    // For using to reduce repetition code
    const handleLogInUser = (res, isReplace) => {
        const newUser = {
            isSignIn: true,
            email: res.email,
            name: res.displayName || user.name,
            error: '',
            photo: res.photoURL,
            success: true
        }
        setLoggedInUser(newUser);
        const email = newUser.email;
        fetch(`http://localhost:5000/user/${email}`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    isReplace && history.replace(from);
                }
                else {
                    fetch('http://localhost:5000/addUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newUser)
                    })
                        .then(res => {
                            if (res) {
                                isReplace && history.replace(from);
                            }
                        })
                }
            })
    }

    // Conditionally showing log in and create new account button
    const handleLogInOrCreate = () => {
        setNewUser(!newUser);
        const newLoggedInUser = { ...loggedInUser };
        newLoggedInUser.error = '';
        setLoggedInUser(newLoggedInUser);
        const userDetail = { ...user };
        userDetail.error = '';
        setUser(userDetail);
    }
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6} className="mt-4">
                    <div className="bg-white p-4" style={{ border: '2px solid lightgray', borderRadius: '5px' }}>
                        {newUser ? <h4>Create an account</h4> : <h4>Log In</h4>}
                        {
                            user.error && <h6 style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{user.error}</h6>
                        }
                        {
                            loggedInUser.error && <h6 style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{loggedInUser.error}</h6>
                        }
                        {
                            loggedInUser.email && <h6 style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>Sign up successful</h6>
                        }
                        <form className="login-form" onSubmit={handleSubmit}>
                            {
                                spinner && <Spinner className="text-center" animation="border" />
                            }
                            {
                                newUser && <input type="text" onBlur={handleBlur} name="name" placeholder="Name" required />
                            }
                            <br /><input type="text" onBlur={handleBlur} name="email" placeholder="Email" required /><br />
                            {!user.emailValid && <span style={{ color: 'red' }}>Enter a valid email</span>}
                            <input type="password" onBlur={handleBlur} name="password" placeholder="Password" required /><br />
                            {!user.passwordValid && <span style={{ color: 'red' }}>Enter a valid password (at least 6 character and number)</span>}
                            {
                                newUser && <input type="password" onBlur={handleBlur} name="confirmPassword" placeholder="Confirm password" required />
                            }
                            <br /><input id="submit-btn" type="submit" value={newUser ? "Create an account" : "Login"} />
                        </form>
                        <h6 className="mt-3 text-center">{newUser ? <span>Already have an account?<button className="create-btn" onClick={() => handleLogInOrCreate()}>Login</button></span> : <span>Don't have an account? <button className="create-btn" onClick={() => handleLogInOrCreate()}>Create an account</button></span>}</h6>
                    </div>
                    <hr />
                    <h5 className="text-center">Or</h5>
                    <hr />
                    <div className="text-center social-btn">
                        <button onClick={googleSignIn}><FontAwesomeIcon icon={faGoogle} size="lg" /> Continue With Google</button><br />
                        <button onClick={fbSignIn}><FontAwesomeIcon icon={faFacebook} size="lg" /> Continue With Facebook</button>
                    </div>

                </Col>
            </Row>
        </Container>
    );
};

export default Login;