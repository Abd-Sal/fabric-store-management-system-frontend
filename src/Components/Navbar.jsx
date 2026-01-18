import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";

function ColorSchemesExample() {
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
                    <Nav.Link as={NavLink} to="/" end>الرئيسية</Nav.Link>
                    <Nav.Link as={NavLink} to="/products">المنتجات</Nav.Link>
                    <Nav.Link as={NavLink} to="/purchases">المشتريات</Nav.Link>
                    <Nav.Link as={NavLink} to="/sales">المبيعات</Nav.Link>
                    <Nav.Link as={NavLink} to="/customers">الزبائن</Nav.Link>
                    <Nav.Link as={NavLink} to="/suppliers">الموردين</Nav.Link>
                </Nav>
            </div>
            <div className='w-25 d-flex justify-content-end align-items-center'>            
                <Button className='btn-danger d-flex justify-content align-items-center rounded-1'><IoMdLogOut /></Button>
            </div>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;