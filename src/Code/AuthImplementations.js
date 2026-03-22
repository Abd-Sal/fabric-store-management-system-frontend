import { AuthService } from "../Services/AuthService"

export const AuthImplementations = {
    SendLogin : ({username, password, setLoader, setFailer, successBehavior})=>{ 
        setLoader(true);
        setFailer('');       
        AuthService.LoginRequest({username, password})
        .then((response)=>{
            successBehavior(response.data);
            return true;
        }).catch((error)=>{
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تسجيل الدخول للنظام',
                    errors: errorData.errors || { General: ['حدث خطأ غير متوقع'] }
                });
            } else {
                setFailer({
                    title: 'فشل الاتصال بالخادم',
                    errors: { General: [error.message || 'يرجى المحاولة مرة أخرى'] }
                });
            }            
        }).finally(()=>{
            setLoader(false);
        });
        return false
    },
    SendLogout : ({setInitialized, setAuthInfo}) => {
        AuthService.LogoutRequest()
        .then((response) => {
            setInitialized(false)
            setAuthInfo({})
        })
        .catch(error => {
            console.error(error);
        })
        .finally()
    },
    SendVerify : async ({onSuccess, onFail}) => {
        try {
            const response = await AuthService.VerfiyRequest();
            if (onSuccess) {
                onSuccess(response.data);
            }
            return true;
        } catch (error) {
            if(onFail)
                onFail();
            return false;
        }
    }
}