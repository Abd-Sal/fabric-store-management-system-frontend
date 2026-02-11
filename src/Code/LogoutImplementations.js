export const LogoutImplementations = {
    logout: (setAuthInfo, setIsInitialized)=>{
        localStorage.removeItem('auth');
        setAuthInfo({});
        setIsInitialized(false);
    }
}