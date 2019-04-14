import { combineReducers } from 'redux'
import orderList from './orderList'
import userInfo from './userInfo'
import lotteryType from './lotteryType'


const rootReducer = combineReducers({
    orderList,
    userInfo,
    lotteryType
})

export default rootReducer
