const GET = "servers/GET";
const GET_MEMBERS = "servers/GET_MEMBERS";
const GET_CHANNELS = "servers/GET_CHANNELS";
const ADD_ONE = "servers/ADD_ONE";
const DELETE = "servers/DELETE";

const get = (servers) => {
  return {
    type: GET,
    servers,
  };
};

const getMembers = (members) => {
  return {
    type: GET_MEMBERS,
    members,
  };
};

const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
};

const addOne = (server) => {
  return {
    type: ADD_ONE,
    server,
  };
};

const remove = (serverId) => {
  return {
    type: DELETE,
    serverId,
  };
};

// get all servers
export const getServers = () => async (dispatch) => {
  const response = await fetch("/api/servers");
  if (response.ok) {
    const data = await response.json();
    dispatch(get(data));
  }
  return response;
};

// get one server
export const getOneServer = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(addOne(data));
  }
  return response;
};

// get all server members by server id
export const getServerMembers = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/members`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getMembers(data));
  }
  return response;
};

// get all server channels by server id
export const getServerChannels = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/channels`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getChannels(data));
  }
  return response;
};

const initialState = {
  servers: {},
  members: {},
  channels: {},
  currentServer: {},
};

const serverReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET:
      newState = { ...state };
      action.servers.forEach((server) => {
        newState.servers[server.id] = server;
      });
      return newState;
    case ADD_ONE:
      newState = { ...state };
      return {
        ...state,
        currentServer: { ...action.server },
      };
    case GET_MEMBERS:
      newState = { ...state };
      newState.members = {};
      action.members.forEach((member) => {
        newState.members[member.id] = member;
      });
      return newState;
    case GET_CHANNELS:
      newState = { ...state };
      newState.channels = {};
      action.channels.forEach((channel) => {
        newState.channels[channel.id] = channel;
      });
      return newState;
    default:
      return state;
  }
};
export default serverReducer;
