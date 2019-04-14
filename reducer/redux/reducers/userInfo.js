// import I from 'immutable'
const userInfo = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USERINFO':
            return action.userInfo
        default:
            return state
    }
}

export default userInfo