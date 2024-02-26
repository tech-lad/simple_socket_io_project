import { useState } from 'react'
import './App.css';
import io from 'socket.io-client';
import Chat from './components/Chat'

const socket = io.connect("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("")
  const [roomId, setRoomId] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (username !== "" && roomId !== "") {
      socket.emit("join_room", roomId);
      setShowChat(!showChat);
    }
  }

  return (
    <>
      <div className="App">
        {!showChat ?
          (<div className='joinChatContainer'>
            <h3>Join Chat</h3>
            <input
              type="text"
              placeholder="Raju..."
              onChange={(event) => {
                setUsername(event.target.value);
              }} />

            <input
              type="text"
              placeholder="Room Id..."
              onChange={(event) => {
                setRoomId(event.target.value);
              }} />

            <button onClick={joinRoom}>Join Room</button>
          </div>)
          : (
            <Chat socket={socket} username={username} roomId={roomId} />
          )
        }
      </div>
    </>
  );
}

export default App;
