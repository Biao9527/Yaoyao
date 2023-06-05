export const TYPE_HASH = {
    1: '-',
    2: '+'
}

export const TYPE_TEXT = {
    1: '支出',
    2: '收入'
}

export const SORT_TEXT = {
    'time_up': '时间由远到近',
    'time_down': '时间由近到远',
    'money_up': '金额由低到高',
    'money_down': '金额由高到低',
}

export const MONEY_SORT_TEXT = {
    'money_up': '金额 ⬆',
    'money_down': '金额 ⬇',
}

export const TIME_SORT_TEXT = {
    'time_up': '时间 ⬆',
    'time_down': '时间 ⬇',
}

export const SORT_TYPE_OBJ = {
    'time_up': {key: 'date', value: 'asc'},
    'time_down': {key: 'date', value: 'desc'},
    'money_up': {key: 'money', value: 'asc'},
    'money_down': {key: 'money', value: 'desc'}
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
            {text: '时间 ⬆', value: 'time_up'},
            {text: '时间 ⬇', value: 'time_down'},
            {text: '金额 ⬆', value: 'money_up'},
            {text: '金额 ⬇', value: 'money_down'}
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