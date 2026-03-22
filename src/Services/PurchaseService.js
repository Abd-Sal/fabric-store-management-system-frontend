import { APIConfig } from "../APIConfig/APIConfig";
import axios from 'axios';
import { IncludingCredentials } from "../HelperTools/IncludingCredentials";
IncludingCredentials();
export const PurchaseService = {
    AllPurchase: ({token, page, pageSize, SortColumn, SortDir, From, To, Search, SearchColumn}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Purchases.Get}?`;
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
    PurchaseByID: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Purchases.GetByID(id)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CreatePurchase: ({token, supplierID, paidAmount, purchaseItems}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Purchases.Create}`;
        const response = axios.post(url, {
            supplierID: supplierID,
            paidAmount: paidAmount,
            purchaseItems: purchaseItems
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    DeletePurchase: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Purchases.Delete(id)}`;
        const response = axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    PayPurchase: ({token, id, paidAmount}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Purchases.Pay(id)}`;
        const response = axios.put(url, {
            paidAmount: paidAmount
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetPurchaseByInvoiceNumber: ({token, invoiceNumber}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Purchases.GetPurchaseByInvoice(invoiceNumber)}`;
        const response = axios.Get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    EndpointsDetails: ({token}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Purchases.EndpointDetails}`;       
        const response = axios.options(url,{
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }
}