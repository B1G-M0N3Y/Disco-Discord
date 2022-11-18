const GET_CHATS = "private_messages/GET_CHATS"
// const GET_CHANNELS = "channel_messages/GET_CHANNELS"
const ADD_MESSAGE = "private_messages/ADD_ONE";
// const DELETE = "channel_messages/DELETE";


const getChats = (chats) => {
  return {
    type: GET_CHATS,
    chats,
  };
};

// const getChannels = (channels) => {
//   return {
//     type: GET_CHANNELS,
//     channels,
//   };
// }

const addMessage = (message) => {
  return {
    type: ADD_MESSAGE,
    message,
  };
};

// const remove = (serverId) => {
//   return {
//     type: DELETE,
//     serverId,
//   };
// };

// get all servers
export const getPrivateChats = () => async (dispatch) => {
  const response = await fetch(`/api/chat/`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getChats(data));
  }
  return response;
};

// create new channel message
export const newPrivateMessage = (chatId, msg) => async (dispatch) => {
  const response = await fetch(`/api/chat/${chatId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(msg)
  });

  if (response.ok) {
    const data = await response.json()
    dispatch(addMessage(data))
    return data
  }
}
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

const initialState = { chats: {} };

const privateMessageReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_CHATS:
      return {chats :{ ...action.chats }}
    case ADD_MESSAGE:
      return{...state, [action.message.id]: action.comment}
    default:
      return state;
  }
};
export default privateMessageReducer;
