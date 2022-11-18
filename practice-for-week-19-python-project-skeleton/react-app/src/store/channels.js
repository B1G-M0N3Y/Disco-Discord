const GET_CHANNELS = "channels/GET_CHANNELS";
const ADD_CHANNEL = "channels/ADD_CHANNEL"

export const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
};

const addChannel = (channel) => {
  return {
    type: ADD_CHANNEL,
    channel
  }
}

export const createChannel = (payload, serverId) => async (dispatch) => {
  console.log(payload)
  const response = await fetch(`/api/servers/${serverId}/channels`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(addChannel(data))
    return response;
  }
}

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
    default:
      return state;
  }
};
export default channelReducer;
