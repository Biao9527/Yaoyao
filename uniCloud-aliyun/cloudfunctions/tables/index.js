'use strict';
exports.main = async (event, context) => {

    const db = uniCloud.database();
    const tables = db.collection('user_tables');

    let result = {};
    switch (event.action) {
        case 'get':
            const res_val = await tables.where({
                mp_wx_openid: event.wx_openid
            }).get()
            return res_val.data
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
            if (event.tablesId) {
                const res = await tables.doc(event.tablesId).remove()
                if(res.deleted === 1){
                    result = {status: 200, msg: '删除成功'}
                }else{
                    result = {status: -1, msg: '删除失败'}
                }
            } else {
                result = {status: -1, msg: '删除失败'}
            }
            break
    }

    //返回数据给客户端
    return result
};
