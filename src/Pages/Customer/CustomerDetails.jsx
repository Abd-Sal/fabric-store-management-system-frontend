import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { useParams} from "react-router-dom"
import { CustomerImplementations } from "../../Code/CustomerImplementations"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Col, Container, Pagination, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";
import DataViewer from "../../Components/Common/DataViewer";
import UpdateCustomerModal from "../../Components/Customer/UpdateCustomerModal";

const CustomerDetails = () => {
    const {authInfo} = useContext(GlobalContext)
    const { customerId } = useParams();
    const [customerDetails, setCustomerDetails] = useState(null);
    const [customerLoader, setCustomerLoader] = useState(false);
    const [customerFailer, setCustomerFailer] = useState({});

    const [customerCatalogs, setCustomerCatalogs] = useState([]);
    const [customerCatalogsLoader, setCustomerCatalogsLoader] = useState(false);
    const [customerCatalogsFailer, setCustomerCatalogsFailer] = useState({});
    const [custoemrCatalogsFilter, setCustoemrCatalogsFilter] = useState({
        page: 1,
        pageSize: 10,
        from: '',
        to: '',
        search: '',
        includeReturned: false
    })
    const [catalogsDateRange, setCatalogsDateRange] = useState({
        from: '',
        to: ''
    });
    const [customerCatalogspagination, setCustomerCatalogsPagination] = useState({
        pageNumber: 0,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
    });

    const [customerSales, setCustomerSales] = useState([]);
    const [customerSalesLoader, setCustomerSalesLoader] = useState(false);
    const [customerSalesFailer, setCustomerSalesFailer] = useState({});
    const [custoemrSalesFilter, setCustoemrSalesFilter] = useState({
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
    const [customerSalespagination, setCustomerSalesPagination] = useState({
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

    const customerImplemetations = CustomerImplementations;
    const getCustomerDetails = () => {
        customerImplemetations.CustomerDetails({
            token: authInfo.Token,
            id: customerId,
            setCustomerDetails: setCustomerDetails,
            setLoader: setCustomerLoader,
            setFailer: setCustomerFailer
        })
        setNeedRefresh(false)
    }

    const getCustomerCatalogs = () => {
        customerImplemetations.CustomerCatalogs({
            id: customerDetails.id,
            token: authInfo.Token,
            setCustomerCatalogs: setCustomerCatalogs,
            filter: custoemrCatalogsFilter,
            setFailer: setCustomerCatalogsFailer,
            setLoader: setCustomerCatalogsLoader,
            setPagination: setCustomerCatalogsPagination
        }) 
    }

    const getCustomerSales = () => {
        customerImplemetations.CustomerSales({
            id: customerDetails.id,
            token: authInfo.Token,
            filter: custoemrSalesFilter,
            setFailer: setCustomerSalesFailer,
            setLoader: setCustomerSalesLoader,
            setCustomerSales: setCustomerSales,
            setPagination: setCustomerSalesPagination
        })
    }
    const customerSalesMapper = () => {
        return customerSales.map((item) => ({
            id: item.id,
            invoiceNumber: item.invoiceNumber,
            productsCount: item.productsCount,
            totalAmount: <div className="text-success fw-bold">{item.totalAmount}$</div>,
            discount: <div className="text-success fw-bold">{item.discount}$</div>,
            netAmount: <div className="text-success fw-bold">{item.netAmount}$</div>,
            paidAmount: <div className="text-success fw-bold">{item.paidAmount}$</div>,
            status: <div className={`d-flex justify-content-center align-items-center px-3 py-2 text-white rounded-4 ${item.status == 'Paid' ? 'bg-success' : item.status == 'NotPaid' ? 'bg-warning' : 'bg-danger'}`}>{item.status}</div>,
            createdAt: item.createdAt
        }))
    }

    const handleToggleCustomer = () => {
        if(customerDetails.isActive){
            customerImplemetations.DeactivateCustomer({
                id: customerDetails.id,
                token: authInfo.Token,
                setFailer: setToggleFailer,
                setLoader: setToggleLoader,
                setNeedRefresh: setNeedRefresh
            })
        }else{
            customerImplemetations.ActivateCustomer({
                id: customerDetails.id,
                token: authInfo.Token,
                setFailer: setToggleFailer,
                setLoader: setToggleLoader,
                setNeedRefresh: setNeedRefresh
            })
        }
    }
    const handleNextPage = () => {
        if(customerSalespagination.hasNextPage){
            custoemrSalesFilter((prev) => {
                return {
                    ...prev,
                    page: prev.page + 1
                }
            })
        }
    }
    const handlePreviousPage = () => {
        if(customerSalespagination.hasPreviousPage){
            custoemrSalesFilter((prev) => {
                return {
                    ...prev,
                    page: prev.page - 1
                }
            })
        }
    }
    const handleChangePageSize = (e) => {
        const newSize = parseInt(e.target.value);
        setCustoemrSalesFilter((prev) => {
            return {
                ...prev,
                pageSize: newSize,
                page: 1
            }
        })
    }
    const handleCustomerSalesSearch = (e) => {
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
            setCustoemrSalesFilter({
                ...custoemrSalesFilter,
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
            setCustoemrSalesFilter({
                ...custoemrSalesFilter,
                page:1,
                from: '',
                to: '',
            })
        }
    }
    const handleChangePageSizeCatalogs = (e) => {
        const newSize = parseInt(e.target.value);
        setCustoemrCatalogsFilter((prev) => {
            return {
                ...prev,
                pageSize: newSize,
                page: 1
            }
        })
    }
    const handleCustomerCatalogsSearch = (e) => {
        setCustoemrCatalogsFilter({
            ...custoemrCatalogsFilter,
            search: e.target.value,
            page:1
        })
    }

    const handleNextPageCatalogs = () => {
        if(customerCatalogspagination.hasNextPage){
            custoemrCatalogsFilter((prev) => {
                return {
                    ...prev,
                    page: prev.page + 1
                }
            })
        }
    }
    const handlePreviousPageCatalogs = () => {
        if(customerCatalogspagination.hasPreviousPage){
            custoemrCatalogsFilter((prev) => {
                return {
                    ...prev,
                    page: prev.page - 1
                }
            })
        }
    }
    const handleFromCatalogs = (e) => {
        if(e.currentTarget.value){
            let from = new Date(e.currentTarget.value).toISOString().split('T')[0]
            setCatalogsDateRange({
                ...catalogsDateRange,
                from: from
            })
        }else{
            setCatalogsDateRange({
                ...catalogsDateRange,
                from: '',
                to: '',
            })
            setCustoemrCatalogsFilter({
                ...custoemrCatalogsFilter,
                page:1,
                from: '',
                to: '',
            })
        }
    }
    const handleToCatalogs = (e) => {
        if(e.currentTarget.value){
            let to = new Date(e.currentTarget.value).toISOString().split('T')[0]
            setCatalogsDateRange({
                ...catalogsDateRange,
                to: to
            });
        }else{
            setCatalogsDateRange({
                ...catalogsDateRange,
                from: '',
                to: '',
            })
            setCustoemrCatalogsFilter({
                ...custoemrCatalogsFilter,
                page:1,
                from: '',
                to: '',
            })
        }
    }
    const handleIncludingReturned = (e) => {
        setCustoemrCatalogsFilter({
            ...custoemrSalesFilter,
            includeReturned: !custoemrCatalogsFilter.includeReturned
        })
    }

    useEffect(()=>{
        if(needRefresh)
            getCustomerDetails();
    }, [needRefresh])

    useEffect(()=>{
        if(dateRange.from && dateRange.to){
            setCustoemrSalesFilter({
                ...custoemrSalesFilter,
                page: 1,
                from: dateRange.from,
                to: dateRange.to,
            })            
        }
    }, [dateRange])

    useEffect(()=>{
        if(catalogsDateRange.from && catalogsDateRange.to){
            setCustoemrCatalogsFilter({
                ...custoemrCatalogsFilter,
                page: 1,
                from: catalogsDateRange.from,
                to: catalogsDateRange.to,
            })            
        }
    }, [catalogsDateRange])

    useEffect(()=>{
        if(customerId){
            getCustomerDetails();
        }
    }, [customerId])

    useEffect(() => {
        if(!EmptyObjectChecker(customerDetails)){
            getCustomerSales();
            getCustomerCatalogs();
        }
    }, [customerDetails])

    useEffect(() => {
        if(!EmptyObjectChecker(customerDetails))
            getCustomerSales()
    }, [custoemrSalesFilter])

    useEffect(() => {
        if(!EmptyObjectChecker(customerDetails))
            getCustomerCatalogs()
    }, [custoemrCatalogsFilter])

    useEffect(() => {
        if(tempInvoiceNumber.trim().length >= 8){
            const timer = setTimeout(() => {
                setCustoemrSalesFilter((prev) => {
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
            {/* Customer Details */}
            <Row>
                <Col lg={12}>
                {
                    customerLoader &&
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    customerFailer != null &&
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
                        <Button onClick={getCustomerDetails} variant="danger">اعادة المحاولة</Button>
                        </Alert>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    !EmptyObjectChecker(customerDetails) &&
                    <div className="my-3 bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white p-3">
                        <div>
                            <h2>تفاصيل العميل</h2>
                        </div>
                        <div className="w-100 d-flex flex-wrap justify-content-start align-items-center gap-3">
                            <Button
                                variant={`${customerDetails.isActive ? 'success' : 'danger'}`}
                                className="d-flex justify-content-center align-items-center rounded-4 px-5 py-3 text-white fw-bold border border-3 border-white"
                                onClick={handleToggleCustomer}
                                disabled={toggleLoader}
                            >
                                الحالة : {customerDetails.isActive ? 'فعال' : 'محظور'}
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
                                    <Button onClick={handleToggleCustomer} variant="danger">اعادة المحاولة</Button>
                                    </Alert>
                                </div>
                            }
                            {
                                !EmptyObjectChecker(customerDetails) &&
                                customerDetails.isActive && 
                                <UpdateCustomerModal
                                    token={authInfo.Token}
                                    implementationsUpdateCustomer={customerImplemetations.UpdateCustomer}
                                    oldCustomer={customerDetails}
                                    setNeedRefresh={setNeedRefresh}
                                    SpecialStyling={''}
                                />
                            }
                        </div>
                        <div className="py-2 customer-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>معرف العميل : </strong>
                            <strong>{customerDetails.id}</strong>
                        </div>
                        <div className="py-2 customer-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>الاسم الاول : </strong>
                            <strong>{customerDetails.firstName}</strong>
                        </div>
                        <div className="py-2 customer-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>اسم العائلة : </strong>
                            <strong>{customerDetails.lastName}</strong>
                        </div>
                        {
                            customerDetails.phone &&
                            <div className="py-2 customer-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                                <strong>الهاتف : </strong>
                                <strong>{customerDetails.phone || 'غير متوفر'}</strong>
                            </div>
                        }
                        {
                            customerDetails.email &&
                            <div className="py-2 customer-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                                <strong>البريد الالكتروني : </strong>
                                <strong>{customerDetails.email || 'غير متوفر'}</strong>
                            </div>
                        }
                        {
                            customerDetails.address &&
                            <div className="py-2 customer-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                                <strong>العنوان : </strong>
                                <strong>{customerDetails.address || 'غير متوفر'}</strong>
                            </div>
                        }
                        <div className="py-2 customer-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>تاريخ الانشاء : </strong>
                            <strong>{new Date(customerDetails.joinDate + 'Z').toLocaleString() || 'غير متوفر'}</strong>
                        </div>
                    </div>
                }
                </Col>
            </Row>

            {/* Customer Sales */}
            <Row>
                <Col lg={12} className="my-3" style={{minHeight: 300}}>
                    <div className="px-2 py-2 h-100 bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white">
                        <div>
                            <h2>فواتير العميل</h2>
                        </div>
                        <div className="w-100">
                            <div className={'d-flex flex-wrap justify-content-start align-items-center gap-3 flex-wrap'}>
                                <div className="form-group d-flex flex-wrap justify-cotent-start align-items-center gap-1 w-auto">
                                    <label htmlFor="pageSize">عدد العناصر في الصفحة</label>
                                    <select
                                        name="pageSize"
                                        id="pageSize"
                                        className="form-select form-select-sm w-auto"
                                        value={custoemrSalesFilter.pageSize}
                                        onChange={handleChangePageSize}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                                <div className="form-group d-flex flex-wrap justify-cotent-start align-items-center gap-1">
                                    <label htmlFor="search">بحث برقم الفاتورة</label>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        className="form-control w-auto"
                                        value={tempInvoiceNumber}
                                        onInput={handleCustomerSalesSearch}
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
                                            value={custoemrSalesFilter.from || dateRange.from}
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
                                            value={custoemrSalesFilter.to || dateRange.to}
                                        />
                                    </div>
                                </div>
                            </div>
                            {
                                customerSalesFailer != null &&
                                Object.keys(customerSalesFailer).length > 0 &&
                                <div className="w-100 h-100">
                                    <Alert variant="danger">
                                    <h5>{customerSalesFailer.title || 'فشل'}</h5>
                                    {
                                        customerSalesFailer.errors && Object.keys(customerSalesFailer.errors).length > 0 &&
                                        <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                                        {
                                            Object.keys(customerSalesFailer.errors).map((key, index) => (
                                            <li key={index} className="w-100">{customerSalesFailer.errors[key]}</li>
                                            ))
                                        }
                                        </ul>
                                    }
                                    <Button onClick={getCustomerSales} variant="danger">اعادة المحاولة</Button>
                                    </Alert>
                                </div>
                            }
                            {
                                customerSalesLoader ?
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
                                            label: "قيمة الحسم",
                                            value: "discount"
                                        },
                                        {
                                            label: "القيمة بعد الحسم",
                                            value: "netAmount"
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
                                    bodyData={customerSalesMapper()}
                                    goToDetails={(e) => {
                                        const row = e.target.closest('tr')
                                        if(row){
                                            const id = row.id.split('-')[1];
                                            window.open(`/sales/${customerSales[id].id}/details`, '_blank');
                                        }
                                    }}
                                />                            
                            }
                        </div>
                        <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                            <Button 
                                disabled={customerSalesLoader || !customerSalespagination.hasPreviousPage}
                                variant="dark"
                                className="px-sm-5"
                                onClick={handlePreviousPage}
                            >السابق</Button>
                            <div>
                                <strong>الصفحة: {customerSalespagination.pageNumber}/{customerSalespagination.totalPages}</strong>
                            </div>
                            <Button
                                disabled={customerSalesLoader || !customerSalespagination.hasNextPage}
                                variant="dark"
                                className="px-sm-5"
                                onClick={handleNextPage}
                            >التالي</Button>
                        </div>
                    </div>
                </Col>
            </Row>
            
            {/* Customer Catalogs */}
            <Row>
                <Col lg={12} className="my-3" style={{minHeight: 300}}>
                    <div className="px-2 py-2 h-100 bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white">
                        <div>
                            <h2>كاتالوغات العميل</h2>
                        </div>
                        <div className="w-100">
                            <div className={'d-flex flex-wrap justify-content-start align-items-center gap-3 flex-wrap'}>
                                <div className="form-group d-flex flex-wrap justify-cotent-start align-items-center gap-1 w-auto">
                                    <label htmlFor="pageSize-catalog">عدد العناصر في الصفحة</label>
                                    <select
                                        name="pageSize-catalog"
                                        id="pageSize-catalog"
                                        className="form-select form-select-sm w-auto"
                                        value={custoemrCatalogsFilter.pageSize}
                                        onChange={handleChangePageSizeCatalogs}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                                <div className="form-group d-flex flex-wrap justify-cotent-start align-items-center gap-1">
                                    <label htmlFor="search-catalog">بحث  الكود</label>
                                    <input
                                        type="text"
                                        name="search-catalog"
                                        id="search-catalog"
                                        className="form-control w-auto"
                                        value={custoemrCatalogsFilter.search}
                                        onInput={handleCustomerCatalogsSearch}
                                        placeholder="بحث حسب كود الكاتالوغ..."
                                    />
                                </div>
                                <div className="d-flex flex-wrap justify-content-start align-items-center gap-3 w-auto">
                                    <div className="form-group d-flex justify-cotent-start align-items-center gap-1">
                                        <label htmlFor="fromDate-catalog">من</label>
                                        <input
                                            type="date"
                                            name="fromDate-catalog"
                                            id="fromDate-catalog"
                                            className="form-control"
                                            min={"2025-01-01"}
                                            onChange={handleFromCatalogs}
                                            value={custoemrCatalogsFilter.from || catalogsDateRange.from}
                                        />
                                    </div>
                                    <div className="form-group d-flex justify-cotent-start align-items-center gap-1">
                                        <label htmlFor="toDate-catalog">الى</label>
                                        <input
                                            type="date"
                                            name="toDate-catalog"
                                            id="toDate-catalog"
                                            className="form-control"
                                            min={"2025-01-01"}
                                            onChange={handleToCatalogs}
                                            value={custoemrCatalogsFilter.to || catalogsDateRange.to}
                                        />
                                    </div>
                                </div>
                                <div className="form-group d-flex flex-wrap justify-content-start align-items-center gap-2 w-auto">
                                    <label htmlFor="including-returned">تضمين الكاتالوغات المسترجعة</label>
                                    <input
                                        type="checkbox"
                                        name="including-returned"
                                        id="including-returned"
                                        className="mb-0"
                                        value={custoemrCatalogsFilter.includeReturned}
                                        onChange={handleIncludingReturned}
                                    />
                                </div>
                            </div>
                            {
                                customerCatalogsFailer != null &&
                                Object.keys(customerCatalogsFailer).length > 0 &&
                                <div className="w-100 h-100">
                                    <Alert variant="danger">
                                    <h5>{customerCatalogsFailer.title || 'فشل'}</h5>
                                    {
                                        customerCatalogsFailer.errors && Object.keys(customerCatalogsFailer.errors).length > 0 &&
                                        <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                                        {
                                            Object.keys(customerCatalogsFailer.errors).map((key, index) => (
                                            <li key={index} className="w-100">{customerCatalogsFailer.errors[key]}</li>
                                            ))
                                        }
                                        </ul>
                                    }
                                    <Button onClick={getCustomerCatalogs} variant="danger">اعادة المحاولة</Button>
                                    </Alert>
                                </div>
                            }
                            {
                                customerCatalogsLoader ?
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
                                            label: "الكود",
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
                                        }
                                    ]}
                                    bodyData={customerCatalogs}
                                    goToDetails={(e) => {
                                        const row = e.target.closest('tr')
                                        if(row){
                                            const id = row.id.split('-')[1];
                                            window.open(`/catalogs/${customerCatalogs[id].catalogID}/details`, '_blank');
                                        }
                                    }}
                                />                            
                            }
                        </div>
                        <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                            <Button 
                                disabled={customerCatalogsLoader || !customerCatalogspagination.hasPreviousPage}
                                variant="dark"
                                className="px-sm-5"
                                onClick={handlePreviousPageCatalogs}
                            >السابق</Button>
                            <div>
                                <strong>الصفحة: {customerCatalogspagination.pageNumber}/{customerCatalogspagination.totalPages}</strong>
                            </div>
                            <Button
                                disabled={customerCatalogsLoader || !customerCatalogspagination.hasNextPage}
                                variant="dark"
                                className="px-sm-5"
                                onClick={handleNextPageCatalogs}
                            >التالي</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default CustomerDetails