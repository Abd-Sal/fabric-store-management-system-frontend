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
    CustomersDetails: '/customers/:customerId/details',
    Suppliers: '/suppliers',
    SuppliersDetails: '/suppliers/:supplierId/details',
    Catalogs: {
        ShowAll: '/catalogs/show',
        Details: '/catalogs/:catalogId/details',
        Create: '/catalogs/create',
        ShowAssingedCatalogs: '/catalogs/show-assigned-catalogs',
        AssignCatalogs: '/catalogs/assigning-catalogs',
    },
    Payments: "/payments"
}