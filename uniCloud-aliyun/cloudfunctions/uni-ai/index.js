'use strict';
exports.main = async (event, context) => {
    // 云函数的代码运行在uniCloud服务器上
    const {messages} = event
    // 校验客户端提交的参数
    try {
        if (messages === undefined) {
            throw "messages为必传参数"
        } else if (!Array.isArray(messages)) {
            throw "参数messages的值类型必须是[object,object...]"
        } else {
            messages.forEach(item => {
                if (typeof item != 'object') {
                    throw "参数messages的值类型必须是[object,object...]"
                }
                let itemRoleArr = ["assistant", "user", "system"]
                if (!itemRoleArr.includes(item.role)) {
                    throw "参数messages[{role}]的值只能是：" + itemRoleArr.join('或')
                }
                if (typeof item.content != 'string') {
                    throw "参数messages[{content}]的值类型必须是字符串"
                }
            })
        }
    } catch (errMsg) {
        return {
            errSubject: 'ai-demo',
            errCode: 'param-error',
            errMsg
        }
    }
    const LLMManager = uniCloud.ai.getLLMManager({
		  // provider: 'openai',
		  // apiKey: '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',
		  // proxy: 'https://api.next.bspapp.com'
	})

	return await LLMManager.chatCompletion({
		messages,
        tokensToGenerate: 3000
    })
};
