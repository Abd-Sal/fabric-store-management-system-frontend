import { Col, Container, Row } from "react-bootstrap"
import PaginationFilterationSortingSearching from "../../Components/PaginationFilterationSortingSearching"
import { useContext, useEffect, useState } from "react"
import { PurchaseImplementations } from "../../Code/PurchaseImplementations"
import { GlobalContext } from "../../Context/GlobalContext"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import PaginationButtons from "../../Components/PaginationButtons"
import DataViewer from "../../Components/DataViewer"

const Purchases = () => {
  const {authInfo} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(false);
  const [failer, setFailer] = useState({});
  const [searchBy, setSearchBy] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [defaultSearchCol, setDefaultSearchCol] = useState({});
  const [defaultSortCol, setDefaultSortCol] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [purchaseLoader, setPurchaseLoader] = useState(false);
  const [purchaseFailer, setPurchaseFailer] = useState({});
  const [filter, setFilter] = useState({
    search: '',
    searchBy: defaultSearchCol.value || '',
    sortBy: defaultSortCol.value || '',
    sortDir: 'desc',
    page: 1,
    pageSize: 50,
    from: '',
    to: '',
  })
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: '',
    hasNextPage: ''
  })
  const [finishInitializeFilter, setFinishInitializeFilter] = useState(false);
  const implementations = PurchaseImplementations;

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

  const fillPurchases = ()=>{
    implementations.FillPurchaseTable({
      token: authInfo.Token,
      setFailer: setPurchaseFailer,
      setLoader: setPurchaseLoader,
      setPurchases: setPurchases,
      filter: filter,
      setPagination: setPagination
    });
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
            fillPurchases();
        }, 500);
        return () => clearTimeout(timer);
  }, [filter])

  useEffect(() => {
    if (!finishInitializeFilter) return;
    fillPurchases();
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
    <Container fluid className="text-white">
      <Row>
        <Col lg={12}>
          <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهةالمنتجات</h2>
        </Col>
      </Row>
      <Row>
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
        {/* Purchases Table */}
        <Col lg={9}>
          {
            pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
            !purchaseFailer?
              <Row>
                <Col lg={12}>
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
          {
            purchaseLoader &&
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          }
          {
            Object.keys(purchaseFailer).length > 0 &&
            <div className="w-100">
              <Alert variant="danger">
                <h5>{purchaseFailer.title || 'فشل'}</h5>
                {
                  purchaseFailer.errors && Object.keys(purchaseFailer.errors).length > 0 &&
                  <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                    {
                      Object.keys(purchaseFailer.errors).map((key, index) => (
                        <li key={index} className="w-100">{purchaseFailer.errors[key]}</li>
                      ))
                    }
                  </ul>
                }
                <Button onClick={fillPurchases} variant="danger">اعادة المحاولة</Button>
              </Alert>
            </div>
          }
          {
            purchaseFailer === '' && !purchaseLoader && purchases.length === 0 &&
            <Alert variant="warning" className="text-center">
              لا توجد منتجات لعرضها.
            </Alert>
          }
          {
            purchaseFailer === '' && !purchaseLoader && purchases.length > 0 &&
            <DataViewer 
              specialStyle="mt-2"
              headData={[
                {
                  label: "المعرف",
                  value: "id"
                },
                {
                  label: "كود كامل",
                  value: "purchaseCode"
                },
                {
                  label: "اسم المادة",
                  value: "name", 
                },
                {
                  label: "كود المادة",
                  value: "code"
                },
                {
                  label: "لون المادة",
                  value: "color"
                },
                {
                  label: "وحدة القياس",
                  value: "unit"
                },
                {
                  label: "مادة المنتج",
                  value: "material"
                },
                {
                  label: "تاريخ الاضافة",
                  value: "createdAt",
                  dateType: 'date',
                  dateFormat: 'full'
                }
              ]}
              bodyData={purchases}
            />
          }
          {
            pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
            !purchaseFailer?
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

export default Purchases