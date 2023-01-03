const PAGE_BASE_URL = {
    createTable: '/packageA/page/tables/create-table/create-table',
    keepAccounts: '/packageA/page/keep-accounts/keep-accounts'
}

export const navigateToPage = (url, params = '') => {
    uni.navigateTo({
        url: `${PAGE_BASE_URL[url]}${params}`
    });
}