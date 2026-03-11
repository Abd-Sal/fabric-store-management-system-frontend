import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import PaginationFilterationSortingSearching from "../../Components/Common/PaginationFilterationSortingSearching"
import { GlobalContext } from "../../Context/GlobalContext"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import DataViewer from "../../Components/Common/DataViewer"
import { CatalogImplementations } from '../../Code/CatalogImplementations';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { OurRoutes } from '../../Routes/OurRoutes'

const AssignedCatalogs = () => {
  const {authInfo} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(false);
  const [failer, setFailer] = useState({});
  const [searchBy, setSearchBy] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [defaultSearchCol, setDefaultSearchCol] = useState({});
  const [defaultSortCol, setDefaultSortCol] = useState({});
  const [catalogs, setCatalogs] = useState([]);
  const [catalogLoader, setCatalogLoader] = useState(false);
  const [catalogFailer, setCatalogFailer] = useState({});
  const [filter, setFilter] = useState({
    search: '',
    searchBy: defaultSearchCol.value || '',
    sortBy: defaultSortCol.value || '',
    sortDir: 'desc',
    page: 1,
    pageSize: 50,
    from: '',
    to: '',
    includeReturned: false,
  })
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: '',
    hasNextPage: ''
  })
  const [finishInitializeFilter, setFinishInitializeFilter] = useState(false);
  const navigate = useNavigate();

  const catalogMapper = () => {
    return catalogs.map(item => ({
        id: item.id,
        customerID: item.customerID,
        customerName: item.customerName,
        catalogID: item.catalogID,
        catalogCode: item.catalogCode,
        assignedAt: item.assignedAt,
        returnedAt: Object.hasOwn(item, 'returnedAt') ? item.returnedAt : '---'
    }))
  }

  const implementations = CatalogImplementations;

  const fillEndpointDetails = ()=>{  
    implementations.AssingedCatalogsFillSearchAndSort({
      token: authInfo.Token,
      setLoader: setIsLoading,
      setFailer: setFailer,
      setSearchBy: setSearchBy,
      setSortBy: setSortBy,
      setDefaultSearchCol: setDefaultSearchCol,
      setDefaultSortCol: setDefaultSortCol
    });
  }

  const fillCatalogs = ()=>{
    implementations.FillAssignedCatalogsTable({
      token: authInfo.Token,
      setFailer: setCatalogFailer,
      setLoader: setCatalogLoader,
      setAssingedCatalogs: setCatalogs,
      filter: filter,
      setPagination: setPagination
    });
  }

  const handleCreateAssingCatalog = () => {
    navigate(`${OurRoutes.Catalogs.AssignCatalogs}`)
  }

  const handleIncludeReturned = () => {
    setFilter({
        ...filter,
        page: 1,
        includeReturned: !filter.includeReturned
    })
  }

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
            fillCatalogs();
        }, 500);
        return () => clearTimeout(timer);
  }, [filter])

  useEffect(() => {
    if (!finishInitializeFilter) return;
    fillCatalogs();
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

  return (
    <>
      <Container fluid className="text-white">
        <Row>
          <Col lg={12}>
            <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهة الكاتالوغات المحجوزة</h2>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {
              pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
              !catalogFailer?
                <Row>
                  <Col lg={3}>
                    <Button
                      title="اضافة كاتالوغ"
                      variant="primary"
                      className={`w-100  pt-3 pb-3 btn btn-success d-flex justify-content-center align-items-center ps-5 pe-5`}
                      onClick={handleCreateAssingCatalog}
                    ><IoIosAddCircleOutline fontSize={25}/></Button>
                  </Col>
                  <Col lg={9}>
                      <PaginationButtons
                        filter={filter}
                        pagination={pagination}
                        setFilter={setFilter}
                      />
                    <div className="p-2 mt-2 rounded border bg-primary w-100 d-flex flex-wrap justify-content-start align-items-center gap-3">
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
            <form action="">
                <div className="form-group">
                <label 
                    htmlFor="includeReturned"
                    className={`d-flex justify-content-center align-items-center p-2 w-100 btn btn-danger ${!filter.includeReturned && 'opacity-50 border border-primary'}`}  
                >{
                    filter.includeReturned ?
                    'الغاء تضمين الكاتاوغات المسترجعة'
                    :
                    'تضمين الكاتاوغات المسترجعة '
                }</label>
                <input
                    hidden
                    id="includeReturned"
                    type="checkbox"
                    name="includeReturned"
                    value={filter.includeReturned}
                    checked={filter.includeReturned}
                    onChange={handleIncludeReturned}
                />
                </div>
            </form>
          </Col>
          <Col lg={9}></Col>
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
              <>
                <PaginationFilterationSortingSearching 
                    searchBy={searchBy}
                    sortBy={sortBy}
                    defaultSearchCol={defaultSearchCol}
                    defaultSortCol={defaultSortCol}
                    filter={filter}
                    setFilter={setFilter}
                />
              </>
            }
          </Col>
          {/* Catalogs Table */}
          <Col lg={9}>
            {
              catalogLoader &&
              <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            }
            {
              Object.keys(catalogFailer).length > 0 &&
              <div className="w-100">
                <Alert variant="danger">
                  <h5>{catalogFailer.title || 'فشل'}</h5>
                  {
                    catalogFailer.errors && Object.keys(catalogFailer.errors).length > 0 &&
                    <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                      {
                        Object.keys(catalogFailer.errors).map((key, index) => (
                          <li key={index} className="w-100">{catalogFailer.errors[key]}</li>
                        ))
                      }
                    </ul>
                  }
                  <Button onClick={fillCatalogs} variant="danger">اعادة المحاولة</Button>
                </Alert>
              </div>
            }
            {
              catalogFailer === '' && !catalogLoader && catalogs.length === 0 &&
              <Alert variant="warning" className="text-center">
                لا توجد منتجات لعرضها.
              </Alert>
            }
            {
              catalogFailer === '' && !catalogLoader && catalogs.length > 0 &&
              <DataViewer 
                specialStyle="mt-2"
                headData={[
                  {
                    label: "المعرف الاعارة",
                    value: "id"
                  },
                  {
                    label: "معرف العميل",
                    value: "customerID"
                  },
                  {
                    label: "اسم العميل",
                    value: "customerName", 
                  },
                  {
                    label: "معرف الكاتالوغ",
                    value: "catalogID"
                  },
                  {
                    label: "كود الكاتالوغ",
                    value: "catalogCode"
                  },
                  {
                    label: "تاريخ الاعارة",
                    value: "assignedAt",
                    dataType: 'date',
                    dateFormat: 'full'
                  },
                  {
                    label: "تاريخ الارجاع",
                    value: "returnedAt",
                    dataType: 'date',
                    dateFormat: 'full'
                  },
                ]}
                bodyData={catalogMapper()}
                goToDetails={(e) => {
                  const row = e.target.closest('tr')
                  if (row) {
                    const id = row.id.split('-')[1];
                    window.open(`/catalogs/${catalogs[id].catalogID}/details`, '_blank');
                  }
                }}
              />
            }
            {
              pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
              !catalogFailer?
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
    </>    
  )
}

export default AssignedCatalogs