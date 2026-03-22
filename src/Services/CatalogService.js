import { APIConfig } from "../APIConfig/APIConfig";
import axios from 'axios';
import { IncludingCredentials } from "../HelperTools/IncludingCredentials";
IncludingCredentials();
export const CatalogService = {
    AllCatalogs: ({token, page, pageSize, SortColumn, SortDir, From, To, Search, SearchColumn}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.Get}?`;
        if(page && !isNaN(page)) url += `page=${page}&`;
        if(pageSize && !isNaN(pageSize)) url += `pageSize=${pageSize}&`;
        if(SortColumn) url += `sortColumn=${SortColumn}&`;
        if(SortDir) url += `sortDir=${SortDir}&`;
        if(From && From !== "0001-01-01" && To) url += `from=${From}&`;
        if(To && To !== "0001-01-01" && From) url += `to=${To}&`;
        if(Search) url += `search=${Search}&`;
        if(SearchColumn && Search) url += `searchColumn=${SearchColumn}&`;       
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    AllAssignedCatalogs: ({token, page, pageSize, SortColumn, SortDir, From, To, Search, SearchColumn, includeReturned = false}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.GetAssignedCatalogs}?`;
        if(page && !isNaN(page)) url += `page=${page}&`;
        if(pageSize && !isNaN(pageSize)) url += `pageSize=${pageSize}&`;
        if(SortColumn) url += `sortColumn=${SortColumn}&`;
        if(SortDir) url += `sortDir=${SortDir}&`;
        if(From && From !== "0001-01-01" && To) url += `from=${From}&`;
        if(To && To !== "0001-01-01" && From) url += `to=${To}&`;
        if(Search) url += `search=${Search}&`;
        if(SearchColumn && Search) url += `searchColumn=${SearchColumn}&`;
        url += `includeReturned=${includeReturned}`
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CatalogByID: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.GetByID(id)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CreateCatalogOfStock: ({token, description = null, items}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.Create}`;
        const response = axios.post(url, {
            description: description ? description : null,
            items: items
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CreateCatalogOfSupplier: ({token, supplierID, description = null, items}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.CreateBySupplier}`;
        const response = axios.post(url, {
            supplierID: supplierID,
            description: description,
            items: items
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    PurchaseCatalog: ({token, supplierID, description = null, items, amount, paidAmount}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.Purchase}`;
        const response = axios.post(url, {
            supplierID: supplierID,
            description: description,
            items: items,
            amount: amount,
            paidAmount: paidAmount
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    AssingCatalog: ({token, customerID, catalogID}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.Assing}`;
        const response = axios.post(url, {
            CustomerID: customerID,
            catalogID: catalogID,
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    ReturnCatalog: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.Return(id)}`;
        const response = axios.post(url,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response;
    },
    DeleteCatalog: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.Delete(id)}`;
        const response = axios.delete(url,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response;
    },
    DestroyCatalog: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.Destroy(id)}`;
        const response = axios.post(url,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response;
    },
    PayPurchaseCatalog: ({token, id, paidAmount}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.Pay(id)}`;
        const response = axios.put(url,{
            paidAmount: paidAmount
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetCustomersWhoHasCatalogsAndNotBuyByMonthNumber: ({token, month, page, pageSize}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.GetCustomersWhoHasCatalogsAndNotBuyByMonthNumber(month)}?`;
        if(page && !isNaN(page)) url += `page=${page}&`;
        if(pageSize && !isNaN(pageSize)) url += `pageSize=${pageSize}&`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    EndpointsDetails: ({token}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.EndpointDetails}`;       
        const response = axios.options(url,{
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    AssignedCatalogsEndpointsDetails: ({token}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Catalog.AssignedCatalogsEndpointsDetails}`;       
        const response = axios.options(url,{
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }
}