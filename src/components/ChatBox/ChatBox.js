import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import profilePic from '../../profile_picture.jpg';
import { useHistory, useParams } from 'react-router';
import { userContext } from '../../App';
import OwnMessage from '../OwnMessage/OwnMessage';
import FriendMessage from '../FriendMessage/FriendMessage';
import './ChatBox.css';

const ChatBox = () => {
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const [friend, setFriend] = useState({});
    const [message, setMessage] = useState();
    const [chats, setChats] = useState([]);
    const {id} = useParams();
    const history = useHistory();

    useEffect( () => {
        fetch(`https://pacific-sea-17806.herokuapp.com/userById/${id}`)
        .then(res => res.json())
        .then(data => {
            setFriend(data);
            fetch('https://pacific-sea-17806.herokuapp.com/chatsByEmails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([loggedInUser.email, data.email])
            })
            .then(res => res.json())
            .then(documents => setChats(documents))
        });
    })

    const handleBlur = (event) => {
        setMessage(event.target.value);
    }

    const handleSendBtn = () => {
        const chatMessage = {
            from: loggedInUser.email,
            to: friend.email,
            message: message,
            time: new Date(),
            status: 'unseen'
        }
        fetch('https://pacific-sea-17806.herokuapp.com/chats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatMessage)
        })
        .then(res => {
            if(res){
                document.getElementById('message').value = "";
            }
        })
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={8} className="bg-white">
                    <Row className="justify-content-md-center fixed-top pl-3 pr-3">
                        <Col md={6} className="d-flex p-2 header">
                        <button className="btn" onClick={() => history.goBack()}><FontAwesomeIcon icon={faArrowLeft} className="text-white"/></button>
                        <h5 className="text-white mt-2 ml-5">{friend?.name}</h5>
                        <Image className="ml-auto" width="50" height="50" src={friend?.photo || profilePic} alt="" roundedCircle/>
                        </Col>
                    </Row>
                    <div className="mt-5 pt-3">
                        {
                            chats.map(chat => chat.from === loggedInUser.email ? <OwnMessage chat={chat} key={chat._id}></OwnMessage> : <FriendMessage chat={chat} friendPhoto={friend.photo} key={chat._id}></FriendMessage>)
                        }
                    </div>
                    <Row className="justify-content-md-center fixed-bottom p-3">
                        <Col md={6} className="d-flex">
                            <Form.Control type="text" id="message" onBlur={handleBlur} placeholder="Write message" />
                            <button className="btn btn-primary" onClick={handleSendBtn}>Send</button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ChatBox;