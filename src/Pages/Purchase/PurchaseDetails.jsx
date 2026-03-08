import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { NavLink, useParams} from "react-router-dom"
import { PurchaseImplementations } from "../../Code/PurchaseImplementations"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Col, Container, Pagination, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";
import DataViewer from "../../Components/Common/DataViewer";
import { FaArrowRight } from "react-icons/fa6";
import PayRestAmount from "../../Components/Common/PayRestAmount";

const PurchaseDetails = () => {
    const {authInfo} = useContext(GlobalContext)
    const { purchaseId } = useParams();
    const [purchaseDetails, setPurchaseDetails] = useState(null);
    const [purchaseLoader, setPurchaseLoader] = useState(false);
    const [purchaseFailer, setPurchaseFailer] = useState({});
    const [needRefresh, setNeedRefresh] = useState(false)
    const purchaseImplemetations = PurchaseImplementations;
    
    const getPurchaseDetails = () => {
        purchaseImplemetations.PurchaseDetails({
            token: authInfo.Token,
            id: purchaseId,
            setPurchaseDetails: setPurchaseDetails,
            setLoader: setPurchaseLoader,
            setFailer: setPurchaseFailer
        })
        setNeedRefresh(false)
    }

    const purchaseMapper = () => {
        return purchaseDetails.purchaseItems.map(item => ({
            productID: item.productID,
            productCode: item.productCode,
            quantity: item.quantity,
            unitCost: `${item.unitCost}$`,
            total: <div className="text-success fw-bold fst-italic">{item.total}$</div>
        }))
    }

    useEffect(()=>{
        if(purchaseId){
            getPurchaseDetails();
        }
    }, [purchaseId])

    useEffect(() => {
        if(needRefresh){
            getPurchaseDetails();
        }
    }, [needRefresh])

    return (
        <Container className="text-white">
            {/* Purchase Details */}
            <Row>
                <Col lg={12}>
                {
                    purchaseLoader &&
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    purchaseFailer != null &&
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
                        <Button onClick={getPurchaseDetails} variant="danger">اعادة المحاولة</Button>
                        </Alert>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    !EmptyObjectChecker(purchaseDetails) &&
                    <div className="my-3 bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white p-3">
                        <div>
                            <h2>تفاصيل فاتورة مشتريات</h2>
                        </div>
                        <div className="w-100 d-flex justify-content-start align-items-center gap-3">
                            <div className={`text-white d-flex justify-content-start align-items-center px-5 py-3 rounded-4 border border-3 border-white ${purchaseDetails.status == 'NotPaid' ? 'bg-danger' : purchaseDetails.status == 'NotCompleted' ? 'bg-warning' : 'bg-success'}`}>
                                <strong>الحالة : {purchaseDetails.status == 'NotPaid' ? 'غير مدفوع' : purchaseDetails.status == 'NotCompleted' ? 'غير مكتمل' : 'مدفوع' || 'غير متوفر'}</strong>
                            </div>
                            {
                                purchaseDetails.status == 'NotPaid' || purchaseDetails.status == 'NotCompleted' ?
                                <PayRestAmount
                                    oldPaid={purchaseDetails.paidAmount}
                                    totalAmount={purchaseDetails.totalAmount}
                                    id={purchaseDetails.id}
                                    token={authInfo.Token}
                                    requestSender={purchaseImplemetations.PayPurchase}
                                    setNeedRefresh={setNeedRefresh}
                                    title={'دفع باقي المبلغ'}
                                />
                                : ''
                            }
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>معرف الفاتورة : </strong>
                            <strong>{purchaseDetails.id || 'غير متوفر'}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>رقم الفاتورة : </strong>
                            <strong>{purchaseDetails.invoiceNumber || 'غير متوفر'}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>عدد المواد : </strong>
                            <strong>{parseInt(purchaseDetails.productsCount) || 'غير متوفر'}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>قيمة الفاتورة : </strong>
                            <strong className="text-dark">{parseFloat(purchaseDetails.totalAmount) || 'غير متوفر'}$</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>القيمة المدفوعة : </strong>
                            <strong className="text-dark">{toString(purchaseDetails.paidAmount).length > 0 ? parseFloat(purchaseDetails.paidAmount) : '0'  || 'غير متوفر'}$</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>معرف المزود : </strong>
                            <strong>
                                <NavLink
                                    to={`/suppliers/${purchaseDetails.supplierID}/details`}
                                    target="_blank"
                                    className={'fw-bold fst-italic text-warning text-decoration-none'}
                                >
                                    <FaArrowRight />
                                    {purchaseDetails.supplierID || 'غير متوفر'}
                                </NavLink>
                            </strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>اسم المزود : </strong>
                            <strong>
                                <NavLink
                                    to={`/suppliers/${purchaseDetails.supplierID}/details`}
                                    target="_blank"
                                    className={'fw-bold fst-italic text-warning text-decoration-none'}
                                >
                                    <FaArrowRight />
                                    {purchaseDetails.supplierName || 'غير متوفر'}
                                </NavLink>
                            </strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>تاريخ الانشاء : </strong>
                            <strong>{new Date(purchaseDetails.createdAt + 'Z').toLocaleString() || 'غير متوفر'}</strong>
                        </div>
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
                                        label: "سعر الوحدة",
                                        value: "unitCost"
                                    },
                                    {
                                        label: "المجموع",
                                        value: "total"
                                    },
                                    ]}
                                    bodyData={purchaseMapper()}
                                    goToDetails={(e) => {
                                        const row = e.target.closest('tr');
                                        if (row) {
                                            const id = row.id.split('-')[1];
                                            window.open(`/products/${purchaseDetails.purchaseItems[id].productID}/details`, '_blank');
                                        }
                                    }}
                                />
                        </div>
                    </div>
                }
                </Col>
            </Row>
        </Container>
    )
}

export default PurchaseDetails