import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { userContext } from '../../App';
import Header from '../Header/Header';
import User from '../User/User';

const Chats = () => {
    const [chatFriendsData, setChatFriendsData] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [loggedInUser, setLoggedInUser] = useContext(userContext);

    useEffect(() => {
        setSpinner(true);
        fetch(`http://localhost:5000/chatFriends/${loggedInUser.email}`)
            .then(res => res.json())
            .then(data => {
                fetch('http://localhost:5000/userByEmails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(res => res.json())
                    .then(data => {
                        setChatFriendsData(data);
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
                            !spinner && !chatFriendsData.length && <h6 className="text-danger text-center">You have no chats</h6>
                        }
                        {
                            chatFriendsData?.map(user => <User user={user} key={user._id}></User>)
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Chats;