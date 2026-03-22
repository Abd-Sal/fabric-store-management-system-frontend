import { APIConfig } from "../APIConfig/APIConfig";
import axios from 'axios';
import { IncludingCredentials } from "../HelperTools/IncludingCredentials";
IncludingCredentials();
export const ProductService = {
    AllProducts: ({token, page, pageSize, SortColumn, SortDir, From, To, Search, SearchColumn}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.Get}?`;
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
    ProductByID: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.GetByID(id)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CreateProduct: ({token, name = null, code, color, material = null, unit}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.Create}`;
        const response = axios.post(url, {
            name: name,
            code: code,
            color: color,
            unit: unit,
            material: material,
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    ProductInventory: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.GetProductInventory(id)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    ProductStockTransactions: ({token, id, page, pageSize}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.GetProductStockTransactions(id)}`;
        if(page) url += `?page=${page}&`;
        if(pageSize) url += `pageSize=${pageSize}&`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    ProductSales: ({token, id, page, pageSize}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.GetProductSales(id)}`;
        if(page) url += `?page=${page}&`;
        if(pageSize) url += `pageSize=${pageSize}&`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    ProductPurchases: ({token, id, page, pageSize}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.GetProductPurchases(id)}`;
        if(page) url += `?page=${page}&`;
        if(pageSize) url += `pageSize=${pageSize}&`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetProductsWhichWillRanOut: ({token, minQuantity, page, pageSize}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.GetProductsWhichWillRanOut}`;
        if(page) url += `?page=${page}&`;
        if(pageSize) url += `pageSize=${pageSize}&`;
        url += `minQuantity=${minQuantity}`
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    SearchProductForBill: ({token, search})=>{
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.ProductSearchForBill(search)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetProductsByCode: ({token, code}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.GetProductsByCode(code)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    EndpointsDetails: ({token}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Product.EndpointDetails}`;       
        const response = axios.options(url,{
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }
}