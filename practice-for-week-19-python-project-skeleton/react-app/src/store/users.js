const GET_USERS = 'users/GET_USERS'

const getUsers = (users) => ({
    type: GET_USERS,
    users
})

export const getAllUsers = () => async (dispatch) => {
    const response = await fetch('/api/users/');
    console.log('daresponse',response)

    if (response.ok) {
        const data = await response.json();
        dispatch(getUsers(data))
    }
}

export default function userReducer(state = {}, action){
    switch(action.type) {
        case GET_USERS:
            return {...action.users}
        default:
            return state
    }
}
