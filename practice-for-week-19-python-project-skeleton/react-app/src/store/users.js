const GET_USERS = 'users/GET_USERS'
const REMOVE_MEMBER = 'users/REMOVE_MEMBER'
const SET_USERS = 'users/SET_USERS'

const getUsers = (users) => ({
    type: GET_USERS,
    users
})

const removeMember = (memberId) => ({
    type: REMOVE_MEMBER,
    memberId
})

export const setServerUsers = (users) => ({
    type: SET_USERS,
    users
})

export const getAllUsers = () => async (dispatch) => {
    const response = await fetch('/api/users/');

    if (response.ok) {
        const data = await response.json();
        dispatch(getUsers(data))
    }
}

export const removeServerMember = (serverId, userId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/members/${userId}`,{
        method:"DELETE"
        });

    if (response.ok) {
      const data = await response.json();
      removeMember(userId)
      console.log(data)
    }
}

let initialState = { allUsers: {}, serverUsers: {} }

export default function userReducer(state = initialState, action){
    switch(action.type) {
        case GET_USERS:
            return {allUsers:{...action.users}, serverUsers:{...state.serverUsers}}
        case REMOVE_MEMBER:
            let newState = {...state}
            delete state.serverUsers[action.memberId]
            return newState
        case SET_USERS:
            return {allUsers:{...state.allUsers}, serverUsers:{...action.users}}
        default:
            return state
    }
}
