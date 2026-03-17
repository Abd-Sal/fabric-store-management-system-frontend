import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { useParams} from "react-router-dom"
import { SupplierImplementations } from "../../Code/SupplierImplementations"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Col, Container, Pagination, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";
import DataViewer from "../../Components/Common/DataViewer";
import UpdateSupplierModal from "../../Components/Supplier/UpdateSupplierModal";

const SupplierDetails = () => {
  const {authInfo} = useContext(GlobalContext)
  const { supplierId } = useParams();
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [supplierLoader, setSupplierLoader] = useState(false);
  const [supplierFailer, setSupplierFailer] = useState({});

  const [supplierPurchases, setSupplierPurchases] = useState([]);
  const [supplierPurchasesLoader, setSupplierPurchasesLoader] = useState(false);
  const [supplierPurchasesFailer, setSupplierPurchasesFailer] = useState({});
  const [supplierPurchasesFilter, setSupplierPurchasesFilter] = useState({
      page: 1,
      pageSize: 10,
      from: '',
      to: '',
      search: '',
  })
  const [dateRange, setDateRange] = useState({
      from: '',
      to: ''
  });
  const [supplierPurchasespagination, setSupplierPurchasesPagination] = useState({
      pageNumber: 0,
      totalItems: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false
  });
  const [tempInvoiceNumber, setTempInvoiceNumber] = useState('')
  const [toggleLoader, setToggleLoader] = useState(false);
  const [toggleFailer, setToggleFailer] = useState(null);
  const [needRefresh, setNeedRefresh] = useState(false)

  const supplierImplemetations = SupplierImplementations;
  const getSupplierDetails = () => {
      supplierImplemetations.SupplierDetails({
          token: authInfo.Token,
          id: supplierId,
          setSupplierDetails: setSupplierDetails,
          setLoader: setSupplierLoader,
          setFailer: setSupplierFailer
      })
      setNeedRefresh(false)
  }

  const getSupplierPurchases = () => {
      supplierImplemetations.SupplierPurchases({
          id: supplierDetails.id,
          token: authInfo.Token,
          filter: supplierPurchasesFilter,
          setSupplierPurchase: setSupplierPurchases,
          setFailer: setSupplierPurchasesFailer,
          setLoader: setSupplierPurchasesLoader,
          setPagination: setSupplierPurchasesPagination,
      })
  }
  const supplierPurchasesMapper = () => {
      return supplierPurchases.map((item) => ({
          id: item.id,
          invoiceNumber: item.invoiceNumber,
          productsCount: item.productsCount,
          totalAmount: <div className="text-success fw-bold">{item.totalAmount}$</div>,
          paidAmount: <div className="text-success fw-bold">{item.paidAmount}$</div>,
          status: <div className={`d-flex justify-content-center align-items-center px-3 py-2 text-white rounded-4 ${item.status == 'Paid' ? 'bg-success' : item.status == 'NotPaid' ? 'bg-warning' : 'bg-danger'}`}>{item.status}</div>,
          createdAt: item.createdAt
      }))
  }

  const handleToggleSupplier = () => {
      if(supplierDetails.isActive){
          supplierImplemetations.DeactivateSupplier({
              id: supplierDetails.id,
              token: authInfo.Token,
              setFailer: setToggleFailer,
              setLoader: setToggleLoader,
              setNeedRefresh: setNeedRefresh
          })
      }else{
          supplierImplemetations.ActivateSupplier({
              id: supplierDetails.id,
              token: authInfo.Token,
              setFailer: setToggleFailer,
              setLoader: setToggleLoader,
              setNeedRefresh: setNeedRefresh
          })
      }
  }
  const handleNextPage = () => {
      if(supplierPurchasespagination.hasNextPage){
          supplierPurchasesFilter((prev) => {
              return {
                  ...prev,
                  page: prev.page + 1
              }
          })
      }
  }
  const handlePreviousPage = () => {
      if(supplierPurchasespagination.hasPreviousPage){
          supplierPurchasesFilter((prev) => {
              return {
                  ...prev,
                  page: prev.page - 1
              }
          })
      }
  }
  const handleChangePageSize = (e) => {
      const newSize = parseInt(e.target.value);
      setSupplierPurchasesFilter((prev) => {
          return {
              ...prev,
              pageSize: newSize,
              page: 1
          }
      })
  }
  const handleSupplierPurchasesSearch = (e) => {
      setTempInvoiceNumber(e.target.value)
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
          setSupplierPurchasesFilter({
              ...supplierPurchasesFilter,
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
          setSupplierPurchasesFilter({
              ...supplierPurchasesFilter,
              page:1,
              from: '',
              to: '',
          })
      }
  }

  useEffect(()=>{
      if(needRefresh)
          getSupplierDetails();
  }, [needRefresh])

  useEffect(()=>{
      if(dateRange.from && dateRange.to){
          setSupplierPurchasesFilter({
              ...supplierPurchasesFilter,
              page: 1,
              from: dateRange.from,
              to: dateRange.to,
          })            
      }
  }, [dateRange])

  useEffect(()=>{
      if(supplierId){
          getSupplierDetails();
      }
  }, [supplierId])

  useEffect(() => {
      if(!EmptyObjectChecker(supplierDetails)){
          getSupplierPurchases();
      }
  }, [supplierDetails])

  useEffect(() => {
      if(!EmptyObjectChecker(supplierDetails))
          getSupplierPurchases()
  }, [supplierPurchasesFilter])

  useEffect(() => {
      if(tempInvoiceNumber.trim().length >= 8){
          const timer = setTimeout(() => {
              setSupplierPurchasesFilter((prev) => {
                  return {
                      ...prev,
                      page: 1,
                      search: tempInvoiceNumber
                  }
              })
          }, 3000);
          return () => clearTimeout(timer);
      }
  }, [tempInvoiceNumber])

  return (
    <Container className="text-white">
      {/* Supplier Details */}
      <Row>
          <Col lg={12}>
          {
              supplierLoader &&
              <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                  <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                  </Spinner>
              </div>
          }
          </Col>
          <Col lg={12}>
          {
              supplierFailer != null &&
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
                  <Button onClick={getSupplierDetails} variant="danger">اعادة المحاولة</Button>
                  </Alert>
              </div>
          }
          </Col>
          <Col lg={12}>
          {
              !EmptyObjectChecker(supplierDetails) &&
              <div className="my-3 bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white p-3">
                  <div>
                      <h2>تفاصيل المورد</h2>
                  </div>
                  <div className="w-100 d-flex flex-wrap justify-content-start align-items-center gap-3">
                      <Button
                          variant={`${supplierDetails.isActive ? 'success' : 'danger'}`}
                          className="d-flex justify-content-center align-items-center rounded-4 px-5 py-3 text-white fw-bold border border-3 border-white"
                          onClick={handleToggleSupplier}
                          disabled={toggleLoader}
                      >
                          الحالة : {supplierDetails.isActive ? 'فعال' : 'محظور'}
                      </Button>
                      {
                          toggleFailer != null &&
                          Object.keys(toggleFailer).length > 0 &&
                          <div className="w-100">
                              <Alert variant="danger">
                              <h5>{toggleFailer.title || 'فشل'}</h5>
                              {
                                  toggleFailer.errors && Object.keys(toggleFailer.errors).length > 0 &&
                                  <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                                  {
                                      Object.keys(toggleFailer.errors).map((key, index) => (
                                      <li key={index} className="w-100">{toggleFailer.errors[key]}</li>
                                      ))
                                  }
                                  </ul>
                              }
                              <Button onClick={handleToggleSupplier} variant="danger">اعادة المحاولة</Button>
                              </Alert>
                          </div>
                      }
                      {
                          !EmptyObjectChecker(supplierDetails) &&
                          supplierDetails.isActive && 
                          <UpdateSupplierModal
                              token={authInfo.Token}
                              implementationsUpdateSupplier={supplierImplemetations.UpdateSupplier}
                              oldSupplier={supplierDetails}
                              setNeedRefresh={setNeedRefresh}
                              SpecialStyling={''}
                          />
                      }
                  </div>
                  <div className="py-2 supplier-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                      <strong>معرف المورد : </strong>
                      <strong>{supplierDetails.id}</strong>
                  </div>
                  <div className="py-2 supplier-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                      <strong>الاسم : </strong>
                      <strong>{supplierDetails.name}</strong>
                  </div>
                  {
                      supplierDetails.phone &&
                      <div className="py-2 supplier-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                          <strong>الهاتف : </strong>
                          <strong>{supplierDetails.phone || 'غير متوفر'}</strong>
                      </div>
                  }
                  {
                      supplierDetails.email &&
                      <div className="py-2 supplier-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                          <strong>البريد الالكتروني : </strong>
                          <strong>{supplierDetails.email || 'غير متوفر'}</strong>
                      </div>
                  }
                  {
                      supplierDetails.address &&
                      <div className="py-2 supplier-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                          <strong>العنوان : </strong>
                          <strong>{supplierDetails.address || 'غير متوفر'}</strong>
                      </div>
                  }
                  <div className="py-2 supplier-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                      <strong>تاريخ الانشاء : </strong>
                      <strong>{new Date(supplierDetails.joinDate + 'Z').toLocaleString() || 'غير متوفر'}</strong>
                  </div>
              </div>
          }
          </Col>
      </Row>

      {/* Supplier Purchases */}
      <Row>
          <Col lg={12} className="my-3" style={{minHeight: 300}}>
              <div className="px-2 py-2 h-100 bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white">
                  <div>
                      <h2>فواتير المورد</h2>
                  </div>
                  <div className="w-100">
                      <div className={'d-flex justify-content-start align-items-center gap-3 flex-wrap'}>
                          <div className="form-group d-flex justify-cotent-start align-items-center gap-1 w-auto">
                              <label htmlFor="pageSize">عدد العناصر في الصفحة</label>
                              <select
                                  name="pageSize"
                                  id="pageSize"
                                  className="form-select form-select-sm w-auto"
                                  value={supplierPurchasesFilter.pageSize}
                                  onChange={handleChangePageSize}
                              >
                                  <option value="5">5</option>
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  <option value="50">50</option>
                              </select>
                          </div>
                          <div className="form-group d-flex justify-cotent-start align-items-center gap-1">
                              <label htmlFor="search">بحث برقم الفاتورة</label>
                              <input
                                  type="text"
                                  name="search"
                                  id="search"
                                  className="form-control w-auto"
                                  value={tempInvoiceNumber}
                                  onInput={handleSupplierPurchasesSearch}
                                  placeholder="بحث حسب رقم الفاتورة..."
                              />
                          </div>
                          <div className="d-flex flex-wrap justify-content-start align-items-center gap-3 w-auto">
                              <div className="form-group d-flex justify-cotent-start align-items-center gap-1">
                                  <label>من</label>
                                  <input
                                      type="date"
                                      name="fromDate"
                                      id="fromDate"
                                      className="form-control"
                                      min={"2025-01-01"}
                                      onChange={handleFrom}
                                      value={supplierPurchasesFilter.from || dateRange.from}
                                  />
                              </div>
                              <div className="form-group d-flex justify-cotent-start align-items-center gap-1">
                                  <label>الى</label>
                                  <input
                                      type="date"
                                      name="toDate"
                                      id="toDate"
                                      className="form-control"
                                      min={"2025-01-01"}
                                      onChange={handleTo}
                                      value={supplierPurchasesFilter.to || dateRange.to}
                                  />
                              </div>
                          </div>
                      </div>
                      {
                          supplierPurchasesFailer != null &&
                          Object.keys(supplierPurchasesFailer).length > 0 &&
                          <div className="w-100 h-100">
                              <Alert variant="danger">
                              <h5>{supplierPurchasesFailer.title || 'فشل'}</h5>
                              {
                                  supplierPurchasesFailer.errors && Object.keys(supplierPurchasesFailer.errors).length > 0 &&
                                  <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                                  {
                                      Object.keys(supplierPurchasesFailer.errors).map((key, index) => (
                                      <li key={index} className="w-100">{supplierPurchasesFailer.errors[key]}</li>
                                      ))
                                  }
                                  </ul>
                              }
                              <Button onClick={getSupplierPurchases} variant="danger">اعادة المحاولة</Button>
                              </Alert>
                          </div>
                      }
                      {
                          supplierPurchasesLoader ?
                          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                              <Spinner animation="border" role="status">
                              <span className="visually-hidden">Loading...</span>
                              </Spinner>
                          </div> :
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
                                      label: "اجمالي القيمة",
                                      value: "totalAmount"
                                  },
                                  {
                                      label: "القيمة المدفوعة",
                                      value: "paidAmount"
                                  },
                                  {
                                      label: "الحالة",
                                      value: "status"
                                  },
                                  {
                                      label: "تاريخ الانشاء",
                                      value: "createdAt",
                                      dataType: 'date',
                                      dateFormat: 'full'
                                  }
                              ]}
                              bodyData={supplierPurchasesMapper()}
                              goToDetails={(e) => {
                                  const row = e.target.closest('tr')
                                  if(row){
                                      const id = row.id.split('-')[1];
                                      window.open(`/purchases/${supplierPurchases[id].id}/details`, '_blank');
                                  }
                              }}
                          />                            
                      }
                  </div>
                  <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                      <Button 
                            disabled={supplierPurchasesLoader || !supplierPurchasespagination.hasPreviousPage}
                            variant="dark"
                            className="px-sm-5"
                            onClick={handlePreviousPage}
                      >السابق</Button>
                      <div>
                          <strong>الصفحة: {supplierPurchasespagination.pageNumber}/{supplierPurchasespagination.totalPages}</strong>
                      </div>
                      <Button
                            disabled={supplierPurchasesLoader || !supplierPurchasespagination.hasNextPage}
                            variant="dark"
                            className="px-sm-5"
                            onClick={handleNextPage}
                      >التالي</Button>
                  </div>
              </div>
          </Col>
      </Row>
    </Container>
  )
}

export default SupplierDetails