const GET_CHAT_MESSAGES = "chat/GET_CHAT_MESSAGES";
const ADD_CHAT_MESSAGE = "chat_messages/ADD_ONE";
const ADD_CHAT = "chat/ADD_CHAT";
const DELETE_CHAT = "chat/DELETE";
const DELETE_CHAT_MESSAGE = "chat_message/DELETE";

const getChatMessages = (chats) => {
  return {
    type: GET_CHAT_MESSAGES,
    chats,
  };
};

export const addChat = (chat) => {
  return {
    type: ADD_CHAT,
    chat,
  };
};

export const addChatMessage = (chat_message) => {
  return {
    type: ADD_CHAT_MESSAGE,
    chat_message: { ...chat_message },
  };
};

const removeChat = (chatId) => {
  return {
    type: DELETE_CHAT,
    chatId,
  };
};

const removeChatMessage = (chatMessageId, chatId) => {
  return {
    type: DELETE_CHAT_MESSAGE,
    chatMessageId,
    chatId,
  };
};

// get all chats
export const getChat = (chats) => async (dispatch) => {
  const response = await fetch(`/api/chat/`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getChatMessages(data));
  }

  return response;
};

// create new chat message
export const newChatMessage = (message) => async (dispatch) => {
  const response = await fetch(`/api/chat/${message.chat_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addChatMessage(data));
    return data;
  } else {
    alert("Error Occurred during Send Message");
  }
};

export const newChat = (chat) => async (dispatch) => {
  const response = await fetch(`/api/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chat),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addChat(data));
    return data;
  } else {
    alert("Error Occurred during Create Chat");
  }
};
export const deleteChat = (chatId) => async (dispatch) => {
  const response = await fetch(`/api/chat/${chatId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeChat(chatId));
  } else {
    alert("Error Occurred during Delete Chat");
  }
};

export const deleteChatMessage =
  (chatMessageId, chatId) => async (dispatch) => {
    const response = await fetch(`/api/chat/message/${chatMessageId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeChatMessage(chatMessageId, chatId));
    } else {
      alert("Error Occurred during Delete Chat");
    }
  };

const initialState = { chats: {} };

const chatReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_CHAT_MESSAGES:
      newState = {};
      const arr = [...action.chats];
      for (let i = 0; i < arr.length; i++) {
        newState[arr[i]["id"]] = arr[i];
      }
      return newState;
    case ADD_CHAT_MESSAGE:
      newState = { ...state };
      newState[action.chat_message.chat_id]["chat_messages"].push(
        action.chat_message
      );
      return newState;
    case ADD_CHAT:
      newState = { ...state };
      newState[action.chat.id] = action.chat;
      return newState;
    case DELETE_CHAT:
      newState = { ...state };
      delete newState[action.chatId];
      return newState;
    case DELETE_CHAT_MESSAGE:
      console.log("DELETE_CHAT_MESSAGE");
      newState = { ...state };
      console.log(newState[action.chatId], "actionCHATID");
      const chatMessageArr = newState[action.chatId]["chat_messages"];
      const chatIdx = chatMessageArr.findIndex(
        (message) => message.id === action.chatMessageId
      );
      console.log(chatMessageArr, chatIdx, "DELETECHATMESSAGE**");
      chatMessageArr.splice(chatIdx, 1);
      newState[action.chatId]["chat_messages"] = chatMessageArr;
      console.log(chatMessageArr, "after Delete");
      return newState;
    default:
      return state;
  }
};
export default chatReducer;
