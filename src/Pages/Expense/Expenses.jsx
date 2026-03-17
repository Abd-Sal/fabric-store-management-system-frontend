import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import CreateExpenseModal from "../../Components/Expense/CreateExpenseModal"
import PaginationFilterationSortingSearching from "../../Components/Common/PaginationFilterationSortingSearching"
import { ExpenseImplementations } from "../../Code/ExpenseImplementations"
import { GlobalContext } from "../../Context/GlobalContext"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import DataViewer from "../../Components/Common/DataViewer"
import CustomOffCanves from '../../Components/Common/CustomOffCanves';

const Expenses = () => {
  const {authInfo} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(false);
  const [failer, setFailer] = useState({});
  const [searchBy, setSearchBy] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [defaultSearchCol, setDefaultSearchCol] = useState({});
  const [defaultSortCol, setDefaultSortCol] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [expenseLoader, setExpenseLoader] = useState(false);
  const [expenseFailer, setExpenseFailer] = useState({});
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

  const [addedExpense, setAddedExpense] = useState(false);
  const implementations = ExpenseImplementations;

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

  const fillExpenses = ()=>{
    implementations.FillExpenseTable({
      token: authInfo.Token,
      setFailer: setExpenseFailer,
      setLoader: setExpenseLoader,
      setExpenses: setExpenses,
      filter: filter,
      setPagination: setPagination
    });
  }

  const dataMapper = () => {
    return expenses.map((item) => ({
      id: item.id,
      message: item.message,
      dollarPriceInSyr: <div className='fw-bold text-success fst-italic'>{item.dollarPriceInSyr} SYR</div>,
      syrianAmount: <div className='fw-bold text-success fst-italic'>{item.syrianAmount} SYR</div>,
      dollarAmount: <div className='fw-bold text-success fst-italic'>{item.dollarAmount} $</div>,
      createdAt: item.createdAt
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
            fillExpenses();
        }, 500);
        return () => clearTimeout(timer);
  }, [filter])

  useEffect(() => {
    if (!finishInitializeFilter) return;
    fillExpenses();
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
    if(!addedExpense) return;
    fillExpenses();
    setAddedExpense(false);
  }, [addedExpense])

  return (
    <>
      <Container fluid className="text-white">
        <Row>
          <Col lg={12}>
            <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهة مصروفات المحل</h2>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {
              pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
              !expenseFailer?
                <Row>
                  <Col lg={3}>
                    <CreateExpenseModal 
                      token={authInfo.Token}
                      implementationsCreateExpense={implementations.CreateExpense}
                      addedExpense={addedExpense}
                      setAddedExpense={setAddedExpense}
                      SpecialStyling="w-100 p-3"
                    />
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
          <Col xs={12} className='d-block d-lg-none'>
            <CustomOffCanves 
              title={'واجهة الفلاتر'}
              shotBtnText={'الفلاتر'}
              showBtnStyle='my-2 border-1 border-white btn-secondary px-5 cursor-pointer'
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
          {/* Expenses Table */}
          <Col lg={9}>
            {
              expenseLoader &&
              <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            }
            {
              Object.keys(expenseFailer).length > 0 &&
              <div className="w-100">
                <Alert variant="danger">
                  <h5>{expenseFailer.title || 'فشل'}</h5>
                  {
                    expenseFailer.errors && Object.keys(expenseFailer.errors).length > 0 &&
                    <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                      {
                        Object.keys(expenseFailer.errors).map((key, index) => (
                          <li key={index} className="w-100">{expenseFailer.errors[key]}</li>
                        ))
                      }
                    </ul>
                  }
                  <Button onClick={fillExpenses} variant="danger">اعادة المحاولة</Button>
                </Alert>
              </div>
            }
            {
              expenseFailer === '' && !expenseLoader && expenses.length === 0 &&
              <Alert variant="warning" className="text-center">
                لا توجد منتجات لعرضها.
              </Alert>
            }
            {
              expenseFailer === '' && !expenseLoader && expenses.length > 0 &&
              <DataViewer 
                specialStyle="mt-2"
                headData={[
                  {
                    label: "المعرف",
                    value: "id"
                  },
                  {
                    label: "الوصف",
                    value: "message"
                  },
                  {
                    label: "سعر الدولار",
                    value: "dollarPriceInSyr", 
                  },
                  {
                    label: "القيمة المدفوعة بالليرة السورية",
                    value: "syrianAmount"
                  },
                  {
                    label: "القيمة المدفوعة بالدولار",
                    value: "dollarAmount"
                  },
                  {
                    label: "تاريخ الدفع",
                    value: "createdAt",
                    dataType: 'date',
                    dateFormat: 'full'
                  }
                ]}
                bodyData={dataMapper()}
                goToDetails={(e) => {
                  const row = e.target.closest('tr');
                  if (row) {
                    const id = row.id.split('-')[1];
                    window.open(`/expenses/${expenses[id].id}/details`, '_blank');
                  }
                }}
              />
            }
            {
              pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
              !expenseFailer?
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

export default Expenses