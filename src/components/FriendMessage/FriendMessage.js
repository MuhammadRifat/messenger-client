import React from 'react';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import profilePic from '../../profile_picture.jpg';

const FriendMessage = ({ chat, friendPhoto }) => {
    return (
        <div className="friend-message">
            <Image className="ml-auto" width="30" height="30" src={friendPhoto || profilePic} alt="" roundedCircle />
            {/* <span>{chat.message}</span> */}
            <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-disabled">{new Date(chat.time).toDateString('dd/mm/yy')}</Tooltip>}>
                <span>
                {chat.message}
                </span>
            </OverlayTrigger>
        </div>
    );
};

export default FriendMessage;