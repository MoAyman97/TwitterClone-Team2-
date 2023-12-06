import React, { useEffect, useState, useRef } from 'react'
import './Messages.css'
import { Outlet, Link, NavLink } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Navbar from "../../components/big/navbar/navbar";
import Conversation from '../Conversation/Conversation';
import WholeMessages from '../WholeMessages/WholeMessages';
import axios from "axios";
import PropTypes from 'prop-types';
import { io } from 'socket.io-client'

function Messages() {

  const [user, setUser] = useState({})
  const [conversation, setConversation] = useState([])
  const userId = localStorage.getItem('ID')
  // console.log('User ID:', userId);
  const token = localStorage.getItem('token')
  // console.log('token ID:', token);
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [arrivalMessage, setArrivalMessage] = useState(null)
  // const [socket, setSocket] = useState(null)
  const scrollDown = useRef()
  const socket = useRef()
  const [otherUser, setOtherUser] = useState({})

  useEffect(() => {
    // setSocket(io('ws://localhost:6001'))
    socket.current = io('ws://localhost:6001')
    socket.current.on('getMessage', data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    })
  }, [])

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    socket.current.emit('addUser', user._id)
    socket.current.on('getUsers', users => {
      console.log(users);
    })
  }, [user])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4005/users/${userId}`)
        const data = response.data.data
        setUser(data);
        // console.log(data);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    }
    fetchUser();
  }, [userId])

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(`http://localhost:4005/conversation/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // console.log(response);
        // const data = response.data.data

        setConversation(response.data)
        // console.log(response.data);
      } catch (error) {
        console.error('error fetching conversation', error.message)
      }
    }
    getConversation()
  }, [userId, token])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get('http://localhost:4005/messages/' + currentChat?._id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // setMessages(res.data.data)
        setMessages(res.data)
        // console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
    getMessages()
  }, [currentChat])
  // console.log(messages);

  // console.log(currentChat);
  const handlSubmit = async (e) => {
    if (!newMessage.trim()) {
      return
    }
    e.preventDefault()
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id
    }

    const receiverId = currentChat.members.find(member => member !== user._id)

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage,
    })

    try {
      const res = await axios.post('http://localhost:4005/messages', message, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMessages((prevMessages) => [...prevMessages, res.data.data])
      // setMessages((prevMessages) =>[...messages, res.data])
      // setMessages([]); 
      setNewMessage('')
    } catch (err) {
      console.log(err);
    }
  }



  useEffect(() => {
    scrollDown.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])


  useEffect(() => {
    const fetchOtherUser = async () => {
      if (currentChat && currentChat.members) {
        const otherUserId = currentChat.members.find(member => member !== user._id)
        if (otherUserId) {
          try {
            const res = await axios.get(`http://localhost:4005/users/${otherUserId}`);
            setOtherUser(res.data.data)
          } catch (err) {
            console.error(err.message);
          }
        }
      }
    }
    fetchOtherUser()
  }, [currentChat, user])

  return (
    <div className='bodyOfMessages'>

      <Row className='row'>
        <Col sm={12} md={2}>
          <Navbar
            style={{ position: 'sticky' }}
          />
        </Col>

        <Col
          className="center"
          style={{
            backgroundColor: "rgb(0, 0, 0)",
            border: "#c71818",
            position: "relative",
            minHeight: '98.7vh', 
            // display: 'flex', 
            // flexDirection: 'column',          
            paddingLeft: '30px',
            paddingTop: '10px'
          }}
        >
          <h3 style={{ color: 'white' }}>Messages</h3>
          <input
          type='text'
          className='messagesSearch bg-black'
          placeholder='search...'
          
          />

          <br />

          <div>
            {conversation.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>

            ))}
          </div>
        </Col>

        <Col>

          <div className='messages-chat'>

            {
              currentChat ?
                <>
                  <div className='messages-user-info'>

                    <div >
                      <img
                        className='messagesUserPic'
                        // src={user?.profilePicture}
                        // src={currentChat.members.find(member => member !== user._id)?.profilePicture}
                        // src={currentChat.members.find(member => member !== user._id)?.profilePicture }
                        src={otherUser.profilePicture}

                      />
                    </div>

                    {/* <p style={{ color: 'white' }}>{user?.name}</p> */}
                    {/* <p style={{ color: 'white' }}>{currentChat.members.find(member => member !== user._id)?.name}</p> */}
                    <p className='otheruserName' style={{ color: 'white' }}>{otherUser.name}</p>
                  </div>
                  <hr style={{ color: "white" }} />
                  <div className='messagesScroller'>
                    {messages.map((m) => (
                      <div key={m._id} ref={scrollDown}>
                        <WholeMessages message={m} own={m.sender === user._id} />
                      </div>
                    ))
                    }
                  </div>
                  <div className='typeMessage'>
                    <textarea
                      className='typingMessage'
                      placeholder='right a message'
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    />
                    <button
                      className='sendMessageButton btn btn-primary'
                      onClick={handlSubmit}
                    >
                      send</button>
                  </div>
                </> :
                <div className='noMessages'>
                  <h1>Select a message</h1>
                  <p>
                    Choose from your existing conversations, start a new one, or just keep swimming.
                  </p>
                </div>
            }

          </div>

        </Col>
      </Row>

    </div>
  )
}
Messages.propTypes = {
  conversation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};
export default Messages