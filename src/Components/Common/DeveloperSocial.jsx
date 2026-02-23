import { NavLink } from "react-router-dom"

const DeveloperSocial = () => {
  return (
    <>
        <div className="d-flex justify-content-center justify-content-md-end align-items-center ">
            <NavLink to={'https://wa.me/0982760361'} target="_blank" className={'small-ico'}>
                <img src="../../src/assets/WhatsApp.ico" alt="Whatsapp" />
            </NavLink>
            <NavLink to={'https://t.me/abdsy25'} target="_blank" className={'small-ico'}>
                <img src="../../src/assets/Telegram App.ico" alt="Telegram" />
            </NavLink>
            <NavLink to={'https://www.linkedin.com/in/abd-al-ruhman-al-saleh-665436362'} target="_blank" className={'small-ico'}>
                <img src="../../src/assets/LinkedIn.ico" alt="LinkedIn" />
            </NavLink>
            <NavLink to={'https://m.me/abd.sy.839085'} target="_blank" className={'small-ico'}>
                <img src="../../src/assets/Facebook Messenger.ico" alt="Facebook Messenger" />
            </NavLink>
        </div>
    </>
  )
}

export default DeveloperSocial