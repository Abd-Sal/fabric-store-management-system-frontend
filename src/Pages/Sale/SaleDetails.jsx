import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { NavLink, useParams} from "react-router-dom"
import { SaleImplementations } from "../../Code/SaleImplementations"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Col, Container, Pagination, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";
import DataViewer from "../../Components/Common/DataViewer";
import { FaArrowRight } from "react-icons/fa6";
import PayRestAmount from "../../Components/Common/PayRestAmount";

const SaleDetails = () => {
    const {authInfo} = useContext(GlobalContext)
    const { saleId } = useParams();
    const [saleDetails, setSaleDetails] = useState(null);
    const [saleLoader, setSaleLoader] = useState(false);
    const [saleFailer, setSaleFailer] = useState({});
    const [needRefresh, setNeedRefresh] = useState(false)
    const saleImplemetations = SaleImplementations;
    
    const getSaleDetails = () => {
        saleImplemetations.SaleDetails({
            token: authInfo.Token,
            id: saleId,
            setSaleDetails: setSaleDetails,
            setLoader: setSaleLoader,
            setFailer: setSaleFailer
        })
        setNeedRefresh(false)
    }

    const saleMapper = () => {
        return saleDetails.saleItems.map(item => ({
            productID: item.productID,
            productCode: item.productCode,
            quantity: item.quantity,
            unitPrice:`${item.unitPrice}$`,
            total: <div className="text-success fw-bold fst-italic">{item.total}$</div>
        }))
    }

    useEffect(()=>{
        if(saleId){
            getSaleDetails();
        }
    }, [saleId])

    useEffect(() => {
        if(needRefresh){
            getSaleDetails();
        }
    }, [needRefresh])

    return (
        <Container className="text-white">
            {/* Sale Details */}
            <Row>
                <Col lg={12}>
                {
                    saleLoader &&
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    saleFailer != null &&
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
                        <Button onClick={getSaleDetails} variant="danger">اعادة المحاولة</Button>
                        </Alert>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    !EmptyObjectChecker(saleDetails) &&
                    <div className="my-3 bg-secondary d-flex flex-wrap flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white p-3">
                        <div>
                            <h2>تفاصيل فاتورة مبيعات</h2>
                        </div>
                        <div className="w-100 d-flex flex-wrap justify-content-start align-items-center gap-3">
                            <div className={`text-white d-flex justify-content-start align-items-center px-5 py-3 rounded-4 border border-3 border-white ${saleDetails.status == 'NotPaid' ? 'bg-danger' : saleDetails.status == 'NotCompleted' ? 'bg-warning' : 'bg-success'}`}>
                                <strong>الحالة : {saleDetails.status == 'NotPaid' ? 'غير مدفوع' : saleDetails.status == 'NotCompleted' ? 'غير مكتمل' : 'مدفوع' || 'غير متوفر'}</strong>
                            </div>
                            {
                                saleDetails.status == 'NotPaid' || saleDetails.status == 'NotCompleted' ?
                                <PayRestAmount
                                    oldPaid={saleDetails.paidAmount}
                                    totalAmount={saleDetails.netAmount}
                                    id={saleDetails.id}
                                    token={authInfo.Token}
                                    requestSender={saleImplemetations.PaySale}
                                    setNeedRefresh={setNeedRefresh}
                                    title={'دفع باقي المبلغ'}
                                />
                                : ''
                            }
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>معرف الفاتورة : </strong>
                            <strong>{saleDetails.id}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>رقم الفاتورة : </strong>
                            <strong>{saleDetails.invoiceNumber}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>عدد المواد : </strong>
                            <strong>{parseInt(saleDetails.productsCount)}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>قيمة الفاتورة : </strong>
                            <strong className="text-dark">{parseFloat(saleDetails.totalAmount)}$</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>قيمة الحسم : </strong>
                            <strong className="text-dark">{parseFloat(saleDetails.discount)}$</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>القيمة بعد الحسم : </strong>
                            <strong className="text-dark">{parseFloat(saleDetails.netAmount)}$</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>القيمة المدفوعة : </strong>
                            <strong className="text-dark">{parseFloat(saleDetails.paidAmount)}$</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>معرف العميل : </strong>
                            <strong>
                                <NavLink
                                    to={`/customers/${saleDetails.customerID}/details`}
                                    target="_blank"
                                    className={'fw-bold fst-italic text-warning text-decoration-none'}
                                >
                                    <FaArrowRight />
                                    {saleDetails.customerID}
                                </NavLink>
                            </strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>اسم العميل : </strong>
                            <strong>
                                <NavLink
                                    to={`/customers/${saleDetails.customerID}/details`}
                                    target="_blank"
                                    className={'fw-bold fst-italic text-warning text-decoration-none'}
                                >
                                    <FaArrowRight />
                                    {saleDetails.customerName}
                                </NavLink>
                            </strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex flex-wrap text-break justify-content-between align-items-center gap-2">
                            <strong>تاريخ الانشاء : </strong>
                            <strong>{new Date(saleDetails.createdAt + 'Z').toLocaleString()}</strong>
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
                                        value: "unitPrice"
                                    },
                                    {
                                        label: "المجموع",
                                        value: "total"
                                    },
                                    ]}
                                    bodyData={saleMapper()}
                                    goToDetails={(e) => {
                                        const row = e.target.closest('tr');
                                        if (row) {
                                            const id = row.id.split('-')[1];
                                            window.open(`/products/${saleDetails.saleItems[id].productID}/details`, '_blank');
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

export default SaleDetails