import { useContext, useEffect } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { AuthImplementations } from "../../Code/AuthImplementations"
import { useNavigate } from "react-router-dom"
import { OurRoutes } from "../../Routes/OurRoutes"

const Logout = () => {
  const {setIsInitialized, isInitialized, setAuthInfo} = useContext(GlobalContext)
  const implementations = AuthImplementations;
  const navigate = useNavigate();
  useEffect(()=>{
    if(isInitialized){
      implementations.SendLogout({
        setInitialized: setIsInitialized,
        setAuthInfo: setAuthInfo
      });
      navigate(OurRoutes.Login, {replace:true});
    }else{
      navigate(OurRoutes.Home, {replace:true});
    }
  }, [isInitialized])
  return (<></>)
}

export default Logout