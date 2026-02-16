import { Col, Container, Row } from "react-bootstrap"
import CreateCustomerModal from "../Components/Customer/CreateCustomerModal"
import PaginationFilterationSortingSearching from "../Components/PaginationFilterationSortingSearching"
import { use, useContext, useEffect, useState } from "react"
import { CustomerImplementations } from "../Code/CustomerImplementations"
import { GlobalContext } from "../Context/GlobalContext"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import PaginationButtons from "../Components/PaginationButtons"
import DataViewer from "../Components/DataViewer"

const Customers = () => {
  const {authInfo} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(false);
  const [failer, setFailer] = useState({});
  const [searchBy, setSearchBy] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [defaultSearchCol, setDefaultSearchCol] = useState({});
  const [defaultSortCol, setDefaultSortCol] = useState({});
  const [customers, setCustomers] = useState([]);
  const [customerLoader, setCustomerLoader] = useState(false);
  const [customerFailer, setCustomerFailer] = useState({});
  const [filter, setFilter] = useState({
    search: '',
    searchBy: defaultSearchCol.value || '',
    sortBy: defaultSortCol.value || '',
    sortDir: 'desc',
    page: 1,
    pageSize: 50
  })
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: '',
    hasNextPage: ''
  })
  const [finishInitializeFilter, setFinishInitializeFilter] = useState(false);
  const [includeOnlyActive, setIncludeOnlyActive] = useState(true)
  const [addedCustomer, setAddedCustomer] = useState(false);
  const implementations = CustomerImplementations;

  const fillEndpointDetails = ()=>{  
    implementations.FillSearchAndSort({
      token: authInfo.Token,
      setLoader: setIsLoading,
      setFailer: setFailer,
      setSearchBy: setSearchBy,
      setSortBy: setSortBy,
      setDefaultSearchCol: setDefaultSearchCol,
      setDefaultSortCol: setDefaultSortCol
    });
  }

  const fillCustomers = ()=>{
    implementations.FillCustomerTable({
      token: authInfo.Token,
      setFailer: setCustomerFailer,
      setLoader: setCustomerLoader,
      setCustomers: setCustomers,
      filter: filter,
      setPagination: setPagination,
      includeOnlyActive: includeOnlyActive
    });
  }

  const handleChangeIncludedCustomers = (e) =>
      setIncludeOnlyActive(!includeOnlyActive)

  useEffect(() => {
        const timer = setTimeout(() => {
          if(!finishInitializeFilter){
            if(filter.searchBy && filter.sortBy){
              setPagination({
                pageNumber: '',
                totalItems: '',
                totalPages: '',
                hasPreviousPage: '',
                hasNextPage: ''
              })
              setFinishInitializeFilter(true);
            } 
          }else
            fillCustomers();
        }, 500);
        return () => clearTimeout(timer);
  }, [filter, includeOnlyActive])

  useEffect(() => {
    if (!finishInitializeFilter) return;
    fillCustomers();
  }, [finishInitializeFilter])

  useEffect(() => {
    if (defaultSearchCol.value && filter.searchBy === '') {
      setFilter(prev => ({
        ...prev,
        searchBy: defaultSearchCol.value,
      }));
    }
    if(defaultSortCol.value && filter.sortBy === ''){
      setFilter(prev => ({
        ...prev,
        sortBy: defaultSortCol.value,
        sortDir: 'desc'
      }));
    }
  }, [{defaultSearchCol, defaultSortCol}]);

  // fill endpoint details
  useEffect(()=>{
    if(searchBy.length > 0 && sortBy.length > 0) return;
    fillEndpointDetails();
  }, [])

  useEffect(()=>{
    if(!addedCustomer) return;
    fillCustomers();
    setAddedCustomer(false);
  }, [addedCustomer])
  
  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <h2 className="text-white d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهة الزبائن</h2>
        </Col>
      </Row>
      <Row className="text-white">
        <Col lg={12}>
          {
            pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
            !customerFailer?
              <Row>
                <Col lg={3}>
                  <CreateCustomerModal 
                    token={authInfo.Token}
                    implementationsCreateCustomer={implementations.CreateCustomer}
                    addedCustomer={addedCustomer}
                    setAddedCustomer={setAddedCustomer}
                    SpecialStyling="w-100 p-3"
                  />
                </Col>
                <Col lg={9}>
                    <PaginationButtons
                      filter={filter}
                      pagination={pagination}
                      setFilter={setFilter}
                    />
                </Col>
                <Col lg={3}>
                  <form action="">
                    <div className="form-group">
                    <label 
                      htmlFor="includeOnlyActive"
                      className={`d-flex justify-content-center align-items-center p-2 w-100 btn btn-danger ${includeOnlyActive && 'opacity-50 border border-primary'}`}  
                      title={`${includeOnlyActive ? 'تضمين' : 'الغاء'}`}
                    >{
                      includeOnlyActive ?
                      'تضمين الزبائن المحظرين'
                      :
                      'الغاء تضمين الزبائن المحظورين'
                    }</label>
                    <input
                      hidden
                      id="includeOnlyActive"
                      type="checkbox"
                      name="includeOnlyActive"
                      value={includeOnlyActive}
                      checked={includeOnlyActive}
                      onChange={handleChangeIncludedCustomers}
                    />
                    </div>
                  </form>
                </Col>
                <Col lg={9}>
                  <div className="p-2 rounded border bg-primary w-100 d-flex flex-wrap justify-content-start align-items-center gap-3">
                    <p className="mb-0"><strong>الصفحة:</strong> {pagination.pageNumber}</p>
                    <p className="mb-0"><strong>عدد الصفحات:</strong> {pagination.totalPages}</p>
                    <p className="mb-0"><strong>عدد العناصر:</strong> {pagination.totalItems}</p>
                  </div>                
                </Col>
              </Row>
              :
              ''
          }
        </Col>
        {/* Filteration */}
        <Col lg={3}>
          {
            isLoading &&
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          }
          {
            Object.keys(failer).length > 0 &&
            <div className="w-100">
              <Alert variant="danger">
                <h5>{failer.title || 'فشل'}</h5>
                {
                  failer.errors && Object.keys(failer.errors).length > 0 &&
                  <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                    {
                      Object.keys(failer.errors).map((key, index) => (
                        <li key={index} className="w-100">{failer.errors[key]}</li>
                      ))
                    }
                  </ul>
                }
              <Button onClick={fillEndpointDetails} variant="danger">اعادة المحاولة</Button>
              </Alert>
            </div>
          }
          {
            Object.keys(failer).length === 0 && !isLoading && (searchBy.length === 0 || sortBy.length === 0) &&
            <Alert variant="warning" className="text-center">
              لا توجد تفاصيل نقاط نهاية للبحث والترتيب، يرجى المحاولة مرة أخرى.
            </Alert>
          }
          {
            Object.keys(failer).length === 0 && !isLoading && searchBy.length > 0 && sortBy.length > 0 &&
            <PaginationFilterationSortingSearching 
              searchBy={searchBy}
              sortBy={sortBy}
              defaultSearchCol={defaultSearchCol}
              defaultSortCol={defaultSortCol}
              filter={filter}
              setFilter={setFilter}
            />
          }
        </Col>
        {/* Customers Table */}
        <Col lg={9}>
          {
            customerLoader &&
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          }
          {
            Object.keys(customerFailer).length > 0 &&
            <div className="w-100">
              <Alert variant="danger">
                <h5>{customerFailer.title || 'فشل'}</h5>
                {
                  customerFailer.errors && Object.keys(customerFailer.errors).length > 0 &&
                  <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                    {
                      Object.keys(customerFailer.errors).map((key, index) => (
                        <li key={index} className="w-100">{customerFailer.errors[key]}</li>
                      ))
                    }
                  </ul>
                }
                <Button onClick={fillCustomers} variant="danger">اعادة المحاولة</Button>
              </Alert>
            </div>
          }
          {
            customerFailer === '' && !customerLoader && customers.length === 0 &&
            <Alert variant="warning" className="text-center">
              لا يوجد بيانات موردين لعرضها.
            </Alert>
          }
          {
            customerFailer === '' && !customerLoader && customers.length > 0 &&
            <DataViewer 
              specialStyle="mt-2"
              headData={[
                {
                  label: "المعرف",
                  value: "id",
                },
                {
                  label: "الاسم",
                  value: "firstName",
                },
                {
                  label: "اسم العائلة",
                  value: "lastName",
                },
                {
                  label: "البريد الالكتروني",
                  value: "email",
                },
                {
                  label: "رقم الهاتف",
                  value: "phone",
                },
                {
                  label: "العنوان",
                  value: "address",
                },
                {
                  label: "الحالة",
                  value: "isActive",
                  dataType: 'bool'
                },
                {
                  label: "تاريخ الاضافة",
                  value: "joinDate",
                  dataType: 'date',
                  dateFormat: 'full'
                },
              ]}
              bodyData={customers}
            />
          }
          {
            pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
            !customerFailer?
              <Row>
                <Col lg={12}>
                    <PaginationButtons
                      filter={filter}
                      pagination={pagination}
                      setFilter={setFilter}
                    />
                </Col>
              </Row>
              :
              ''
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Customers