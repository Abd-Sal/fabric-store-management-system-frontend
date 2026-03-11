
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import { PaymentImplementations } from "../../Code/PaymentImplementations"
import { GlobalContext } from "../../Context/GlobalContext"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import DataViewer from "../../Components/Common/DataViewer"

const Payments = () => {
  const {authInfo} = useContext(GlobalContext)
  const [payments, setPayments] = useState([]);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [paymentFailer, setPaymentFailer] = useState({});
  const [filter, setFilter] = useState({
    search: '',
    page: 1,
    pageSize: 50,
    from: '',
    to: '',
  })
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: false,
    hasNextPage: false
  })
  const [dateRange, setDateRange] = useState({
      from: '',
      to: ''
  });
  const implementations = PaymentImplementations;

  const fillPayments = ()=>{
    implementations.FillPaymentTable({
      token: authInfo.Token,
      setFailer: setPaymentFailer,
      setLoader: setPaymentLoader,
      setPayments: setPayments,
      filter: filter,
      setPagination: setPagination
    });
  }

  const dataMapper = () => {
    return payments.map((item) => ({
      id: item.id,
      referenceID: item.referenceID,
      referenceTypes: <div className={`fw-bold ${item.referenceTypes == 'Sale' ? 'text-success' : item.referenceTypes == 'Purchase' || item.referenceTypes == 'Expense' ? 'text-danger' : 'text-warning'}`}>{item.referenceTypes == 'Sale' ? 'بيع' : item.referenceTypes == 'Purchase' ? 'شراء' : item.referenceTypes == 'Sample' ? 'شراء كاتالوغ' : 'مصروف' }</div>,
      amount: <div className='fw-bold text-success fst-italic'>{item.amount} {item.referenceTypes == 'Expense' ? 'SYR' : "$"}</div>,
      paidAt: item.paidAt
    }))
  }

  const handleFrom = (e) => {
    if(e.currentTarget.value){
        let from = new Date(e.currentTarget.value).toISOString().split('T')[0]
        setDateRange({
            ...dateRange,
            from: from
        })
    }else{
        setDateRange({
            ...dateRange,
            from: '',
            to: '',
        })
        setFilter({
            ...filter,
            page:1,
            from: '',
            to: '',
        })
    }
  }

  const handleTo = (e) => {
    if(e.currentTarget.value){
        let to = new Date(e.currentTarget.value).toISOString().split('T')[0]
        setDateRange({
            ...dateRange,
            to: to
        });
    }else{
        setDateRange({
            ...dateRange,
            from: '',
            to: '',
        })
        setFilter({
            ...filter,
            page:1,
            from: '',
            to: '',
        })
    }
  }

  const handlePagSize = (e) => {
    setFilter({
        ...filter,
        page: 1,
        pageSize: e.currentTarget.value
    })
  }

  const handleSearch = (e) => {
    setFilter({
        ...filter,
        page: 1,
        search: e.currentTarget.value
    })
  }

  useEffect(()=>{
      if(dateRange.from && dateRange.to){
          setFilter({
              ...filter,
              page: 1,
              from: dateRange.from,
              to: dateRange.to,
          })            
      }
  }, [dateRange])

  useEffect(() => {
        const timer = setTimeout(() => {
          fillPayments();
        }, 500);
        return () => clearTimeout(timer);
  }, [filter])

  useEffect(()=>{
    fillPayments();
  }, [])

  return (
    <>
      <Container fluid className="text-white">
        <Row>
          <Col lg={12}>
            <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهة العمليات المالية</h2>
          </Col>
        </Row>
        <Row>
          {/* Filteration */}
          <Col lg={3}>
            <div>
              {/* Search Field */}
              <div className="form-group">
                  <label htmlFor="search">البحث حسب معرف العملية فقط</label>
                  <input
                      type="text"
                      name="search"
                      id="search"
                      className="form-control"
                      placeholder="بحث"
                      onChange={handleSearch}
                      value={filter.search}
                  />
              </div>

              {/* Page Size Select */}
              <div className="form-group">
                  <label htmlFor="pageSize">عدد العناصر في الصفحة</label>
                  <select
                      name="pageSize"
                      id="pageSize"
                      className="form-select"
                      onChange={handlePagSize}
                      value={filter.pageSize}
                  >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                  </select>
              </div>

              {/* Date Range From */}
              <div className="form-group">
                  <label>من</label>
                  <input
                      type="date"
                      name="fromDate"
                      id="fromDate"
                      className="form-control"
                      min={"2025-01-01"}
                      onChange={handleFrom}
                      value={filter.from || dateRange.from}
                  />
              </div>

              {/* Date Range To */}
              <div className="form-group">
                  <label>الى</label>
                  <input
                      type="date"
                      name="toDate"
                      id="toDate"
                      className="form-control"
                      min={"2025-01-01"}
                      onChange={handleTo}
                      value={filter.to || dateRange.to}
                  />
              </div>
            </div>
          </Col>
          <Col lg={9}>
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
              {/* Payments Table */}
              <Col lg={12}>
                {
                  paymentLoader &&
                  <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
                {
                  Object.keys(paymentFailer).length > 0 &&
                  <div className="w-100">
                    <Alert variant="danger">
                      <h5>{paymentFailer.title || 'فشل'}</h5>
                      {
                        paymentFailer.errors && Object.keys(paymentFailer.errors).length > 0 &&
                        <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                          {
                            Object.keys(paymentFailer.errors).map((key, index) => (
                              <li key={index} className="w-100">{paymentFailer.errors[key]}</li>
                            ))
                          }
                        </ul>
                      }
                      <Button onClick={fillPayments} variant="danger">اعادة المحاولة</Button>
                    </Alert>
                  </div>
                }
                {
                  paymentFailer === '' && !paymentLoader && payments.length === 0 &&
                  <Alert variant="warning" className="text-center">
                    لا توجد منتجات لعرضها.
                  </Alert>
                }
                {
                  paymentFailer === '' && !paymentLoader && payments.length > 0 &&
                  <DataViewer 
                    specialStyle="mt-2"
                    headData={[
                      {
                        label: "المعرف",
                        value: "id"
                      },
                      {
                        label: "معرف العملية",
                        value: "referenceID"
                      },
                      {
                        label: "نوع العملية",
                        value: "referenceTypes", 
                      },
                      {
                        label: "القيمة",
                        value: "amount"
                      },
                      {
                        label: "تاريخ الانشاء",
                        value: "paidAt",
                        dataType: 'date',
                        dateFormat: 'full'
                      }
                    ]}
                    bodyData={dataMapper()}
                    goToDetails={(e) => {
                      const row = e.target.closest('tr');
                      if (row) {
                        const id = row.id.split('-')[1];
                        window.open(`/${payments[id].referenceTypes == 'Sale' ? 'sales' : payments[id].referenceTypes == 'Purchase' ? 'purchases' : payments[id].referenceTypes == 'Sample' ? 'catalogs' : 'expenses'}/${payments[id].referenceID}/details`, '_blank');
                      }
                    }}
                  />
                }
                {
                  pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
                  !paymentFailer?
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
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Payments