import { APIConfig } from "../APIConfig/APIConfig"
import axios from 'axios';

export const AuthService = {
    LoginRequest : function({username, password}){
        let url = `${APIConfig.BASE_DOMAIN}${APIConfig.Auth.Login}`;
        const response = axios.post(url, {
            Username: username,
            Password: password
        });
        return response;
    }
}