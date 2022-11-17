const GET = "servers/GET";
const ALL = "servers/ALL";
const GET_ONE = "servers/GET_ONE"
const GET_MEMBERS = "servers/GET_MEMBERS";
const ADD_ONE = "servers/ADD_ONE";
const DELETE = "servers/DELETE";

const get = (servers) => {
  return {
    type: GET,
    servers,
  };
};

const all = (servers) => {
  return {
    type: ALL,
    servers,
  };
};

const getOne = (server) => {
  return {
    type: GET_ONE,
    server
  }
}

const getMembers = (members) => {
  return {
    type: GET_MEMBERS,
    members,
  };
};

const addOne = (server) => {
  return {
    type: ADD_ONE,
    server,
  };
};

// const remove = (serverId) => {
//   return {
//     type: DELETE,
//     serverId,
//   };
// };

// get user servers
export const getServers = () => async (dispatch) => {
  const response = await fetch("/api/servers");
  if (response.ok) {
    const data = await response.json();
    dispatch(get(data));
  }
  return response;
};

// get all servers
export const getAllServers = () => async (dispatch) => {
  const response = await fetch("/api/servers/all");
  if (response.ok) {
    const data = await response.json();
    dispatch(all(data));
  }
  return response;
};

// get one server
export const getOneServer = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getOne(data));
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

// post/create server
export const addServer = (server) => async (dispatch) => {
  const response = await fetch('/api/servers', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(server)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addOne(data.id))

    return data
  };
};

const initialState = {
  servers: {},
  allServers: {},
  currentServer: {},
  // members: {}
};

const serverReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET:
      newState = { ...state };
      newState.servers = {};
      action.servers.forEach((server) => {
        newState.servers[server.id] = server;
      });
      return newState;
    case ALL:
      newState = { ...state };
      action.allServers.forEach((server) => {
        newState.allServers[server.id] = server;
      });
      return newState;
    case ADD_ONE:
      return {
        ...state,
        currentServer: { ...action.server },
      };
    // case GET_MEMBERS:
    //   newState = { ...state };
    //   newState.members = {};
    //   action.members.forEach((member) => {
    //     newState.members[member.id] = member;
    //   });
    //   return newState;
    default:
      return state;
  };
};

export default serverReducer;
