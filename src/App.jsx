import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Pages/Common/Layout';
import Home from './Pages/Common/Home'
import Purchases from './Pages/Purchase/Purchases';
import Suppliers from './Pages/Supplier/Suppliers';
import Customers from './Pages/Customer/Customers';
import Product from './Pages/Product/Product';
import Sales from './Pages/Sale/Sales';
import Login from './Pages/Auth/Login'
import Logout from './Pages/Auth/Logout';
import Catalogs from './Pages/Catalog/Catalogs';
import Payments from './Pages/Payment/Payments';
import { GlobalContext } from './Context/GlobalContext';
import NotFound from './Pages/Common/NotFound';
import { OurRoutes } from './Routes/OurRoutes';
import PurchaseBill from './Pages/Purchase/PurchaseBill';
import SaleBill from './Pages/Sale/SaleBill';
import CreateCatalog from './Pages/Catalog/CreateCatalog';
import CatalogsByCustomer from './Pages/Catalog/CatalogsByCustomer';
import ProductDetails from './Pages/Product/ProductDetails';
import PurchaseDetails from './Pages/Purchase/PurchaseDetails';
import SaleDetails from './Pages/Sale/SaleDetails';
import CustomerDetails from './Pages/Customer/CustomerDetails';
import SupplierDetails from './Pages/Supplier/SupplierDetails';
import CatalogDetails from './Pages/Catalog/CatalogDetails';
import AssignedCatalogs from './Pages/Catalog/AssignedCatalogs';
import Expenses from './Pages/Expense/Expenses';
import ExpenseDetails from './Pages/Expense/ExpenseDetails';

function App() {
  const {isInitialized} = useContext(GlobalContext)

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path={OurRoutes.Home} element={isInitialized ? <Home /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Purchases.Details} element={isInitialized ? <PurchaseDetails /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Purchases.ShowAll} element={isInitialized ? <Purchases /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Purchases.Bill} element={isInitialized ? <PurchaseBill /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Sales.Details} element={isInitialized ? <SaleDetails /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Sales.ShowAll} element={isInitialized ? <Sales /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Sales.Bill} element={isInitialized ? <SaleBill /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Payments} element={isInitialized ? <Payments /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Customers} element={isInitialized ? <Customers /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.CustomersDetails} element={isInitialized ? <CustomerDetails /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Suppliers} element={isInitialized ? <Suppliers /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.SuppliersDetails} element={isInitialized ? <SupplierDetails /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Catalogs.ShowAll} element={isInitialized ? <Catalogs /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Catalogs.ShowAssingedCatalogs} element={isInitialized ? <AssignedCatalogs /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Catalogs.Details} element={isInitialized ? <CatalogDetails /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Catalogs.ShowByCustomer} element={isInitialized ? <CatalogsByCustomer /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Catalogs.Create} element={isInitialized ? <CreateCatalog /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Products} element={isInitialized ? <Product /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Expenses.Show} element={isInitialized ? <Expenses /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.Expenses.Details} element={isInitialized ? <ExpenseDetails /> : <Navigate to={OurRoutes.Login} replace />} />
          <Route path={OurRoutes.ProductDetails} element={isInitialized ? <ProductDetails /> : <Navigate to={OurRoutes.Login} replace />} />
        </Route>
        <Route path='*' element={<NotFound />} />
        <Route path={OurRoutes.Login} element={<Login />} />
        <Route path={OurRoutes.Logout} element={<Logout />} />
      </Routes>
    </>
  )
}

export default App
