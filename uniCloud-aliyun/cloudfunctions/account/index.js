'use strict';
exports.main = async (event, context) => {

	const db = uniCloud.database();
	const account = db.collection('account');

	let result = {};
	switch (event.action) {
		case 'get':
			if (event.getSize && event.getPage) {
				const res_val = await account.where({
					mp_wx_openid: event.wx_openid
				}).orderBy('date', 'desc')
					.skip((event.getPage - 1) * event.getSize)
					.limit(event.getSize).get()
				result = {status: 200, dataList: res_val.data}
			} else {
				result = {status: -1, msg: '获取列表失败'}
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
			break
		case 'delete':
			break
	}

	//返回数据给客户端
	return result
};
