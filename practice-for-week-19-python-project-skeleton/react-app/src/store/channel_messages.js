const GET_MESSAGES = "channel_messages/GET_MESSAGES";
// const GET_CHANNELS = "channel_messages/GET_CHANNELS"
const ADD_MESSAGE = "channel_messages/ADD_ONE";
const DELETE = "channel_messages/DELETE";

const getMessages = (messages) => {
  return {
    type: GET_MESSAGES,
    messages,
  };
};

// const getChannels = (channels) => {
//   return {
//     type: GET_CHANNELS,
//     channels,
//   };
// }

export const addMessage = (message) => {
  return {
    type: ADD_MESSAGE,
    message,
  };
};

const remove = (messageId) => {
  return {
    type: DELETE,
    messageId,
  };
};

// get all servers
export const getChannelMessages = (channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}/messages`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getMessages(data));
  }
  return response;
};

// create new channel message
export const newChannelMessage = (channelId, msg) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msg),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addMessage(data));
    return data;
  }
};

// delete server
export const deleteChannelMessage = (messageId) => async (dispatch) => {
  const response = await fetch(`/api/channels/messages/${messageId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(messageId));
  }
};
// // get all server members by server id
// export const getServerMembers = (serverId) => async (dispatch) => {
//   const response = await fetch(`/api/servers/${serverId}/members`);
//   if (response.ok) {
//     const data = await response.json();
//     dispatch(getMembers(data));
//   }
//   return response;
// };

// // get all server channels by server id
// export const getServerChannels = (serverId) => async (dispatch) => {
//   const response = await fetch(`/api/servers/${serverId}/channels`);
//   if (response.ok) {
//     const data = await response.json();
//     dispatch(getChannels(data));
//   }
//   return response;
// };

const initialState = { messages: {} };

const channelMessageReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_MESSAGES:
      return { messages: { ...action.messages } };
    case ADD_MESSAGE:
      return { ...state, [action.message.id]: action.message };
    case DELETE:
      newState = { ...state };
      delete newState.messages[action.messageId];
      return newState;
    default:
      return state;
  }
};
export default channelMessageReducer;
