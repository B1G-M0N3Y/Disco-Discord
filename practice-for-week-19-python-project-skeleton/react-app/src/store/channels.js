// READ | GET
const GET_CHANNELS = "channels/GET_CHANNELS";
// const GET_ONE_CHANNEL = "channels/GET_ONE_CHANNEL"

// UPDATE | PUT
const UPDATE_CHANNEL = "chaneels/UPDATE_CHANNEL"

// DELETE
const DELETE = "channels/DELETE";

// ACTIONS | READ | GET
export const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
};

// const getOneChannelAction = payload => {
//   return {
//     type: GET_ONE_CHANNEL,
//     payload
//   }
// }

// ACTION | UPDATE | PUT
const updateChannelAction = payload => {
  return {
    type: UPDATE_CHANNEL,
    payload
  }
}

// ACTION | DELETE
const remove = (channelId) => {
  return {
    type: DELETE,
    channelId,
  };
};

// THUNKS | READ | GET
// get server's channels
export const getCurrentChannels = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/channels`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getChannels(data));
  }
  return response;
};

// // get one of server's channels
// export const getOneChannelThunk = (payload, serverId, channelId) => async (dispatch) => {
//   const response = await fetch(`/api/servers/${serverId}/channels/${channelId}`);

//   if (response.ok) {
//     const data = await response.json();
//     dispatch(getOneChannelAction(data));
//     return data;
//   }
// };

// THUNK | UPDATE | PUT
export const updateChannelThunk = (payload, channelId) => async (dispatch) => {
  const response = await fetch(`api/channels/${channelId}`, {
    method: "PUT",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateChannelAction(data));
    return data;
  };
};

// THUNK | DELETE
// delete channel
export const deleteChannel = (channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(channelId));
  }
};

const initialState = {
  channels: {},
};

const channelReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_CHANNELS:
      newState = { ...state };
      newState.channels = {};
      action.channels.forEach((channel) => {
        newState.channels[channel.id] = channel;
      });
      return newState;

    // case GET_ONE_CHANNEL:
    //   newState = { ...state };
    //   newState.channels = {};
    //   newState.channels[action.payload.id] = { ...newState[payload.id], ...action.payload };
    //   newState.channels[action.payload.id] = action.payload;
    //   return newState;

    case UPDATE_CHANNEL:
      newState = { ...state };
      newState.channels = {};
      newState.channels[action.payload.id] = { ...newState[action.payload.id], ...action.payload };
      return newState;

    case DELETE:
      newState = { ...state };
      delete newState.channels[action.channelId];
      return newState;
    default:
      return state;
  }
};
export default channelReducer;
