import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { userContext } from '../../App';
import Header from '../Header/Header';
import User from '../User/User';

const Friend = () => {
    const [friends, setFriends] = useState([]);
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        setSpinner(true);
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
                        setFriends(data);
                        setSpinner(false);
                    })
            })
    }, [])

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
                            !spinner && !friends.length && <h6 className="text-danger text-center">You have no friends</h6>
                        }
                        {
                            friends?.map(user => <User user={user} key={user._id}></User>)
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Friend;