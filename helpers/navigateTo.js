const PAGE_BASE_URL = {
    createTable: '/packageA/page/tables/create-table/create-table'
}

export const navigateToPage = (url, params = '') => {
    uni.navigateTo({
        url: `${PAGE_BASE_URL[url]}${params}`
    });
}