// CREATE | POST
const ADD_CHANNEL = "channels/ADD_CHANNEL";

// READ | GET
const GET_CHANNELS = "channels/GET_CHANNELS";
// const GET_ONE_CHANNEL = "channels/GET_ONE_CHANNEL"

// UPDATE | PUT
const UPDATE_CHANNEL = "channels/UPDATE_CHANNEL"

// DELETE
const DELETE = "channels/DELETE";

// ACTIONS | CREATE | POST
const addChannel = (channel) => {
  return {
    type: ADD_CHANNEL,
    channel,
  };
};

// ACTIONS | READ | GET
export const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
};

// ACTION | UPDATE | PUT
const updateChannelAction = payload => {
  return {
    type: UPDATE_CHANNEL,
    payload
  }
}

// ACTION DELETE
const remove = (channelId) => {
  return {
    type: DELETE,
    channelId,
  };
};

// add channel to server
export const createChannel = (payload, serverId) => async (dispatch) => {
  console.log(payload);
  const response = await fetch(`/api/servers/${serverId}/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addChannel(data));
    return response;
  }
};

// get server's channels
export const getCurrentChannels = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/channels`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getChannels(data));
  }
  return response;
};

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
      if (action.channels) {
          action.channels.forEach((channel) => {
            newState.channels[channel.id] = channel;
        });
      }
      return newState;

    case UPDATE_CHANNEL:
      newState = { ...state };
      newState.channels = {};
      newState.channels[action.payload.id] = action.payload;
        return newState;

      default:
        return state;
  }
};
export default channelReducer;
