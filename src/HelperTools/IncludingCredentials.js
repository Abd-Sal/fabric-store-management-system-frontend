import { APIConfig } from "../APIConfig/APIConfig"
import axios from 'axios';

export const IncludingCredentials = () => {
    axios.defaults.withCredentials = true
    const api = axios.create({
        baseURL: `${APIConfig.BASE_DOMAIN}`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const apiBaseURL = axios.create({
        baseURL: `${APIConfig.BASE_URL}`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
