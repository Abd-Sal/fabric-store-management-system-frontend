import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { OurRoutes } from '../Routes/OurRoutes';

function ColorSchemesExample() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container fluid>
            <div className='w-25 d-flex justify-content-start align-items-center'>
                <Navbar.Brand 
                    as={NavLink} 
                    to="/"
                >SWAR</Navbar.Brand>
            </div>
            <div className='w-50'>
                <Nav className="me-auto d-flex justify-content-center align-items-center gap-4">
                    <Nav.Link as={NavLink} to={OurRoutes.Home} end>الرئيسية</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Products}>المنتجات</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Purchases}>المشتريات</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Sales}>المبيعات</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Payments}>العمليات</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Customers}>الزبائن</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Suppliers}>الموردين</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Catalogs}>الكاتالوكات</Nav.Link>
                </Nav>
            </div>
            <div className='w-25 d-flex justify-content-end align-items-center'>            
                <NavLink to={OurRoutes.Logout}
                  className='btn btn-danger d-flex justify-content-center align-items-center rounded-1'
                ><IoMdLogOut /></NavLink>
            </div>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;