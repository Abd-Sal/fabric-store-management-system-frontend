export const OurRoutes = {
    Home: '/',
    Login: '/sign-in',
    Logout: '/sign-out',
    Products: '/products',
    ProductDetails: '/products/:productId/details',
    Purchases:{
        ShowAll: '/purchases/show',
        Bill: '/purchases/new-bill',
        ShowExpense: '/purchases/show-expense',
        Expense: '/purchases/expense',
        Details: '/purchases/:purchaseId/details'
    },
    Sales: {
        ShowAll: '/sales/show',
        Bill: '/sales/new-bill',
        Details: '/sales/:saleId/details'
    },
    Customers: '/customers',
    Suppliers: '/suppliers',
    Catalogs: {
        ShowAll: '/catalogs/show',
        Create: '/catalogs/create'
    },
    Payments: "/payments"
}