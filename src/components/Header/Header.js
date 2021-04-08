import React, { useContext } from 'react';
import { Image, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { userContext } from '../../App';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faUserFriends, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import profilePic from '../../profile_picture.jpg';

const Header = () => {
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="fixed-top">
            <Link to="/preferrence">
                <Image
                    src={loggedInUser.photo || profilePic}
                    width="40"
                    height="40"
                    className="d-inline-block align-top"
                    alt=""
                    roundedCircle
                />
            </Link>
            <div className="ml-auto">

                <Link className="link" to="/chats"><FontAwesomeIcon icon={faEnvelope} className="text-white"/> Chats </Link>
                <Link className="link" to="/friends"><FontAwesomeIcon icon={faUserFriends} className="text-white"/> Friends </Link>
                <Link className="link" to="/addFriends"><FontAwesomeIcon icon={faUserPlus} className="text-white"/> Add Friends </Link>
                {/* Dynamically change login button to user image */}
                {/* {
                    loggedInUser.email ? <Image src={loggedInUser.photo} alt={loggedInUser.name} style={{width:'40px', height:'40px', marginRight:'60px'}} roundedCircle/> : <Link className="link" to="/login"><button id="login-btn">Login</button></Link>
                } */}
            </div>
        </Navbar>
    );
};

export default Header;