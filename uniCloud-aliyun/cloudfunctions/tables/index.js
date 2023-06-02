'use strict';
exports.main = async (event, context) => {

    const db = uniCloud.database();
    const tables = db.collection('user_tables');

    let result = {};
    switch (event.action) {
        case 'find':
            if (event.tableInfo) {
                const res = await tables.where({
                    mp_wx_openid: event.wx_openid,
                    name: event.tableInfo.name,
                    icon: event.tableInfo.icon
                }).get()
                result = {status: 200, findList: res.data}
            } else {
                result = {status: -1, msg: '查询失败'}
            }
            break
        case 'get':
            if (event.getSize && event.getPage) {
                const res_val = await tables.where({
                    mp_wx_openid: event.wx_openid
                }).orderBy('create_date', 'desc')
                    .skip((event.getPage - 1) * event.getSize)
                    .limit(event.getSize).get()
                result = {status: 200, dataList: res_val.data}
            } else {
                result = {status: -1, msg: '获取列表失败'}
            }
           break
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
            if (event.tablesId && event.tableInfo) {
                const res_update = await tables.doc(event.tablesId).update({
                    icon: event.tableInfo.icon,
                    name: event.tableInfo.name,
                    mp_wx_openid: event.wx_openid,
                    create_date: new Date().getTime()
                })
                if (res_update.updated === 1) {
                    result = {status: 200, msg: '修改成功'}
                } else {
                    result = {status: -1, msg: '修改失败'}
                }
            } else {
                result = {status: -1, msg: '修改失败'}
            }
            break
        case 'delete':
            if (event.tablesId) {
                const res = await tables.doc(event.tablesId).remove()
                if (res.deleted === 1) {
                    result = {status: 200, msg: '删除成功'}
                } else {
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
