import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelectedChat } from "../../context/ChatContext";
import { newChat } from "../../store/chat";

const CreateChat = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [users, setUsers] = useState([]);
  const currentUser = useSelector((state) => state.session.user);
  const [chatUsers, setChatUsers] = useState([currentUser.id]);
  const [disabled, setDisabled] = useState(true);
  const history = useHistory();
  const { selectedChat, setSelectedChat } = useSelectedChat();

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      console.log(responseData, "responseDATA");
      const filteredUsers = responseData.users.filter(
        (user) => user.id !== currentUser.id
      );
      setUsers(filteredUsers);
    }
    fetchData();
  }, []);

  console.log(users, "users**");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(String(chatUsers));
    const chat = {
      name: "Chat",
      adminId: currentUser.id,
      chat_members_lst: String(chatUsers),
    };
    const response = await dispatch(newChat(chat));
    console.log(response, "new chat response");
    setShowAdd(false);
    setChatUsers([currentUser.id]);
    setSelectedChat(response.id);
    history.push(`/chats/${response.id}`);
  };

  const checkBox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      const userArr = chatUsers;
      userArr.push(value);
      setDisabled(false);
    } else {
      const userArr = chatUsers.filter((chatUser) => chatUser !== value);
      setChatUsers(userArr);
      if (userArr.length === 1) {
        setDisabled(true);
      }
    }
    return;
  };
  return (
    <>
      <div>
        <i
          className="fa-solid fa-plus"
          onClick={() => {
            setShowAdd(!showAdd);
          }}
        ></i>
        {showAdd && (
          <div>
            <form onSubmit={handleSubmit}>
              {users &&
                users.map((user, idx) => (
                  <div>
                    <label key={idx}>
                      {" "}
                      <input
                        type="checkbox"
                        onChange={checkBox}
                        value={user?.id}
                      />
                      {user?.username}
                    </label>
                  </div>
                ))}
              <input type="submit" disabled={disabled} />
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateChat;
