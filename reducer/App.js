import React, { Component } from 'react'
import Fetch from './utils/Fetch.js'
import I from 'immutable'
import NavBar from './components/NavBar'
import { Flex, Toast } from 'antd-mobile'
import { connect } from 'react-redux'
import { SET_USERINFO, SET_LOTTERYTYPE } from './redux/actions'
import { MENU } from './layout'
import BuyBar from './components/BuyBar'
import Closed from './components/Closed'
import ToolBar from './components/ToolBar'
import Lottery from './components/Lottery'
import Msg from './components/Msg'
import Rem from './utils/Px_Rem'
import cookie from 'react-cookies'

class App extends Component {

    constructor(props) {
        super(props)
        const id = props.match.params.lotteryId > 0 && props.match.params.lotteryId < 15 ? props.match.params.lotteryId : 1
        this.state = {
            id: id,
            api: MENU[id].api,
            list: MENU[id].list,
            selected: MENU[id].list[0],
            data: MENU[id].initData, //初始内容布局
            // now: {
            //     // seasonno: '2017078',
            //     // closetime: '15',
            //     // endtime: '20',
            //     // preseasonno: '2017076',
            //     // lotterytype: '12',
            //     // servertime: '2017-12-04 11:36:17'
            // },
            msg: {},
            oddsVersion: 0,
            Closed: true //modal默认为true打开，只有赔率数据正确才为false
        }

        this.dataFormat = this.dataFormat.bind(this)
        this.navChange = this.navChange.bind(this)
        this.getOdds = this.getOdds.bind(this)
        this.getUserInfo = this.getUserInfo.bind(this)
        this.checkOdds = this.checkOdds.bind(this)
    }

    componentWillMount() {
        const id = this.state.id;
        this.props.SET_LOTTERYTYPE(id);
        this.getUserInfo(id)  //用户信息
        this.getOdds(id)      //赔率
    }

    componentWillUnmount() {
        clearTimeout(this.timer_countDown)
    }

    componentWillReceiveProps(nextProps) {
        const id = nextProps.match.params.lotteryId;
        if (id != this.state.id) {
            window.location.assign(id)
        }
    }

    checkOdds() {
        const ft = this.state.id;
        const v = this.state.oddsVersion;
        Fetch('get', { ft, v }, 'd/iodds?type=1')
            .then((res) => {
                // console.log('res', res)
                if (Object.keys(res).length > 0) {
                    const len = Object.keys(res.odds).length;
                    len > 0 && this.setState({ oddsVersion: res.v }, () => {
                        Toast.info('赔率有更新', 1.4, null, false);
                        this.dataFormat(res)
                    })
                }
            })
    }

    getUserInfo(lt) {
        // alert(cookie.load('zz'))
        Fetch('get', { lt }, 'd/userInfo')
            .then((res) => {
                this.props.SET_USERINFO(res)
                /*if (res.balance == 0) {
                    this.getBalance = setInterval(() => {
                        Fetch('get', { lt }, 'd/userInfo')
                            .then((res) => {
                                this.props.SET_USERINFO(res)
                            })
                    }, 1000)
                } else {
                    clearInterval(this.getBalance)
                }
                res.balance == 0 ? this.getBalance = setInterval(() => { this.props.userInfo }, 1000) : clearInterval(this.getBalance)*/
            })
    }

    getOdds(lt) {
        Fetch('get', { lt }, 'd/fodds')
            .then((res) => {
                const data = res[this.state.api]
                const len = Object.keys(data.odds).length
                len > 0 && this.setState({ oddsVersion: data.v }, () => {
                    this.dataFormat(data)
                })
                this.timer_odds = setInterval(() => {
                    this.checkOdds()
                }, 5000)
            })
    }

    dataFormat(data) { //赔率接口返回数据格式化
        const layTmp = I.fromJS(this.state.data).toJS()
        let err = false
        Object.keys(layTmp).forEach((value, index) => {
            const odds = data.odds[value]
            if (odds || odds === 0) {
                layTmp[value].odds = String(odds)
            }
        })

        this.setState({
            Closed: false,
            data: layTmp
        })
    }

    navChange(selected) { //导航器切换
        // console.log(selected);
        this.setState({
            selected
        })
    }

    render() {
        // console.log('data', this.props);
        const id = this.state.id;
        return (
            <div style={styles}>
                <NavBar
                    id={id}
                    menu={this.state.list}
                    selected={this.state.selected}
                    callback={this.navChange}
                />
                <BuyBar lotteryType={id} />
                <ToolBar id={id} />
                <Lottery data={this.state.data} renderComponent={this.state.selected} />
                <Msg /> {/*中奖提示*/}
            </div>
        )
    }
}

const styles = {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
}

const mapStateToProps = (state) => {
    const { userInfo } = state;
    return {
        userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        SET_USERINFO: (params) => {
            dispatch(SET_USERINFO(params))
        },
        SET_LOTTERYTYPE: (params) => {
            dispatch(SET_LOTTERYTYPE(params))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
