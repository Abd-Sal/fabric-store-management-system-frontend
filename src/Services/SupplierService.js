import { APIConfig } from "../APIConfig/APIConfig";
import axios from 'axios';

export const SupplierService = {
    AllSuppliers: ({token, page, pageSize, SortColumn, SortDir, Search, SearchColumn, includeOnlyActive = true})=>{
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.Get}/${includeOnlyActive}?`;
        if(page && !isNaN(page)) url += `page=${page}&`;
        if(pageSize && !isNaN(pageSize)) url += `pageSize=${pageSize}&`;
        if(SortColumn) url += `sortColumn=${SortColumn}&`;
        if(SortDir) url += `sortDir=${SortDir}&`;
        if(Search) url += `search=${Search}&`;
        if(SearchColumn && Search) url += `searchColumn=${SearchColumn}&`;       
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    SupplierByID: ({token, id, includeOnlyActive = true}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.GetByID(id)}/${includeOnlyActive}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CreateSupplier: ({token, name, email = null, phone = null, address = null}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.Create}`;
        const response = axios.post(url, {
            name: name,
            email: email,
            phone: phone,
            address: address
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    UpdateSupplier: ({token, id, name, email = null, phone = null, address = null}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.Update(id)}`;
        const response = axios.put(url, {
            name: name,
            email: email,
            phone: phone,
            address: address
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    DeactivateSupplier: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.Delete(id)}`;
        const response = axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    ActivateSupplier: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.Activate(id)}`;
        const response = axios.put(url, 
            null,    
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response;
    },
    SupplierPurchases: ({token, id, page, pageSize, Search, From, To}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.GetSupplierPurchases(id)}?`;
        if(page && !isNaN(page)) url += `page=${page}&`;
        if(pageSize && !isNaN(pageSize)) url += `pageSize=${pageSize}&`;
        if(Search) url += `invoiceNumber=${Search}&`;
        if(From && From !== "0001-01-01" && To) url += `from=${From}&`;
        if(To && To !== "0001-01-01" && From) url += `to=${To}&`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    SearchSupplierForBill: ({token, search})=>{
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.SupplierSearchForBill(search)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    EndpointsDetails: ({token}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Supplier.EndpointDetails}`;       
        const response = axios.options(url,{
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }
}