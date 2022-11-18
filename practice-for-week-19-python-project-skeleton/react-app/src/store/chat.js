const GET_CHAT_MESSAGES = "chat/GET_CHAT_MESSAGES";
// const GET_CHANNELS = "channel_messages/GET_CHANNELS"
const ADD_CHAT_MESSAGE = "chat_messages/ADD_ONE";
const ADD_CHAT = "chat/ADD_CHAT";
// const DELETE = "channel_messages/DELETE";

const getChatMessages = (chats) => {
  return {
    type: GET_CHAT_MESSAGES,
    chats,
  };
};

// const getChannels = (channels) => {
//   return {
//     type: GET_CHANNELS,
//     channels,
//   };
// }

export const addChat = (chat) => {
  return {
    type: ADD_CHAT,
    chat,
  };
};

export const addChatMessage = (chat_message) => {
  console.log(chat_message, typeof chat_message, "addCHATMESSAGE");
  return {
    type: ADD_CHAT_MESSAGE,
    chat_message: { ...chat_message },
  };
};

// const remove = (serverId) => {
//   return {
//     type: DELETE,
//     serverId,
//   };
// };

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
    console.log(data, "addCHAT DATA");
    return data;
  } else {
    alert("Error Occurred during Create Chat");
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
    default:
      return state;
  }
};
export default chatReducer;
