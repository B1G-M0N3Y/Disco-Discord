const GET_CHANNELS = "channels/GET_CHANNELS";

export const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
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
    default:
      return state;
  }
};
export default channelReducer;
