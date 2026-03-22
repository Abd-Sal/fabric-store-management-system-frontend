import { APIConfig } from "../APIConfig/APIConfig";
import axios from 'axios';
import { IncludingCredentials } from "../HelperTools/IncludingCredentials";
IncludingCredentials();
export const ExpenseService = {
    AllExpenses: ({token, page, pageSize, SortColumn, SortDir, From, To, Search, SearchColumn}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Expense.GetAll}?`;
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
    ExpenseByID: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Expense.Get(id)}`;
        const response = axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    CreateExpense: ({token, reqBody}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Expense.Create}`;
        const response = axios.post(url, {
            message: reqBody.message,
            dollarPriceInSyr: reqBody.dollarPriceInSyr,
            syrianAmount: reqBody.syrianAmount,
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });        
        return response;
    },
    DeleteExpense: ({token, id}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Expense.Delete(id)}`;
        const response = axios.delete(url,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response;
    },
    EndpointsDetails: ({token}) => {
        let url = `${APIConfig.BASE_URL}${APIConfig.Expense.EndpointDetails}`;       
        const response = axios.options(url,{
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
}