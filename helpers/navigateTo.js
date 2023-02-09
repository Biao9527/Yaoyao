const PAGE_BASE_URL = {
    createTable: '/packageA/page/tables/create-table/create-table',
    keepAccounts: '/packageA/page/keep-accounts/keep-accounts',
    search: '/packageA/page/search/search',
    ranking: '/packageA/page/statistics/ranking-list/ranking-list'
}

export const navigateToPage = (url, params = '') => {
    uni.navigateTo({
        url: `${PAGE_BASE_URL[url]}${params}`
    });
}