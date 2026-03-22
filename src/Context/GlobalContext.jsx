import { createContext, useEffect, useState } from "react";
import LoadingPartPage from "../Components/Common/LoadingPartPage";
import { AuthImplementations } from "../Code/AuthImplementations";

export const GlobalContext = createContext(null);

export const GlobalContextProvider = ({children}) => {
    const [authInfo, setAuthInfo] = useState({})
    const [isInitialized, setIsInitialized] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
        
    const verify = () => {
        return AuthImplementations.SendVerify({
            onSuccess: setAuthInfo
        })
    }

    const checkUserSigningIn = ()=>{
        try{
            if(verify()){
                setIsInitialized(true)
            }
            else{
                setAuthInfo({})
                setIsInitialized(false)
            }
        }catch(error){
            console.error('Auth check failed:', error);
        }
        finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        checkUserSigningIn();
    }, [])

    if (isLoading) {
        return <LoadingPartPage />
    }

    return (
        <GlobalContext.Provider value={{authInfo, setAuthInfo, isInitialized, setIsInitialized}}>
            {children}
        </GlobalContext.Provider>
    )
}