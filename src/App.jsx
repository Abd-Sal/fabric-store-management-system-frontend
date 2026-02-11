import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Pages/Layout';
import Home from './Pages/Home'
import Purchases from './Pages/Purchases';
import Suppliers from './Pages/Suppliers';
import Customers from './Pages/Customers';
import Product from './Pages/Product';
import Sales from './Pages/Sales';
import Login from './Pages/Login'
import Logout from './Pages/Logout';
import Catalogs from './Pages/Catalogs';
import Payments from './Pages/Payments';
import { useContext } from 'react';
import { GlobalContext } from './Context/GlobalContext';
import NotFound from './Pages/NotFound';
import { OurRoutes } from './Routes/OurRoutes';

function App() {
  const {isInitialized} = useContext(GlobalContext)

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path={OurRoutes.Home} element={isInitialized ? <Home /> : <Navigate to="/sign-in" replace />} />
          <Route path={OurRoutes.Purchases} element={isInitialized ? <Purchases /> : <Navigate to="/sign-in" replace />} />
          <Route path={OurRoutes.Payments} element={isInitialized ? <Payments /> : <Navigate to="/sign-in" replace />} />
          <Route path={OurRoutes.Customers} element={isInitialized ? <Customers /> : <Navigate to="/sign-in" replace />} />
          <Route path={OurRoutes.Suppliers} element={isInitialized ? <Suppliers /> : <Navigate to="/sign-in" replace />} />
          <Route path={OurRoutes.Catalogs} element={isInitialized ? <Catalogs /> : <Navigate to="/sign-in" replace />} />
          <Route path={OurRoutes.Sales} element={isInitialized ? <Sales /> : <Navigate to="/sign-in" replace />} />
          <Route path={OurRoutes.Products} element={isInitialized ? <Product /> : <Navigate to="/sign-in" replace />} />
        </Route>
        <Route path='*' element={<NotFound />} />
        <Route path={OurRoutes.Login} element={<Login />} />
        <Route path={OurRoutes.Logout} element={<Logout />} />
      </Routes>
    </>
  )
}

export default App
