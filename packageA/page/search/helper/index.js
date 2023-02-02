export const TYPE_HASH = {
    1: '-',
    2: '+'
}

export const FILTER_LIST = [
    {
        id: 0,
        title: '类型',
        name: '记账类型',
        list: [
            {text: '全部', value: 0},
            {text: '支出', value: 1},
            {text: '收入', value: 2}
        ]
    },
    {
        id: 1,
        title: '排序',
        name: '排序方式',
        list: [
            {text: '时间 ⬆', value: 0},
            {text: '时间 ⬇', value: 1},
            {text: '金额 ⬆', value: 2},
            {text: '金额 ⬇', value: 2}
        ]
    },
    {
        id: 2,
        title: '标签'
    },
    {
        id: 3,
        title: '日期'
    },
]