import { AuthService } from "../Services/AuthService";

export const LogoutImplementations = {
    logout: (setIsInitialized)=>{
        AuthService.LogoutRequest()
        .then((response)=>{
            setIsInitialized(false);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally();
    }
}