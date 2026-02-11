import { AuthService } from "../Services/AuthService"

export const LoginImplementations = {
    SendLogin : ({username, password, setLoader, setFailer, successBehavior})=>{
        setLoader(true);
        setFailer('');       
        AuthService.LoginRequest({username, password})
        .then((response)=>{
            successBehavior(response.data);
            return true;
        }).catch((error)=>{
            error.message = "فشل تسجيل الدخول، يرجى التحقق من اسم المستخدم وكلمة المرور والمحاولة مرة أخرى";
            setFailer(error.message || 'فشل ');
        }).finally(()=>{
            setLoader(false);
        });
        return false
    },

}