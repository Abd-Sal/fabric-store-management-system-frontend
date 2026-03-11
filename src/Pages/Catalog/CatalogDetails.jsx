import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { NavLink, useNavigate, useParams} from "react-router-dom"
import { CatalogImplementations } from "../../Code/CatalogImplementations"
import { CustomerImplementations } from "../../Code/CustomerImplementations"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Col, Container, Pagination, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";
import DataViewer from "../../Components/Common/DataViewer";
import { FaArrowRight } from "react-icons/fa6";
import PayRestAmount from "../../Components/Common/PayRestAmount";
import AssignCatalogModal from "../../Components/Catalog/AssignCatalogModal";
import ConfirmationCatalogModal from "../../Components/Catalog/ConfirmationCatalogModal";
import { OurRoutes } from "../../Routes/OurRoutes"

const CatalogDetails = () => {
    const {authInfo} = useContext(GlobalContext)
    const { catalogId } = useParams();
    const [catalogDetails, setCatalogDetails] = useState(null);
    const [catalogLoader, setCatalogLoader] = useState(false);
    const [catalogFailer, setCatalogFailer] = useState({});
    const [catalogBorrower, setCatalogBorrower] = useState(null);
    const [catalogBorrowerLoader, setCatalogBorrowerLoader] = useState(false);
    const [catalogBorrowerFailer, setCatalogBorrowerFailer] = useState({});
    const [needRefresh, setNeedRefresh] = useState(false)
    const navigate = useNavigate()
    const catalogImplemetations = CatalogImplementations;
    const customerImplementations = CustomerImplementations;

    const getCatalogDetails = () => {
        catalogImplemetations.CatalogDetails({
            token: authInfo.Token,
            id: catalogId,
            setCatalogDetails: setCatalogDetails,
            setLoader: setCatalogLoader,
            setFailer: setCatalogFailer
        })
        setNeedRefresh(false)
    }

    const catalogMapper = () => {
        return catalogDetails.items.map(item => ({
            productID: <NavLink to={`/products/${item.productID}/details`} target="_blank" className={`text-decoration-none fw-bold text-dark`}>{item.productID}</NavLink>,
            productCode: item.productCode,
            quantity: `${item.quantity == 0? '---' : item.quantity}`,
            isDeducted: <div className={`text-white d-flex justify-content-center align-items-center px-3 py-1 rounded-4 ${item.isDeducted ? 'bg-danger' : 'bg-success'}`}>{item.isDeducted ? 'مقتطع' : 'غير مقتطع'}</div>
        }))
    }

    const getCatalogBorrower = () => {
        catalogImplemetations.AssignedCatalogsDetails({
            catalogID: catalogDetails.id,
            token: authInfo.Token,
            setAssignedCatalogs: setCatalogBorrower,
            setFailer: setCatalogBorrowerFailer,
            setLoader: setCatalogBorrowerLoader
        })
    }

    useEffect(()=>{
        if(catalogId){
            getCatalogDetails();
        }
    }, [catalogId])

    useEffect(() => {
        if(needRefresh){
            getCatalogDetails();
        }
    }, [needRefresh])

    useEffect(() => {
        if(!EmptyObjectChecker(catalogDetails) && catalogDetails.status == 'Assigned')
            getCatalogBorrower();
    }, [catalogDetails])

    return (
        <Container className="text-white">
            {/* Catalog Details */}
            <Row>
                <Col lg={12}>
                {
                    catalogLoader &&
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    catalogFailer != null &&
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
                        <Button onClick={getCatalogDetails} variant="danger">اعادة المحاولة</Button>
                        </Alert>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    !EmptyObjectChecker(catalogDetails) &&
                    <div className="my-3 bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white p-3">
                        <div>
                            <h2>تفاصيل الكاتالوغ</h2>
                        </div>
                        <div className="w-100 d-flex justify-content-start align-items-center gap-3">
                            <div className={`text-white d-flex justify-content-start align-items-center px-5 py-3 rounded-4 border border-3 border-white ${catalogDetails.status == 'Available' ? 'bg-success' : catalogDetails.status == 'Assigned' ? 'bg-warning' : 'bg-danger'}`}>
                                <strong>الحالة : {catalogDetails.status == 'Available' ? 'متوفر' : catalogDetails.status == 'Assigned' ? 'محجوز' : 'تالف'}</strong>
                            </div>
                            {
                                catalogDetails.isPurchased &&
                                <div className={`text-white d-flex justify-content-start align-items-center px-5 py-3 rounded-4 border border-3 border-white ${catalogDetails.isPaid ? 'bg-success' : 'bg-danger'}`}>
                                    <strong>حالة الدفع : {catalogDetails.isPaid ? 'مكتمل' : 'غير مكتمل'}</strong>
                                </div>
                            }
                            {
                                catalogDetails.isPurchased && !catalogDetails.isPaid ?
                                    <PayRestAmount
                                        oldPaid={catalogDetails.paidAmount}
                                        totalAmount={catalogDetails.price}
                                        id={catalogDetails.id}
                                        token={authInfo.Token}
                                        requestSender={catalogImplemetations.PayCatalog}
                                        setNeedRefresh={setNeedRefresh}
                                        title={'دفع باقي المبلغ'}
                                    />
                                : ''
                            }
                            {
                                catalogDetails.status == 'Available' &&
                                <AssignCatalogModal 
                                    catalogID={catalogDetails.id}
                                    token={authInfo.Token}
                                    searcher={customerImplementations.CustomerSearchForBill}
                                    requestSender={catalogImplemetations.AssignCatalog}
                                    setNeedRefresh={setNeedRefresh}
                                    title={'اعارة الكاتالوغ لعميل'}
                                />
                            }
                            {
                                catalogDetails.status == 'Assigned' &&
                                <ConfirmationCatalogModal 
                                    btnStyle={'primary'}
                                    bodyTitle={'هل انت متأكد انك تريد استعادة هذا الكاتالوغ ؟'}
                                    btnTitle={'استعادة الكاتالوغ'}
                                    id={catalogDetails.id}
                                    token={authInfo.Token}
                                    requestSender={catalogImplemetations.ReturnCatalog}
                                    setNeedRefresh={setNeedRefresh}
                                    title={'هل انت متأكد'}
                                />
                            }
                            {
                                catalogDetails.status == 'Available' &&
                                <ConfirmationCatalogModal 
                                    btnStyle={'danger'}
                                    btnTitle={'حذف الكاتالوغ'}
                                    id={catalogDetails.id}
                                    token={authInfo.Token}
                                    requestSender={catalogImplemetations.RemoveCatalog}
                                    setNeedRefresh={setNeedRefresh}
                                    bodyTitle={'هل انت متأكد انك تريد حذف هذا الكاتالوغ ؟'}
                                    title={'هل انت متأكد'}
                                    specialBehavior={()=> navigate(`${OurRoutes.Catalogs.ShowAll}`, {replace: true})}
                                />
                            }
                            {
                                catalogDetails.status == 'Available' &&
                                <ConfirmationCatalogModal 
                                    btnStyle={'danger'}
                                    btnTitle={'اتلاف الكاتالوغ'}
                                    id={catalogDetails.id}
                                    token={authInfo.Token}
                                    requestSender={catalogImplemetations.DestroyCatalog}
                                    setNeedRefresh={setNeedRefresh}
                                    bodyTitle={'هل انت متأكد انك تريد اتلاف هذا الكاتالوغ ؟'}
                                    title={'هل انت متأكد'}
                                />
                            }
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>معرف الكاتالوغ : </strong>
                            <strong>{catalogDetails.id}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>الكود : </strong>
                            <strong>{catalogDetails.code}</strong>
                        </div>
                        {
                            catalogDetails.Description &&
                            <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                                <strong>الوصف : </strong>
                                <strong className="w-50">{catalogDetails.description || 'غير متوفر'}</strong>
                            </div>
                        }
                        {
                            catalogDetails.isPurchased &&
                            <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                                <strong>هل تم شرائه : </strong>
                                <strong >نعم</strong>
                            </div>
                        }
                        {
                            catalogDetails.isPurchased &&
                            <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                                <strong>معرف المورد : </strong>
                                <strong>
                                    <NavLink
                                        to={`/suppliers/${catalogDetails.supplierID}/details`}
                                        target="_blank"
                                        className={'fw-bold fst-italic text-warning text-decoration-none'}
                                    >
                                        <FaArrowRight />
                                        {catalogDetails.supplierID}
                                    </NavLink>
                                </strong>
                            </div>
                        }
                        {
                            catalogDetails.isPurchased &&
                            <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                                <strong>اسم المورد : </strong>
                                <strong>
                                    <NavLink
                                        to={`/suppliers/${catalogDetails.supplierID}/details`}
                                        target="_blank"
                                        className={'fw-bold fst-italic text-warning text-decoration-none'}
                                    >
                                        <FaArrowRight />
                                        {catalogDetails.supplierName}
                                    </NavLink>
                                </strong>
                            </div>
                        }
                        {
                            catalogDetails.isPurchased &&
                            <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                                <strong>السعر : </strong>
                                <strong className="text-dark">{parseFloat(catalogDetails.price)}$</strong>
                            </div>
                        }
                        {
                            catalogDetails.isPurchased &&
                            <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                                <strong>المبلغ المدفوع : </strong>
                                <strong className="text-dark">{parseFloat(catalogDetails.paidAmount)}$</strong>
                            </div>
                        }
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>تاريخ الانشاء : </strong>
                            <strong>{new Date(catalogDetails.createdAt + 'Z').toLocaleString()}</strong>
                        </div>
                        {
                            catalogDetails.lastUpdateAt &&
                            <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                                <strong>تاريخ اخر تعديل : </strong>
                                <strong>{new Date(catalogDetails.lastUpdateAt + 'Z').toLocaleString()}</strong>
                            </div>
                        }
                        {
                            !EmptyObjectChecker(catalogBorrower) &&
                            <div className="py-2 px-1 w-100 border border-3 border-white rounded-3 bg-success d-flex flex-column justify-content-between align-items-center gap-2">
                                <strong className="text-white fw-bold">العميل المستعير</strong>
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <strong>معرف العميل :</strong>
                                    <NavLink
                                        to={`/customers/${catalogBorrower.customerID}/details`}
                                        target="_blank"
                                        className={'text-decoration-none text-white fst-italic fw-bold'}
                                    >
                                        <FaArrowRight />
                                        {` ${catalogBorrower.customerID}`}
                                    </NavLink>
                                </div>
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <strong>اسم العميل :</strong>
                                    <NavLink
                                        to={`/customers/${catalogBorrower.customerID}/details`}
                                        target="_blank"
                                        className={'text-decoration-none text-white fst-italic fw-bold'}
                                    >
                                        <FaArrowRight />
                                        {` ${catalogBorrower.customerName}`}
                                    </NavLink>
                                </div>
                                {console.log(catalogBorrower)}
                            </div>
                        }
                        <div className="my-2 w-100">
                                <DataViewer 
                                    specialStyle="mt-2"
                                    headData={[
                                        {
                                            label: "معرف المادة",
                                            value: "productID"
                                        },
                                        {
                                            label: "كود المادة",
                                            value: "productCode"
                                        },
                                        {
                                            label: "الكمية",
                                            value: "quantity", 
                                        },
                                        {
                                            label: "هل مقتطع",
                                            value: "isDeducted"
                                        },
                                    ]}
                                    bodyData={catalogMapper()}
                                    enableGoToDetails={false}
                                />
                        </div>
                    </div>
                }
                </Col>
            </Row>
        </Container>
    )
}

export default CatalogDetails