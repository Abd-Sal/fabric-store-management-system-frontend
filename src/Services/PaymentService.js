import { APIConfig } from "../APIConfig/APIConfig";
import axios from 'axios';
import { IncludingCredentials } from "../HelperTools/IncludingCredentials";
IncludingCredentials();
export const PaymentService = {
    AllPayments: ({token, page, pageSize, From, To, Search}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Payment.Get}?`;
        if(page && !isNaN(page)) url += `page=${page}&`;
        if(pageSize && !isNaN(pageSize)) url += `pageSize=${pageSize}&`;
        if(From && From !== "0001-01-01" && To) url += `from=${From}&`;
        if(To && To !== "0001-01-01" && From) url += `to=${To}&`;
        if(Search) url += `search=${Search}&`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }
}