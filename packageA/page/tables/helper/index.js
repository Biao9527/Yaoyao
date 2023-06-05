export const ICON_LIST = [
    'icon-Massage', 'icon-lanqiu', 'icon-pingpangqiu', 'icon-paiqiu', 'icon-zuqiu', 'icon-youyongquan', 'icon-yumaoqiu', 'icon-yaling',
    'icon-wangqiu', 'icon-zihangche', 'icon-xiaomotuo', 'icon-changpengche', 'icon-chuzuche', 'icon-gongjiaoche', 'icon-huoche', 'icon-feiji',
    'icon-huojian', 'icon-kafei', 'icon-pijiu', 'icon-malatang', 'icon-mianshi', 'icon-shuiguo', 'icon-waimai', 'icon-yinliao',
    'icon-zaocan', 'icon-zhushi', 'icon-huoguo', 'icon-dangao', 'icon-chuanchuan', 'icon-icon_clothes', 'icon-icon_food', 'icon-icon_fuel',
    'icon-icon_medicine', 'icon-icon_shopping', 'icon-icon_phone', 'icon-icon_tour', 'icon-icon_traffic'
]

export const recommend_tables = [
    {
        id: 0,
        title: '常用类型',
        tables: [
            {icon: 'icon-icon_clothes', text: '衣物'},
            {icon: 'icon-icon_food', text: '餐饮'},
            {icon: 'icon-icon_fuel', text: '加油'},
            {icon: 'icon-icon_medicine', text: '医院'},
            {icon: 'icon-icon_shopping', text: '购物'},
            {icon: 'icon-icon_phone', text: '话费'},
            {icon: 'icon-icon_tour', text: '旅游'},
            {icon: 'icon-icon_traffic', text: '地铁'},
        ]
    },
    {
        id: 1,
        title: '餐饮类型',
        tables: [
            {icon: 'icon-mianshi', text: '面条'},
            {icon: 'icon-shuiguo', text: '水果'},
            {icon: 'icon-waimai', text: '外卖'},
            {icon: 'icon-yinliao', text: '饮料'},
            {icon: 'icon-zaocan', text: '早餐'},
            {icon: 'icon-huoguo', text: '火锅'},
            {icon: 'icon-dangao', text: '蛋糕'},
            {icon: 'icon-chuanchuan', text: '烧烤'},
            {icon: 'icon-kafei', text: '咖啡'},
            {icon: 'icon-pijiu', text: '喝啤酒'},
            {icon: 'icon-zhushi', text: '中/晚餐'},
            {icon: 'icon-malatang', text: '麻辣烫'}
        ]
    },
    {
        id: 2,
        title: '交通工具',
        tables:
            [
                {icon: 'icon-changpengche', text: '汽车'},
                {icon: 'icon-huoche', text: '地铁'},
                {icon: 'icon-feiji', text: '飞机'},
                {icon: 'icon-huojian', text: '火箭'},
                {icon: 'icon-xiaomotuo', text: '小电驴'},
                {icon: 'icon-chuzuche', text: '出租车'},
                {icon: 'icon-gongjiaoche', text: '公交车'},
                {icon: 'icon-zihangche', text: '共享单车'},
            ]
    },
    {
        id: 3,
        title: "体育运动",
        tables: [
            {icon: 'icon-lanqiu', text: '篮球'},
            {icon: 'icon-paiqiu', text: '排球'},
            {icon: 'icon-zuqiu', text: '足球'},
            {icon: 'icon-youyongquan', text: '游泳'},
            {icon: 'icon-yaling', text: '健身'},
            {icon: 'icon-wangqiu', text: '网球'},
            {icon: 'icon-pingpangqiu', text: '乒乓球'},
            {icon: 'icon-yumaoqiu', text: '羽毛球'},
        ]
    },
    {
        id: 4,
        title: '不可言传',
        tables: [
            {icon: 'icon-Massage', text: '洗脚'},
            {icon: 'icon-Massage', text: '按摩'},
            {icon: 'icon-Massage', text: '推拿'},
            {icon: 'icon-Massage', text: '蹦迪'},
            {icon: 'icon-Massage', text: '加了个钟'},
            {icon: 'icon-Massage', text: '就充了亿点点钱而已'},
            {icon: 'icon-Massage', text: '加了亿点点钟'},
        ]
    }
]

/**
 * 判断标签是否绑定订单
 */
export async function isTablesAccounts(wx_openid, tableId) {
    return new Promise(resolve => {
        uniCloud.callFunction({
            name: 'account',
            data: {
                action: 'tableFilter',
                wx_openid: wx_openid,
                tables: [tableId]
            },
            success: (res) => {
                if (res.result.status === 200
                    && res.result
                    && res.result.tableAccount
                    && Array.isArray(res.result.tableAccount)
                    && res.result.tableAccount.length > 0) {
                    resolve(res.result.tableAccount)
                } else {
                    resolve(false)
                }
            },
            fail: () => {
                resolve(false)
            }
        })
    })
}

/**
 * 根据标签删除账单
 */
export async function removeTableAccounts(wx_openid, tableId) {
    return new Promise(resolve => {
        uniCloud.callFunction({
            name: 'account',
            data: {
                action: 'tableDelete',
                tableId: tableId,
                wx_openid: wx_openid
            },
            success: (res) => {
                if (res.result.status === 200) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            },
            fail: () => {
                resolve(false)
            }
        })
    })
}

/**
 * 判断标签是否重复
 */
export async function findTablesItem(wx_openid, userInfo) {
    return new Promise(resolve => {
        uniCloud.callFunction({
            name: 'tables',
            data: {
                action: 'find',
                wx_openid: wx_openid,
                tableInfo: userInfo
            },
            success: (res) => {
                if (res.result.status === 200
                    && res.result
                    && res.result.findList
                    && Array.isArray(res.result.findList)
                    && res.result.findList.length > 0) {
                    resolve(res.result.findList)
                } else {
                    resolve(false)
                }
            },
            fail: () => {
                resolve(false)
            }
        })
    })
}