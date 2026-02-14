import { APIConfig } from "../APIConfig/APIConfig";
import axios from 'axios';

export const SaleService = {
    AllSales: ({token, page, pageSize, SortColumn, SortDir, From, To, Search, SearchColumn}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Sales.Get}?`;
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
    SaleByID: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Sales.GetByID(id)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CreateSale: ({token, customerID, discount, paidAmount, saleItems}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Sales.Create}`;
        const response = axios.post(url, {
            customerID: customerID,
            discount: discount,
            paidAmount: paidAmount,
            saleItems: saleItems
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    DeleteSale: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Sales.Delete(id)}`;
        const response = axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    PaySale: ({token, id, paidAmount}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Sales.Pay(id)}`;
        const response = axios.put(url, {
            paidAmount: paidAmount
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetSaleByInvoiceNumber: ({token, invoiceNumber}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Sales.GetSaleByInvoice(invoiceNumber)}`;
        const response = axios.Get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    EndpointsDetails: ({token}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Sales.EndpointDetails}`;       
        const response = axios.options(url,{
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }
}