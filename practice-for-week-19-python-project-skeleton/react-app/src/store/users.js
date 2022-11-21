const GET_USERS = "users/GET_USERS";
const GET_MEMBERS = "users/GET_MEMBERS";
const ADD_MEMBER = "users/ADD_MEMBER";
const REMOVE_MEMBER = "users/REMOVE_MEMBER";
const SET_USERS = "users/SET_USERS";

const getUsers = (users) => ({
  type: GET_USERS,
  users,
});

export const getMembers = (members) => ({
  type: GET_MEMBERS,
  members,
});

const addMember = (user) => ({
  type: ADD_MEMBER,
  user,
});

const removeMember = (userId) => ({
  type: REMOVE_MEMBER,
  userId,
});

export const setServerUsers = (users) => ({
  type: SET_USERS,
  users,
});

export const getAllUsers = () => async (dispatch) => {
  const response = await fetch("/api/users/");

  if (response.ok) {
    const data = await response.json();
    dispatch(getUsers(data));
    return data;
  }
};

export const addServerMember = (serverId, userId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      server_id: serverId,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addMember(data));
    return data;
  }
};

export const removeServerMember = (serverId, memberId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/members/${memberId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(removeMember(data));
    return data;
  }
};

let initialState = { allUsers: {}, serverUsers: {} };

export default function userReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_USERS:
      return {
        allUsers: { ...action.users },
        serverUsers: { ...state.serverUsers },
      };
    case GET_MEMBERS:
      return {
        serverUsers: { ...action.users },
        allUsers: { ...state.allUsers },
      };
    case ADD_MEMBER:
      newState = { ...state };
      if (!state.serverUsers[action.user.id]) {
        newState.serverUsers[action.user.id] = action.user;
      }
      //   else {
      //     newState.serverUsers[action.user.id] = action.user;
      //     return newState;
      //   }
      return newState;
    case REMOVE_MEMBER:
      newState = { ...state };
      delete newState.serverUsers[action.memberId];
      return newState;
    case SET_USERS:
      return {
        allUsers: { ...state.allUsers },
        serverUsers: { ...action.users },
      };

    default:
      return state;
  }
}
