import { useContext, useEffect } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { LogoutImplementations } from "../../Code/LogoutImplementations"
import { useNavigate } from "react-router-dom"
import { OurRoutes } from "../../Routes/OurRoutes"

const Logout = () => {
  const {setAuthInfo, setIsInitialized, isInitialized} = useContext(GlobalContext)
  const implementations = LogoutImplementations;
  const navigate = useNavigate();
  useEffect(()=>{
    if(isInitialized){
      implementations.logout(setAuthInfo, setIsInitialized);
      navigate(OurRoutes.Login, {replace:true});
    }else{
      navigate(OurRoutes.Home, {replace:true});
    }
  }, [isInitialized])
  return (<></>)
}

export default Logout