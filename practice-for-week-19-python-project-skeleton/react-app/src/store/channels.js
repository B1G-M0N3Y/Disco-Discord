const GET_CHANNELS = "channels/GET_CHANNELS";
const DELETE = "channels/DELETE";
const ADD_UPDATE = "channels/ADD_UPDATE";

export const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
};

const addOrUpdate = (channel) => {
  return {
    type: ADD_UPDATE,
    channel,
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

export const createChannel = (payload, serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addOrUpdate(data));
    return data;
  }
};

// update channel
export const updateChannel = (channelBody, channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(channelBody),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addOrUpdate(data));
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
    case ADD_UPDATE:
      if (!state.channels[action.channel.id]) {
        newState = { ...state };
        newState.channels[action.channel.id] = action.channel;
        return newState;
      } else {
        newState = { ...state };

        newState.channels[action.channel.id] = action.channel;
        return newState;
      }
    case DELETE:
      newState = { ...state };
      delete newState.channels[action.channelId];
      return newState;
    default:
      return state;
  }
};
export default channelReducer;
