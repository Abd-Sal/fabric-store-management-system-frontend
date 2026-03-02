export const OurRoutes = {
    Home: '/',
    Login: '/sign-in',
    Logout: '/sign-out',
    Products: '/products',
    Purchases:{
        ShowAll: '/purchases/show',
        Bill: '/purchases/new-bill',
        ShowExpense: '/purchases/show-expense',
        Expense: '/purchases/expense',
    },
    Sales: {
        ShowAll: '/sales/show',
        Bill: '/sales/new-bill',
    },
    Customers: '/customers',
    Suppliers: '/suppliers',
    Catalogs: {
        ShowAll: '/catalogs/show',
        ShowByCustomer: '/catalogs/show-by-customer',
        Create: '/catalogs/create'
    },
    Payments: "/payments"
}