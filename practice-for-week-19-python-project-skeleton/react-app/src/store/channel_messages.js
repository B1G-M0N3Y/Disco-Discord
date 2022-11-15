const GET_MEMBERS = "servers/GET_MESSAGES"
const GET_CHANNELS = "servers/GET_CHANNELS"
const ADD_ONE = "servers/ADD_ONE";
const DELETE = "servers/DELETE";


const getMessages = (messages) => {
  return {
    type: GET_MEMBERS,
    members,
  };
};

// const getChannels = (channels) => {
//   return {
//     type: GET_CHANNELS,
//     channels,
//   };
// }

// const addOne = (server) => {
//   return {
//     type: ADD_ONE,
//     server,
//   };
// };

// const remove = (serverId) => {
//   return {
//     type: DELETE,
//     serverId,
//   };
// };

// get all servers
export const getChannelMessages = (channelId) => async (dispatch) => {
  const response = await fetch("/api/channels/messages");
  if (response.ok) {
    const data = await response.json();
    dispatch(getMessages(data));
  }
  return response;
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

const serverReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_MEMBERS:
      return {messages :{ ...action.messages.messages }}
    default:
      return state;
  }
};
export default serverReducer;
