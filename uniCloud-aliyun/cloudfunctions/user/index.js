'use strict';
const mp_wx_data = {AppID: 'wx596e86978a100d01', AppSecret: '928e9a26a979245f5ddd6c568e24aa5e'}
exports.main = async (event, context) => {    //event为客户端上传的参数

    const db = uniCloud.database();    // 获取 `user` 集合的引用
    const pro_user = db.collection('users');    // 循环判断客户端传递过来的 action
    // 通过 action 判断请求对象

    let result = {};
    switch (event.action) {        // 通过 code 获取用户 session
        case 'code2Session':
            const res_session = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
                    method: 'GET', data: {
                        appid: mp_wx_data.AppID,
                        secret: mp_wx_data.AppSecret,
                        js_code: event.js_code,
                        grant_type: 'authorization_code'
                    }, dataType: 'json'
                }
            )
            const success = res_session.status === 200 && res_session.data && res_session.data.openid
            if (!success) {
                return {
                    status: -2, msg: '从微信获取登录信息失败'
                }
            }
            const res_user = await pro_user.where({
                mp_wx_openid: res_session.data.openid
            }).get()
            // 没有用户信息，进入注册
            if (res_user.data && res_user.data.length === 0) {
                if (event.user_info) {
                    const register = await uniCloud.callFunction({
                        name: 'user',
                        data: {
                            action: 'register',
                            open_id: res_session.data.openid,
                            user_info: event.user_info
                        }
                    }).then(res => {
                        result = res
                    })
                } else {
                    result = {
                        result: {
                            result: {register: true}
                        }
                    }
                }
            } else {
                result = {
                    result: {
                        result:  res_user.data[0]
                    }
                }
            }
            break;
        case 'register':
            const res_reg = await pro_user.add({
                nickName: event.user_info.nickName,
                avatarUrl: event.user_info.avatarUrl,
                gender: event.user_info.gender,
                mp_wx_openid: event.open_id,
                register_date: new Date().getTime()
            })
            if (res_reg.id) {
                const res_reg_val = await uniCloud.callFunction({
                    name: 'user', data: {
                        action: 'getUser', open_id: event.open_id
                    }
                }).then(res => {
                    result = res
                })
            } else {
                result = {
                    status: -1, msg: '微信登录'
                }
            }
            break;
        case 'update':
            if (event._id && event.info) {
                const res_update = await pro_user.doc(event._id).update(event.info)
                if (res_update.updated === 1) {
                    result = {status: 200, msg: '修改成功'}
                } else {
                    result = {status: -1, msg: '修改失败'}
                }
            } else {
                result = {status: -1, msg: '修改失败'}
            }
            break;
        case 'getUser':
            const res_val = await pro_user.where({
                mp_wx_openid: event.open_id
            }).get()
            return res_val.data[0]
            break;
    }
    return result;
};