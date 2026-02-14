import { APIConfig } from "../APIConfig/APIConfig";
import axios from 'axios';

export const CustomerService = {
    AllCustomers: ({token, page, pageSize, SortColumn, SortDir, Search, SearchColumn, includeOnlyActive = true})=>{
        let url = `${APIConfig.BASE_URL}${APIConfig.Customer.Get}/${includeOnlyActive}?`;
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
    CustomerByID: ({token, id, includeOnlyActive = true}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Customer.GetByID(id)}/${includeOnlyActive}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CreateCustomer: ({token, firstName, lastName, email = null, phone = null, address = null}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Customer.Create}`;
        const response = axios.post(url, {
            firstName: firstName,
            lastName: lastName,
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
    UpdateCustomer: ({token, id, firstName, lastName, email = null, phone = null, address = null}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Customer.Update(id)}`;
        const response = axios.put(url, {
            firstName: firstName,
            lastName: lastName,
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
    DeactivateCustomer: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Customer.Delete(id)}`;
        const response = axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    ActivateCustomer: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Customer.Activate(id)}`;
        const response = axios.put(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    EndpointsDetails: ({token}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Customer.EndpointDetails}`;       
        const response = axios.options(url,{
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }
}