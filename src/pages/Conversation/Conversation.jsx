import React, { useEffect, useState } from 'react';
import './Conversation.css';
import axios from "axios";
import PropTypes from 'prop-types';

function Conversation({ conversation, currentUser }) {

    const [user, setUser] = useState(null)

    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);
        // console.log(conversation);
        // console.log(friendId);

        const getUser = async () => {
            try {
                // const res = await axios('http://localhost:4005/users?userId=' + friendId)
                // const res = await axios(`http://localhost:4005/users?userId=${friendId}`);
                const res = await axios(`http://localhost:4005/users/${friendId}`);

                // setUser(res.data)
                setUser(res.data.data);
                // console.log(res);
            } catch (err) {
                console.log(err);
            }
        }
        getUser()
    }, [currentUser, conversation])

    return (
        <div className='messages-user-panel'>

            <div className='messagesPicContainer'>
                <img
                    className='messagesUserPic'
                    src={user?.profilePicture}
                    alt="user Picture"
                />
            </div>

            <div>
                <span className="conversationName">{user?.username} </span>
                <div className='MessagesMassage'>
                    <p>tap to chat</p>
                </div>
            </div>
        </div>
    );
}
Conversation.propTypes = {
    conversation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};
export default Conversation;