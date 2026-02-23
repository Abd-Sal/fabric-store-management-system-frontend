import Navbar from "../../Components/Common/Navbar"
import Footer from "../../Components/Common/Footer"
import { Outlet } from "react-router-dom"

const Layout = ({ children }) => {
  return (
      <>
          <div className={"wrapper bg-dark"}>
              <header>
                  <Navbar />
              </header>
              <main>
                  <Outlet />
              </main>
              <footer>
                  <Footer />
              </footer>
          </div>
      </>
  )
}
export default Layout