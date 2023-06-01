'use strict';
exports.main = async (event, context) => {

    const db = uniCloud.database();
    const tables = db.collection('user_tables');

    let result = {};
    switch (event.action) {
        case 'create':
            if (event.tableInfo && event.wx_openid) {
                const res_reg = await tables.add({
                    icon: event.tableInfo.icon,
                    name: event.tableInfo.name,
                    mp_wx_openid: event.wx_openid,
                    create_date: new Date().getTime()
                })
                if (res_reg.id) {
                    result = {status: 200, msg: '创建成功'}
                } else {
                    result = {status: -1, msg: '创建失败'}
                }
            } else {
                result = {status: -1, msg: '创建失败'}
            }
            break
        case 'update':
            break
        case 'delete':
            break
    }

    //返回数据给客户端
    return result
};
