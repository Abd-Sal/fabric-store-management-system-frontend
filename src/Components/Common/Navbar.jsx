import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { OurRoutes } from '../../Routes/OurRoutes';
import Dropdown from 'react-bootstrap/Dropdown';
import { IoIosAddCircleOutline } from "react-icons/io";
import { VscPreview } from "react-icons/vsc";

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
                    <Nav.Link as={NavLink} to={OurRoutes.Home} end>الرئيسية</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Products}>المنتجات</Nav.Link>
                    {/* Purchases And Expenses*/}
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        مصاريف
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={NavLink} to={OurRoutes.Purchases.ShowAll}>مراجعة فواتير مشتريات البضائع <VscPreview fontSize={20}/></Dropdown.Item>
                        <Dropdown.Item as={NavLink} to={OurRoutes.Expenses.Show}>مراجعة فواتير مصاريف المحل <VscPreview fontSize={20}/></Dropdown.Item>
                        <Dropdown.Item as={NavLink} to={OurRoutes.Purchases.Bill}>فاتورة مشتريات جديدة <IoIosAddCircleOutline fontSize={25}/></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* Sales */}
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        المبيعات
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={NavLink} to={OurRoutes.Sales.ShowAll}>مراجعة فواتير المبيعات <VscPreview fontSize={20}/></Dropdown.Item>
                        <Dropdown.Item as={NavLink} to={OurRoutes.Sales.Bill}>فاتورة مبيعات جديدة <IoIosAddCircleOutline fontSize={25}/></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Nav.Link as={NavLink} to={OurRoutes.Payments}>العمليات</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Customers}>الزبائن</Nav.Link>
                    <Nav.Link as={NavLink} to={OurRoutes.Suppliers}>الموردين</Nav.Link>
                    {/* Catalogs */}
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        الكاتالوكات
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={NavLink} to={OurRoutes.Catalogs.ShowAll}>تصفح الكاتالوغات <VscPreview fontSize={20}/></Dropdown.Item>
                        <Dropdown.Item as={NavLink} to={OurRoutes.Catalogs.ShowAssingedCatalogs}>تصفح الكاتالوغات المعارة <VscPreview fontSize={20}/></Dropdown.Item>
                        <Dropdown.Item as={NavLink} to={OurRoutes.Catalogs.Create}>كاتالوغ جديد <IoIosAddCircleOutline fontSize={25}/></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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