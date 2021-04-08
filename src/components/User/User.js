import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import profilePic from '../../profile_picture.jpg';
import { Link } from 'react-router-dom';

const User = ({user, handleAddBtn}) => {
    return (
        <Row>
            <Col>
                <Row className="bg-white" style={{border:'1px solid lightgray',borderRadius:'5px'}}>
                    <Col className="d-flex p-1">
                        <Image width="50" height="50" src={user.photo || profilePic} alt="" roundedCircle/>
                        <Link to={`chat/${user._id}`}><h6 className="mt-3 ml-5 text-dark">{user.name}</h6></Link>
                        {
                            handleAddBtn && <button className="ml-auto btn" onClick={() => handleAddBtn(user.email)}><FontAwesomeIcon icon={faUserPlus} /></button>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default User;