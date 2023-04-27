'use strict';
exports.main = async (event, context) => {
		// 云函数的代码运行在uniCloud服务器上
		console.log('event',event) // event为客户端上传的参数
		const {messages} = event
		// 校验客户端提交的参数
		try{
			if(messages === undefined){
				throw "messages为必传参数"
			}else if(!Array.isArray(messages)){
				throw "参数messages的值类型必须是[object,object...]"
			}else{
				messages.forEach(item=>{
					if(typeof item != 'object'){
						throw "参数messages的值类型必须是[object,object...]"
					}
					let itemRoleArr = ["assistant","user","system"]
					if(!itemRoleArr.includes(item.role)){
						throw "参数messages[{role}]的值只能是："+itemRoleArr.join('或')
					}
					if(typeof item.content != 'string'){
						throw "参数messages[{content}]的值类型必须是字符串"
					}
				})
			}
		}catch(errMsg){
			return {
				errSubject: 'ai-demo',
				errCode: 'param-error',
				errMsg
			}
		}
	
		const LLMManager = uniCloud.ai.getLLMManager() //创建llm对象
		return await LLMManager.chatCompletion({
			messages // 初次调试时，可注掉本行代码，不从客户端获取数据，直接使用下面写死在云函数里的数据
			// messages: [{
			// 	role: 'user',
			// 	content: 'uni-app是什么，20个字以内进行说明'
			// }]
		})

};
