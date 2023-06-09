const PAGE_BASE_URL = {
    createTable: '/packageA/page/tables/create-table/create-table',
    keepAccounts: '/packageA/page/keep-accounts/keep-accounts',
    search: '/packageA/page/search/search',
    ranking: '/packageA/page/statistics/ranking-list/ranking-list',
    orderInfo: '/packageA/page/order-info/order-info',
    aiChat: '/packageA/page/ai-chat/ai-chat',
    wxLogin: '/packageA/page/wx-login/wx-login',
    updateUser: '/packageA/page/user/update-user/update-user'
}

export const navigateToPage = (url, params = '') => {
    uni.navigateTo({
        url: `${PAGE_BASE_URL[url]}${params}`
    });
}