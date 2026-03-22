import { createContext, useEffect, useState } from "react";
import LoadingPartPage from "../Components/Common/LoadingPartPage";
import { AuthImplementations } from "../Code/AuthImplementations";

export const GlobalContext = createContext(null);

export const GlobalContextProvider = ({children}) => {
    const [authInfo, setAuthInfo] = useState({})
    const [isInitialized, setIsInitialized] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
        
    const verify = async () => {
        try {
            const result = await AuthImplementations.SendVerify({
                onSuccess: (userData) => {
                    setAuthInfo(userData);
                    setIsInitialized(true);
                },
                onFail: () => {
                    setAuthInfo({});
                    setIsInitialized(false);
                }
            });
            return result;
        } catch (error) {
            console.error('Verify error:', error);
            setAuthInfo({});
            setIsInitialized(false);
            return false;
        }
    }

    const checkUserSigningIn = async () => {
        try {
            await verify(); // Wait for verification to complete
        } catch(error) {
            console.error('Auth check failed:', error);
            setAuthInfo({});
            setIsInitialized(false);
        } finally {
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