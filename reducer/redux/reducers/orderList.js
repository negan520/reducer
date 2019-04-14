// import I from 'immutable'
const orderList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ORDERLIST':
            // console.log('params', action.orderList)
            return action.orderList

        case 'RESET_ORDERLIST':
            return []
        default:
            return state
    }
}

export default orderList