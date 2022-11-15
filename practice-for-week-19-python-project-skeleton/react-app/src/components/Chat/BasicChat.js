import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

let socket;

const BasicChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const user = useSelector(state => state.session.user)


  useEffect(()=>{

    socket = io();

    socket.on("chat", (chat)=>{
      setAllMessages(messages => [...messages, chat])
    })

    return(() => {
      socket.disconnect()
    })
  },[])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!newMessage) {
      return;
    }
    const payload = {user:user.username, body:newMessage}
    socket.emit("chat", payload);
    setNewMessage("");
  };

  // useEffect(() => {
  //   if(socket){
  //     socket?.on("data", (data) => {
  //       setAllMessages([...allMessages, data.data]);
  //     });
  //   }
  // },[socket, allMessages]);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   const customScript = document.createElement('script')

  //   script.type = "text/javascript"
  //   script.src = "//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js"
  //   script.async = true;

  //   customScript.src = "{{ url_for('/scripts/)}}"

  //   document.body.appendChild(script);

  //   return()=>{
  //     document.body.removeChild(script);
  //   }
  // },[url]);

  return (
    <>
      <div className="message-section">
        {allMessages.map((message) => (
          <div className="message">
            {/* TODO: ADD USER IMAGE */}
            {/* TODO: ADD DELETE BUTTON IF OWNER */}
            {/* TODO: ADD DYNAMIC USERNAME */}
            <p className="username-message">{message.user}</p>
            <p className="message-body">{message.body}</p>
          </div>
        ))}
      </div>
      <form className="message-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type here..."
          autoComplete="off"
        />
        <button type="submit" className="button" onClick={handleSubmit}>
          SEND
        </button>
      </form>
    </>
  );
};

export default BasicChat;