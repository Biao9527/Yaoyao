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
			break
		case 'statistics':
			if (event.date && event.type) {
				const currentDate = new Date(event.date) // Mon May 01 2023 02:00:51 GMT+0800 (中国标准时间)
				const year = currentDate.getFullYear() // 2023
				const month = currentDate.getMonth() // 4
				const firstDayOfMonth = new Date(year, month, 1) // Mon May 01 2023 00:00:00 GMT+0800 (中国标准时间)
				const lastDayOfMonth = new Date(year, month + 1, 0)
				const res = await account.where({
					mp_wx_openid: event.wx_openid,
					type: event.type,
					date: dbCmd.gte(firstDayOfMonth.getTime()).and(db.command.lte(lastDayOfMonth.getTime()))
				}).get()
				let sumMoney = 0
				let chartData = []
				let barChartList = []
				let charItem = {}
				let barCharItem = {}
				if (res.data && res.data.length > 0) {
					res.data.forEach(items => {
						sumMoney += Number(items.money)
						if (charItem[items.table._id]) {
							charItem[items.table._id].value += items.money
						} else {
							charItem[items.table._id] = {}
							charItem[items.table._id].name = items.table.name
							charItem[items.table._id].value = items.money
						}
						if (barCharItem[items.table._id]) {
							barCharItem[items.table._id].id = items._id
							barCharItem[items.table._id].money += items.money
						} else {
							barCharItem[items.table._id] = {}
							barCharItem[items.table._id].id = items._id
							barCharItem[items.table._id].table = items.table
							barCharItem[items.table._id].money = items.money
						}
					})
					for (let k in charItem) {
						chartData.push(charItem[k])
					}
					for (let b in barCharItem) {
						barChartList.push(barCharItem[b])
					}

					sumMoney = Number(sumMoney.toFixed(2))

					chartData.map(item => {
						const sliceName = item.name.length > 3 ? item.name.slice(0, 3) + '...' : item.name
						item.labelText = ` ${sliceName} :${(item.value / sumMoney * 100).toFixed(1)}% `
					})
					barChartList = barChartList.sort((a, b) => a.money < b.money ? 1 : -1)
					for (let i = 0; i < barChartList.length; i++) {
						barChartList[i].width = (barChartList[i].money / barChartList[0].money * 100).toFixed(2)
					}
				}
				result = {status: 200, data: {sumMoney, chartData, barChartList}}
			} else {
				result = {status: -1, msg: '获取失败'}
			}
			break
    }

	//返回数据给客户端
	return result
};
