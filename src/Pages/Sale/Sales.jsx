import { Col, Container, Row } from "react-bootstrap"
import PaginationFilterationSortingSearching from "../../Components/Common/PaginationFilterationSortingSearching"
import { useContext, useEffect, useState } from "react"
import { SaleImplementations } from "../../Code/SaleImplementations"
import { GlobalContext } from "../../Context/GlobalContext"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import DataViewer from "../../Components/Common/DataViewer"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import { CurrentDate } from "../../HelperTools/CurrentDate"

const Sales = () => {
  const {authInfo} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(false);
  const [failer, setFailer] = useState({});
  const [searchBy, setSearchBy] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [defaultSearchCol, setDefaultSearchCol] = useState({});
  const [defaultSortCol, setDefaultSortCol] = useState({});
  const [sales, setSales] = useState([]);
  const [saleLoader, setSaleLoader] = useState(false);
  const [saleFailer, setSaleFailer] = useState({});
  const [filter, setFilter] = useState({
    search: '',
    searchBy: defaultSearchCol.value || '',
    sortBy: defaultSortCol.value || '',
    sortDir: 'desc',
    page: 1,
    pageSize: 50,
    from: ``,
    to: ``,
  })
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: '',
    hasNextPage: ''
  })
  const [finishInitializeFilter, setFinishInitializeFilter] = useState(false);
  const implementations = SaleImplementations;

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

  const fillSales = ()=>{
    implementations.FillSaleTable({
      token: authInfo.Token,
      setFailer: setSaleFailer,
      setLoader: setSaleLoader,
      setSales: setSales,
      filter: filter,
      setPagination: setPagination
    });
  }

  const dataMapper = (salesData=[]) => {
    return salesData.map((sale) => ({
      id: sale.id,
      invoiceNumber: sale.invoiceNumber,
      productsCount: sale.productsCount,
      totalAmount: `${sale.totalAmount}`,
      discount: `${sale.discount}`,
      netAmount: `${sale.netAmount}`,
      paidAmount: `${sale.paidAmount}`,
      status: <div className={`p-2 pt-1 pb-1 text-white fw-bold rounded-4 ${sale.status == 'Paid' ? 'bg-success' : sale.status == 'NotCompleted' ? 'bg-warning' : 'bg-danger'}`}>{sale.status == 'Paid' ? 'مكتمل' : sale.status == 'NotCompleted' ? 'غير مكتمل' : 'غير مدفوع'}</div>,
      customerID: sale.customerID,
      customerName: sale.customerName,
      createdAt: sale.createdAt
    }))
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
            fillSales();
        }, 500);
        return () => clearTimeout(timer);
  }, [filter])

  useEffect(() => {
    if (!finishInitializeFilter) return;
    fillSales();
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
          <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهةالفواتر</h2>
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
        {/* Sales Table */}
        <Col lg={9}>
          {
            pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
            !saleFailer?
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
            saleLoader &&
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          }
          {
            Object.keys(saleFailer).length > 0 &&
            <div className="w-100">
              <Alert variant="danger">
                <h5>{saleFailer.title || 'فشل'}</h5>
                {
                  saleFailer.errors && Object.keys(saleFailer.errors).length > 0 &&
                  <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                    {
                      Object.keys(saleFailer.errors).map((key, index) => (
                        <li key={index} className="w-100">{saleFailer.errors[key]}</li>
                      ))
                    }
                  </ul>
                }
                <Button onClick={fillSales} variant="danger">اعادة المحاولة</Button>
              </Alert>
            </div>
          }
          {
            saleFailer === '' && !saleLoader && sales.length === 0 &&
            <Alert variant="warning" className="text-center">
              لا توجد منتجات لعرضها.
            </Alert>
          }
          {
            saleFailer === '' && !saleLoader && sales.length > 0 &&
            <DataViewer 
              specialStyle="mt-2"
              headData={[
                {
                  label: "المعرف",
                  value: "id"
                },
                {
                  label: "رقم الفاتورة",
                  value: "invoiceNumber"
                },
                {
                  label: "عدد المواد",
                  value: "productsCount", 
                },
                {
                  label: "اجمالي المبلغ",
                  value: "totalAmount"
                },
                {
                  label: "قيمة الحسم",
                  value: "discount"
                },
                {
                  label: "صافي القيمة",
                  value: "netAmount"
                },
                {
                  label: "المبلغ المدفوع",
                  value: "paidAmount"
                },
                {
                  label: "حالة الدفع",
                  value: "status"
                },
                {
                  label: "معرف العميل",
                  value: "customerID"
                },
                {
                  label: "اسم العميل",
                  value: "customerName"
                },
                {
                  label: "تاريخ الفاتورة",
                  value: "createdAt",
                  dataType: 'date',
                  dateFormat: 'full'
                },
              ]}
              bodyData={dataMapper(sales)}
              goToDetails={(e) => {
                const row = e.target.closest('tr');
                if (row) {
                  const id = row.id.split('-')[1];
                  window.open(`/sales/${sales[id].id}/details`, '_blank');
                }
              }}
            />
          }
          {
            pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
            !saleFailer?
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

export default Sales