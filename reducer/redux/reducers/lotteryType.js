// import I from 'immutable'
const lotteryType = (state = 1, action) => {
    switch (action.type) {
        case 'SET_LOTTERYTYPE':
            return action.lt
        default:
            return state
    }
}

export default lotteryType