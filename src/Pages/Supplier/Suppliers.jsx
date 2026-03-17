import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { GlobalContext } from "../../Context/GlobalContext"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import DataViewer from "../../Components/Common/DataViewer"
import { SupplierImplementations } from "../../Code/SupplierImplementations"
import PaginationFilterationSortingSearching from "../../Components/Common/PaginationFilterationSortingSearching"
import CreateSupplierModal from "../../Components/Supplier/CreateSupplierModal"
import CustomOffCanves from '../../Components/Common/CustomOffCanves';

const Suppliers = () => {
  const {authInfo} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(false);
  const [failer, setFailer] = useState({});
  const [searchBy, setSearchBy] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [defaultSearchCol, setDefaultSearchCol] = useState({});
  const [defaultSortCol, setDefaultSortCol] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [supplierLoader, setSupplierLoader] = useState(false);
  const [supplierFailer, setSupplierFailer] = useState({});
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
  const [addedSupplier, setAddedSupplier] = useState(false);
  const implementations = SupplierImplementations;

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

  const fillSuppliers = ()=>{
    implementations.FillSupplierTable({
      token: authInfo.Token,
      setFailer: setSupplierFailer,
      setLoader: setSupplierLoader,
      setSuppliers: setSuppliers,
      filter: filter,
      setPagination: setPagination,
      includeOnlyActive: includeOnlyActive
    });
  }

  const handleChangeIncludedSuppliers = (e) =>
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
            fillSuppliers();
        }, 500);
        return () => clearTimeout(timer);
  }, [filter, includeOnlyActive])

  useEffect(() => {
    if (!finishInitializeFilter) return;
    fillSuppliers();
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
    if(!addedSupplier) return;
    fillSuppliers();
    setAddedSupplier(false);
  }, [addedSupplier])
  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <h2 className="text-white d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهة الموردين</h2>
        </Col>
      </Row>
      <Row className="text-white">
        <Col lg={12}>
          {
            pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
            !supplierFailer?
              <Row>
                <Col lg={3}>
                  <CreateSupplierModal 
                    token={authInfo.Token}
                    implementationsCreateSupplier={implementations.CreateSupplier}
                    addedSupplier={addedSupplier}
                    setAddedSupplier={setAddedSupplier}
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
                      className={`my-lg-0 my-2 md-flex justify-content-center align-items-center p-2 w-100 btn btn-danger ${includeOnlyActive && 'opacity-50 border border-primary'}`}  
                    >{
                      includeOnlyActive ?
                      'تضمين الموردين المحظرين'
                      :
                      'الغاء تضمين الموردين المحظورين'
                    }</label>
                    <input
                      hidden
                      id="includeOnlyActive"
                      type="checkbox"
                      name="includeOnlyActive"
                      value={includeOnlyActive}
                      checked={includeOnlyActive}
                      onChange={handleChangeIncludedSuppliers}
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
        <Col lg={3} className='d-none d-lg-block'>
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
        <Col
          xs={12}
          className='d-block d-lg-none'
        >
          <CustomOffCanves 
            title={'واجهة الفلاتر'}
            shotBtnText={'الفلاتر'}
            showBtnStyle=' mt-2 border-1 border-white btn-secondary px-5 cursor-pointer'
          >
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
          </CustomOffCanves>
        </Col>
        {/* Suppliers Table */}
        <Col lg={9}>
          {
            supplierLoader &&
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          }
          {
            Object.keys(supplierFailer).length > 0 &&
            <div className="w-100">
              <Alert variant="danger">
                <h5>{supplierFailer.title || 'فشل'}</h5>
                {
                  supplierFailer.errors && Object.keys(supplierFailer.errors).length > 0 &&
                  <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                    {
                      Object.keys(supplierFailer.errors).map((key, index) => (
                        <li key={index} className="w-100">{supplierFailer.errors[key]}</li>
                      ))
                    }
                  </ul>
                }
                <Button onClick={fillSuppliers} variant="danger">اعادة المحاولة</Button>
              </Alert>
            </div>
          }
          {
            supplierFailer === '' && !supplierLoader && suppliers.length === 0 &&
            <Alert variant="warning" className="text-center">
              لا يوجد بيانات موردين لعرضها.
            </Alert>
          }
          {
            supplierFailer === '' && !supplierLoader && suppliers.length > 0 &&
            <DataViewer 
              specialStyle="mt-2"
              headData={[
                {
                  label: "المعرف",
                  value: "id",
                },
                {
                  label: "الاسم",
                  value: "name",
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
              bodyData={suppliers}
              goToDetails={(e) => {
                const row = e.target.closest('tr')
                if(row){
                  const id = row.id.split('-')[1];
                  window.open(`/suppliers/${suppliers[id].id}/details`, '_blank')
                }
              }}
            />
          }
          {
            pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
            !supplierFailer?
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

export default Suppliers