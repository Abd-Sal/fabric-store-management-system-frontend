import { APIConfig } from "../APIConfig/APIConfig"
import axios from 'axios';
import { IncludingCredentials } from "../HelperTools/IncludingCredentials";
IncludingCredentials();
export const AuthService = {
    LoginRequest : function({username, password}){
        let url = `${APIConfig.BASE_DOMAIN}${APIConfig.Auth.Login}`;
        const response = axios.post(url,{
                Username: username,
                Password: password
            },
        );
        return response;
    },
    LogoutRequest : function(){
        let url = `${APIConfig.BASE_DOMAIN}${APIConfig.Auth.Logout}`;
        const response = axios.post(url,null)
        return response;
    },
    VerfiyRequest : function(){
        let url = `${APIConfig.BASE_DOMAIN}${APIConfig.Auth.Verify}`;
        const response = axios.get(url,null)
        return response;
    }
}