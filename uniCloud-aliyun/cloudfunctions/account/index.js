'use strict';
exports.main = async (event, context) => {

	const db = uniCloud.database();
	const dbCmd = db.command
	const account = db.collection('account');

	let result = {};
	switch (event.action) {
		case 'get':
			if (event.getSize && event.getPage) {
				let filterObj = {
					mp_wx_openid: event.wx_openid
				}
				if (event.type) {
					filterObj.type = event.type
				}
				if (event.tables && event.tables.length > 0) {
					filterObj = {
						...filterObj,
						'table._id': dbCmd.in(event.tables),
					}
				}
				if (event.dateList && event.dateList.length === 2) {
					filterObj.date = dbCmd.gte(event.dateList[0]).and(dbCmd.lte(event.dateList[1]))
				}
				const sortKey = event.sortKey ? event.sortKey : 'date'
				const sortValue = event.sortValue ? event.sortValue : 'desc'
				const res_val = await account.where({
					...filterObj
				}).orderBy(sortKey, sortValue)
					.skip((event.getPage - 1) * event.getSize)
					.limit(event.getSize).get()
				result = {status: 200, dataList: res_val.data}
			} else {
				result = {status: -1, msg: '获取列表失败'}
			}
			break
		case 'getItem':
			if (event.accountId) {
				const res = await account.where({
					mp_wx_openid: event.wx_openid,
					_id: event.accountId
				}).get()
				if (res.data && res.data.length > 0) {
					result = {status: 200, account: res.data[0]}
				} else {
					result = {status: -1, msg: '查询失败'}
				}
			} else {
				result = {status: -1, msg: '查询失败'}
			}
			break
		case 'create':
			if (event.accountInfo && event.wx_openid) {
				const res_reg = await account.add({
					...event.accountInfo,
					mp_wx_openid: event.wx_openid
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
			if (event.accountId && event.accountInfo) {
				const res_update = await account.doc(event.accountId).update({
					...event.accountInfo,
					mp_wx_openid: event.wx_openid,
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
		case 'tableUpdate':
			if (event.tableId && event.tableInfo) {
				const res_update = await account.where({
					mp_wx_openid: event.wx_openid,
					'table._id': event.tableId
				}).update({
					table: {
						name: event.tableInfo.name,
						icon: event.tableInfo.icon
					}
				})
				if (res_update.updated >= 1) {
					result = {status: 200, msg: '修改成功'}
				} else {
					result = {status: -1, msg: '修改失败'}
				}
			} else {
				result = {status: -1, msg: '修改失败'}
			}
			break
		case 'delete':
			if (event.accountId) {
				const res = await account.doc(event.accountId).remove()
				if (res.deleted === 1) {
					result = {status: 200, msg: '删除成功'}
				} else {
					result = {status: -1, msg: '删除失败'}
				}
			} else {
				result = {status: -1, msg: '删除失败'}
			}
			break
		case 'tableDelete':
			if (event.tableId) {
				const res = await account.where({
					mp_wx_openid: event.wx_openid,
					'table._id': event.tableId
				}).remove()
				if (res.deleted >= 1) {
					result = {status: 200, msg: '删除成功'}
				} else {
					result = {status: -1, msg: '删除失败'}
				}
			} else {
				result = {status: -1, msg: '删除失败'}
			}
			break
        case 'tableFilter':
            if (event.tables) {
                const res = await account.where({
                    mp_wx_openid: event.wx_openid,
                    'table._id': dbCmd.in(event.tables)
                }).get()
                result = {status: 200, tableAccount: res.data}
            } else {
                result = {status: -1, msg: '查询失败'}
            }
    }

	//返回数据给客户端
	return result
};
