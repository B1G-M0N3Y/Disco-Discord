const GET_CURRENT = "servers/GET_CURRENT";
const ALL = "servers/ALL";
const ADD_UPDATE = "servers/ADD_UPDATE";
const GET_ONE = "servers/GET_ONE";
const DELETE = "servers/DELETE";

const get = (servers) => {
  return {
    type: GET_CURRENT,
    servers,
  };
};

const all = (servers) => {
  return {
    type: ALL,
    servers,
  };
};

const addOrUpdate = (server) => {
  return {
    type: ADD_UPDATE,
    server,
  };
};

const getOne = (server) => {
  return {
    type: GET_ONE,
    server,
  };
};

const remove = (serverId) => {
  return {
    type: DELETE,
    serverId,
  };
};

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

// create a server
export const createServer = (payload) => async (dispatch) => {
  const response = await fetch(`/api/servers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addOrUpdate(data));
    return response;
  }
};

// update server
export const updateServer = (serverBody, serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serverBody),
  });
  console.log("SERVER BODY", serverBody, serverId);
  if (response.ok) {
    console.log("the response is ok");
    const data = await response.json();
    console.log(data, "dispatched DATA IN updateServer");
    dispatch(addOrUpdate(data));
    return response;
  }
};

// delete server
export const deleteServerThunk = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(serverId));
  }
};

const initialState = {
  servers: {},
  allServers: {},
  currentServer: {},
};

const serverReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_CURRENT:
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
    case ADD_UPDATE:
      if (!state.servers[action.server.id]) {
        console.log("IF***");
        newState = { ...state };
        console.log(newState, "New State in add/update");
        newState.servers[action.server.id] = action.server;
        console.log(newState, "New State after add/update");
        return newState;
      } else {
        console.log("ELSE****");
        newState = { ...state };

        console.log(action.server, "action");

        console.log(newState.currentServer, "before");
        newState.currentServer = action.server;
        console.log(newState.currentServer, "after");
        newState.servers[action.server.id] = action.server;
        return newState;
      }
    case GET_ONE:
      return {
        ...state,
        currentServer: { ...action.server },
      };

    case DELETE:
      newState = { ...state };
      delete newState.servers[action.serverId];
      delete newState.currentServer[0];

      return newState;
    default:
      return state;
  }
};
export default serverReducer;
