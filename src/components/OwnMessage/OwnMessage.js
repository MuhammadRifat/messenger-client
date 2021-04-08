import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const OwnMessage = ({chat}) => {
    return (
        <div className="own-message">
            {/* <span>{chat.message}</span> */}
            <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip-disabled">{new Date(chat.time).toDateString('dd/mm/yy')}</Tooltip>}>
                <span>
                {chat.message}
                </span>
            </OverlayTrigger>
        </div>
    );
};

export default OwnMessage;