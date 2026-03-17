import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { OurRoutes } from '../../Routes/OurRoutes';
import Dropdown from 'react-bootstrap/Dropdown';
import { IoIosAddCircleOutline } from "react-icons/io";
import { VscPreview } from "react-icons/vsc";
import CustomOffCanves from '../Common/CustomOffCanves';

function ColorSchemesExample() {

  return (
    <>
    <div className='px-2 py-2 w-100 d-lg-none d-flex justify-content-between align-items-center'>
      <CustomOffCanves 
        title={'واجهة التنقلات'}
      >
        <div className='w-100 d-flex flex-column justify-content-start align-items-start gap-3'>
            <NavLink className={`fw-bold text-white w-100 d-flex jusityf-content-start align-items-center text-decoration-none border-0 border-bottom b-btn-hover py-3`} to={OurRoutes.Home}>الرئيسية</NavLink>
            <NavLink className={`fw-bold text-white w-100 d-flex jusityf-content-start align-items-center text-decoration-none border-0 border-bottom b-btn-hover py-3`} to={OurRoutes.Products}>المنتجات</NavLink>
            {/* Sales */}
            <Dropdown className='w-100'>
                <Dropdown.Toggle
                className={`rounded-0 px-0 fw-bold text-white w-100 d-flex jusityf-content-start align-items-center text-decoration-none border-0 border-bottom b-btn-hover py-3`}
                variant="dark"
                id="dropdown-basic">
                المبيعات
                </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item
                    as={NavLink}
                    to={OurRoutes.Sales.ShowAll}>مراجعة فواتير المبيعات <VscPreview fontSize={20}/></Dropdown.Item>
                <Dropdown.Item
                    as={NavLink}
                    to={OurRoutes.Sales.Bill}>فاتورة مبيعات جديدة <IoIosAddCircleOutline fontSize={25}/></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {/* Purchases And Expenses*/}
            <Dropdown className='w-100'>
                <Dropdown.Toggle
                className={`rounded-0 px-0 fw-bold text-white w-100 d-flex jusityf-content-start align-items-center text-decoration-none border-0 border-bottom b-btn-hover py-3`}
                variant="dark"
                id="dropdown-basic">
                مصاريف
                </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to={OurRoutes.Purchases.ShowAll}>مراجعة فواتير مشتريات البضائع <VscPreview fontSize={20}/></Dropdown.Item>
                <Dropdown.Item as={NavLink} to={OurRoutes.Expenses.Show}>مراجعة فواتير مصاريف المحل <VscPreview fontSize={20}/></Dropdown.Item>
                <Dropdown.Item as={NavLink} to={OurRoutes.Purchases.Bill}>فاتورة مشتريات جديدة <IoIosAddCircleOutline fontSize={25}/></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <NavLink className={`fw-bold text-white w-100 d-flex jusityf-content-start align-items-center text-decoration-none border-0 border-bottom b-btn-hover py-3`} to={OurRoutes.Payments}>العمليات</NavLink>
            {/* Catalogs */}
            <Dropdown className='w-100'>
                <Dropdown.Toggle
                className={`rounded-0 px-0 fw-bold text-white w-100 d-flex jusityf-content-start align-items-center text-decoration-none border-0 border-bottom b-btn-hover py-3`}
                variant="dark"
                id="dropdown-basic">
                الكاتالوكات
                </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to={OurRoutes.Catalogs.ShowAll}>تصفح الكاتالوغات <VscPreview fontSize={20}/></Dropdown.Item>
                <Dropdown.Item as={NavLink} to={OurRoutes.Catalogs.ShowAssingedCatalogs}>تصفح الكاتالوغات المعارة <VscPreview fontSize={20}/></Dropdown.Item>
                <Dropdown.Item as={NavLink} to={OurRoutes.Catalogs.Create}>كاتالوغ جديد <IoIosAddCircleOutline fontSize={25}/></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <NavLink className={`fw-bold text-white w-100 d-flex jusityf-content-start align-items-center text-decoration-none border-0 border-bottom b-btn-hover py-3`} to={OurRoutes.Customers}>الزبائن</NavLink>
            <NavLink className={`fw-bold text-white w-100 d-flex jusityf-content-start align-items-center text-decoration-none border-0 border-bottom b-btn-hover py-3`} to={OurRoutes.Suppliers}>الموردين</NavLink>
        </div>
      </CustomOffCanves>
      <div className='d-flex justify-content-start align-items-center'>
          <NavLink
            className='text-decoration-none logo fst-italic fw-bold text-white d-flex justify-content-center align-items-center'
            as={NavLink} 
            to="/"
          >SWAR</NavLink>
      </div>
      <NavLink to={OurRoutes.Logout}
        className='btn btn-dark text-danger d-flex justify-content-center align-items-center rounded-1'
      ><IoMdLogOut fontSize={30}/></NavLink>
    </div>
    <div className='d-lg-block d-none'>
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
    </div>
    </>
  );
}

export default ColorSchemesExample;