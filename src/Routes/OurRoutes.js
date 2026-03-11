export const OurRoutes = {
    Home: '/',
    Login: '/sign-in',
    Logout: '/sign-out',
    Products: '/products',
    ProductDetails: '/products/:productId/details',
    Purchases:{
        ShowAll: '/purchases/show',
        Bill: '/purchases/new-bill',
        Details: '/purchases/:purchaseId/details'
    },
    Expenses:{
        Show: '/expenses',
        Details: '/expenses/:expenseId/details',
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
    },
    Payments: `/payments`
}