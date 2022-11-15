const GET_MESSAGES = "servers/GET_MESSAGES"
// const GET_CHANNELS = "servers/GET_CHANNELS"
// const ADD_ONE = "servers/ADD_ONE";
// const DELETE = "servers/DELETE";


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
  console.log("dispatching")
  const response = await fetch(`/api/channels/${channelId}/messages`);
  console.log(response)
  if (response.ok) {
    const data = await response.json();
    console.log("da data", data)
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

const channelMessageReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_MESSAGES:
      console.log("action jackson",action.messages)
      return {messages :{ ...action.messages }}
    default:
      return state;
  }
};
export default channelMessageReducer;
