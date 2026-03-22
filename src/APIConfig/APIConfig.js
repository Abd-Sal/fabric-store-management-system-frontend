export const APIConfig = {
    BASE_URL: `https://192.168.1.111:7093/api`,
    BASE_DOMAIN: `https://192.168.1.111:7093`,
    Auth: {
        Login: "/auth/login",
        Logout: "/auth/logout",
        Verify: "/auth/verify"
    },
    Customer:{
        Get: "/customers",
        GetByID: (id) => `/customers/${id}`,
        Create: "/customers",
        Update: (id) => `/customers/${id}`,
        Delete: (id) => `/customers/${id}`,
        Activate: (id) => `/customers/${id}/activating`,
        GetCustomerSales: (id) => `/customers/${id}/sales`,
        GetCustomerCatalogs: (id) => `/customers/${id}/catalogs`,
        CustomerSearchForBill: (search) => `/customers/search?name=${search}`,
        EndpointDetails: "/customers"
    },
    Supplier:{
        Get: "/suppliers",
        GetByID: (id) => `/suppliers/${id}`,
        Create: "/suppliers",
        Update: (id) => `/suppliers/${id}`,
        Delete: (id) => `/suppliers/${id}`,
        Activate: (id) => `/suppliers/${id}/activating`,
        GetSupplierPurchases: (id) => `/suppliers/${id}/purchases`,
        SupplierSearchForBill: (search) => `/suppliers/search?name=${search}`,
        EndpointDetails: "/suppliers"
    },
    Sales:{
        Get: "/sales",
        GetByID: (id) => `/sales/${id}`,
        Create: "/sales",
        Pay: (id) => `/sales/${id}/pay`,
        Delete: (id) => `/sales/${id}`,
        GetSaleByInvoice: (invoice) => `/sales/invoice?invoice-number=${invoice}`,
        EndpointDetails: "/sales"
    },
    Purchases:{
        Get: "/purchases",
        GetByID: (id) => `/purchases/${id}`,
        Create: "/purchases",
        Pay: (id) => `/purchases/${id}/pay`,
        Delete: (id) => `/purchases/${id}`,
        GetPurchaseByInvoice: (invoice) => `/purchases/invoice?invoice-number=${invoice}`,
        EndpointDetails: "/purchases"
    },
    Product:{
        Get: "/products",
        GetByID: (id) => `/products/${id}`,
        Create: "/products",
        GetProductInventory: (id) => `/products/${id}/inventory`,
        GetProductStockTransactions: (id) => `/products/${id}/stock-transactions`,
        ProductSales: (id) => `/products/${id}/sales`,
        ProductPurchases: (id) => `/products/${id}/purchases`,
        ProductSearchForBill: (search) => `/products/search?code=${search}`,
        GetProductsByCode: (code) => `/products/get-by-code?code=${code}`,
        GetProductsWhichWillRanOut: `/products/will-ran-out`,
        EndpointDetails: "/products"
    },
    Payment:{
        Get: "/payments",
        EndpointDetails: "/payments",
    },
    Catalog:{
        Get: "/catalogs",
        GetAssignedCatalogs: "/catalogs/assigned-catalogs",
        GetByID: (id) => `/catalogs/${id}`,
        Create: "/catalogs",
        Delete: (id) => `/catalogs/${id}`,
        CreateBySupplier: "/catalogs/by-supplier",
        Purchase: "/catalogs/purchase-catalog",
        Assing: `/catalogs/assign-catalog`,
        Return: (id) => `/catalogs/${id}/return-catalog`,
        Destroy: (id) => `/catalogs/${id}/destroy`,
        Pay: (id) => `/catalogs/${id}/pay`,
        EndpointDetails: "/catalogs",
        AssignedCatalogsEndpointsDetails: "/catalogs/assigned-catalogs",
        GetCustomersWhoHasCatalogsAndNotBuyByMonthNumber: (month) => `/catalogs/${month}/customers-has-catalogs-and-not-buy`
    },
    Expense:{
        GetAll: '/expenses',
        Get: (id) => `/expenses/${id}`,
        Create: '/expenses',
        Delete: (id) => `/expenses/${id}`,
        EndpointDetails: "/expenses"
    },
}