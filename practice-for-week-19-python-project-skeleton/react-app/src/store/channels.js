const GET_CHANNELS = "channels/GET_CHANNELS";
const DELETE = "channels/DELETE";
const ADD_CHANNEL = "channels/ADD_CHANNEL";

export const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
};

const remove = (channelId) => {
  return {
    type: DELETE,
    channelId,
  };
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

// delete channel
export const deleteChannel = (channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(channelId));
  }
};

const addChannel = (channel) => {
  return {
    type: ADD_CHANNEL,
    channel,
  };
};

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
    case DELETE:
      newState = { ...state };
      delete newState.channels[action.channelId];
      return newState;
    default:
      return state;
  }
};
export default channelReducer;
