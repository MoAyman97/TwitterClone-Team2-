import React from 'react';
import './WholeMessages.css';
import { formatDistanceToNow } from 'date-fns';

function WholeMessages({ message, own }) {
    return (
        <>
            <div className='TheRealMessages'>
                <div className='messageSentHolder'>

                    <div className={own ? 'message own' : 'message'}>
                        <div className='messageText'>
                            {message.text}
                            {/* <p></p> */}
                        </div>
                        <div className='messageTime'>
                            {message.createdAt && formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default WholeMessages;