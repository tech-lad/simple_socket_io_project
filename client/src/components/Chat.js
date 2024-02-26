import React, { useState, useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

const Chat = ({ socket, username, roomId }) => {
    const [currentMsg, setCurrentMsg] = useState("")
    const [messageList, setMessageList] = useState([])

    const sendMsg = async () => {
        if (currentMsg !== "") {
            // here we send a message object
            const messageData = {
                room: roomId,
                author: username,
                message: currentMsg,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes()
            }
            // sending the message
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData])
            setCurrentMsg("")  // to clear the input after the msg is sent
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data])
        })
    }, [socket]);


    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className='message-container'>
                    {messageList.map((messageContent) => {
                        return (
                            <div className='message'
                                id={username === messageContent.author ? "other" : "you"}>
                                <div>
                                    <div className='message-content'>
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className='message-meta'>
                                        <p id='time'>{messageContent.time}</p>
                                        <p id='author'>{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMsg}
                    placeholder='Message...'
                    onChange={(event) => {
                        event.preventDefault();
                        setCurrentMsg(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        event.key === "Enter" && sendMsg()
                    }}
                />
                <button onClick={sendMsg}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat
