// 将sseChannel传递给chatCompletion接口，由uni-ai自动往客户端发送流式响应
'use strict';
exports.main = async (event, context) => {
    const llmManager = uniCloud.ai.getLLMManager({
        provider: 'azure'
    })
    const res = await llmManager.chatCompletion({
        messages: event.messages,
        tokensToGenerate: 400,
        stream: true, // 开启流式返回
        sseChannel: event.channel
    })
    return {
        errCode: 0,
        errMsg: ''
    }
};
