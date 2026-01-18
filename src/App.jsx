import { Route, Routes } from 'react-router-dom';
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

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/purchases' element={<Purchases />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/suppliers' element={<Suppliers />} />
          <Route path='/sales' element={<Sales />} />
          <Route path='/products' element={<Product />} />
        </Route>
        <Route path='/sign-in' element={<Login />} />
        <Route path='/sign-out' element={<Logout />} />
      </Routes>
    </>
  )
}

export default App
