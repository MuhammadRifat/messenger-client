import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { userContext } from '../../App';
import Header from '../Header/Header';
import User from '../User/User';

const AddFriends = () => {
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const [users, setUsers] = useState([]);
    const [spinner, setSpinner] = useState(false);
    useEffect(() => {
        setSpinner(true);
        fetch('https://pacific-sea-17806.herokuapp.com/users')
            .then(res => res.json())
            .then(documents => {
                const email = loggedInUser.email;
                fetch(`https://pacific-sea-17806.herokuapp.com/friendsByEmail/${email}`)
                    .then(res => res.json())
                    .then(data => {
                        const friendsEmail = data.map(friend => {
                            if (friend.friend1 === loggedInUser.email) {
                                return friend.friend2;
                            }
                            else {
                                return friend.friend1
                            }
                        });
                        fetch('https://pacific-sea-17806.herokuapp.com/userByEmails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(friendsEmail)
                        })
                            .then(res => res.json())
                            .then(data => {
                                let container = [];
                                documents.map(user => {
                                    const newUser = data.find(friend => friend.email === user.email);
                                    if (!newUser) {
                                        container = [...container, user];
                                    }
                                })
                                const allUser = container.filter(user => user.email !== loggedInUser.email);
                                setUsers(allUser);
                                setSpinner(false);
                            })
                    })
            })
    }, [])

    const handleAddBtn = (email) => {
        setSpinner(true);
        const friend = { friend1: loggedInUser.email, friend2: email }
        fetch(`https://pacific-sea-17806.herokuapp.com/addFriend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(friend)
        })
            .then(res => {
                if (res) {
                    const allUser = users.filter(user => user.email !== email);
                    setUsers(allUser);
                    setSpinner(false);
                }
            })

    }

    return (
        <div>
            {
                loggedInUser.email && <Header />
            }
        <Container className="mt-5 pt-3">
            <Row className="justify-content-md-center mt-4">
                <Col md={6} className="d-flex">
                    <Form.Control type="text" placeholder="Search" />
                    <button className="btn btn-success" onClick="">Search</button>
                </Col>
            </Row>
            {
                spinner && <div className="text-center mt-3"><Spinner animation="border" /></div>
            }
            <Row className="justify-content-md-center mt-3">
                <Col md={8}>
                    {
                        users?.map(user => <User user={user} handleAddBtn={handleAddBtn} key={user._id}></User>)
                    }
                </Col>
            </Row>
        </Container>
        </div>
    );
};

export default AddFriends;