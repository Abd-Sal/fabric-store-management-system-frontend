import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { NavLink, useParams} from "react-router-dom"
import { ProductImplementations } from "../../Code/ProductImplementations"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Col, Container, Pagination, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";
import DataViewer from "../../Components/Common/DataViewer";

const ProductDetails = () => {
    const {authInfo} = useContext(GlobalContext)
    const { productId } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [productLoader, setProductLoader] = useState(false);
    const [productFailer, setProductFailer] = useState({});

    const [productTransactions, setProductTransactions] = useState([]);
    const [transactionsLoader, setTransactionsLoader] = useState(false);
    const [transactionsFailer, setTransactionsFailer] = useState({});
    const [filter, setFilter] = useState({
        page: 1,
        pageSize: 10
    })
    const [pagination, setPagination] = useState({
        pageNumber: 0,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
    });
    const productImplemetations = ProductImplementations;
    
    const getProductDetails = () => {
        productImplemetations.ProductDetails({
            token: authInfo.Token,
            id: productId,
            setProductDetails: setProductDetails,
            setLoader: setProductLoader,
            setFailer: setProductFailer
        })
    }

    const getProductTransactions = () => {
        productImplemetations.GetProductTransactions({
            token: authInfo.Token,
            id: productId,
            setTransactions: setProductTransactions,
            setLoader: setTransactionsLoader,
            setFailer: setTransactionsFailer,
            page: filter.page,
            pageSize: filter.pageSize,
            setPagination: setPagination
        })
    }
    const transactionsMapper = () => {
        return productTransactions.map(item => ({
            id: item.id,
            note: item.note,
            quantityChange: parseFloat(item.quantityChange) > 0 ? <div className="bg-success px-2 py-1 rounded-4 text-white">+{item.quantityChange}</div> : <div className="bg-danger px-2 py-1 rounded-4 text-white">{item.quantityChange}</div>,
            referenceID: 
                <NavLink className={'text-success text-decoration-none fw-bold fst-italic'} to={`/${item.referenceType == 'Sample' ? 'catalogs' : item.referenceType == 'Purchase' ? 'purchases' : 'sales'}/${item.referenceID}/details`} target="_blank">
                    {item.referenceID}
                </NavLink>,
            referenceType: item.referenceType == 'Sample' ? 'عينة' : item.referenceType == 'Purchase' ? 'شراء' : item.referenceType == 'Sale' ? 'بيع' : item.referenceType,
            createdAt: item.createdAt
        }))
    }
    const handleNextPage = () => {
        if(pagination.hasNextPage){
            setFilter((prev) => {
                return {
                    ...prev,
                    page: prev.page + 1
                }
            })
        }
    }
    const handlePreviousPage = () => {
        if(pagination.hasPreviousPage){
            setFilter((prev) => {
                return {
                    ...prev,
                    page: prev.page - 1
                }
            })
        }
    }
    const handleChangePageSize = (e) => {
        const newSize = parseInt(e.target.value);
        setFilter((prev) => {
            return {
                ...prev,
                pageSize: newSize,
                page: 1
            }
        })
    }

    useEffect(()=>{
        if(productId){
            getProductDetails();
        }
    }, [productId])

    useEffect(() => {
        if(!EmptyObjectChecker(productDetails))
            getProductTransactions();
    }, [productDetails])

    useEffect(() => {
        if(!EmptyObjectChecker(productDetails))
            getProductTransactions()
    }, [filter])

    return (
        <Container className="text-white">
            {/* Product Details */}
            <Row>
                <Col lg={12}>
                {
                    productLoader &&
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    productFailer != null &&
                    Object.keys(productFailer).length > 0 &&
                    <div className="w-100">
                        <Alert variant="danger">
                        <h5>{productFailer.title || 'فشل'}</h5>
                        {
                            productFailer.errors && Object.keys(productFailer.errors).length > 0 &&
                            <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                            {
                                Object.keys(productFailer.errors).map((key, index) => (
                                <li key={index} className="w-100">{productFailer.errors[key]}</li>
                                ))
                            }
                            </ul>
                        }
                        <Button onClick={getProductDetails} variant="danger">اعادة المحاولة</Button>
                        </Alert>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    !EmptyObjectChecker(productDetails) &&
                    <div className="bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white p-3">
                        <div>
                            <h2>تفاصيل المادة</h2>
                        </div>
                        <div className="py-2 d-flex justify-content-start align-items-center gap-3 w-100">
                            <div className="p-2 bg-success w-25 d-flex justify-content-center align-items-center gap-2 rounded-5 border border-3 border-white">
                                <strong>الكمية الحالية : </strong>
                                <strong>{`${productDetails.currentQuantity} ${productDetails.product.unit}` || 'غير متوفر'}</strong>
                            </div>
                            <div className="p-2 bg-success w-25 d-flex justify-content-center align-items-center gap-2 rounded-5 border border-3 border-white">
                                <strong>اخر سعر رأس مال : </strong>
                                <strong>{`${productDetails.lastUnitCost}$` || 'غير متوفر'}</strong>
                            </div>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>معرف المادة : </strong>
                            <strong>{productDetails.product.id}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>الكود كامل : </strong>
                            <strong>{productDetails.product.productCode}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>الكود : </strong>
                            <strong>{productDetails.product.code}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>اللون : </strong>
                            <strong>{productDetails.product.color}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>وحدة التخزين : </strong>
                            <strong>{productDetails.product.unit}</strong>
                        </div>
                        <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                            <strong>تاريخ الانشاء : </strong>
                            <strong>{new Date(productDetails.product.createdAt + 'Z').toLocaleString() || 'غير متوفر'}</strong>
                        </div>
                        {
                            productDetails.lastUpdateAt &&
                            <div className="py-2 product-details-hover border-bottom w-100 d-flex justify-content-between align-items-center gap-2">
                                <strong>تاريخ اخر تعديل : </strong>
                                <strong>{new Date(productDetails.lastUpdateAt + 'Z').toLocaleString() || 'غير متوفر'}</strong>
                            </div>
                        }
                    </div>
                }
                </Col>
            </Row>

            {/* Product Transactions */}
            <Row>
                <Col lg={12} className="my-3" style={{minHeight: 300}}>
                    {
                        transactionsLoader &&
                        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                            <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    }
                    {
                        transactionsFailer != null &&
                        Object.keys(transactionsFailer).length > 0 &&
                        <div className="w-100 h-100">
                            <Alert variant="danger">
                            <h5>{transactionsFailer.title || 'فشل'}</h5>
                            {
                                transactionsFailer.errors && Object.keys(transactionsFailer.errors).length > 0 &&
                                <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                                {
                                    Object.keys(transactionsFailer.errors).map((key, index) => (
                                    <li key={index} className="w-100">{transactionsFailer.errors[key]}</li>
                                    ))
                                }
                                </ul>
                            }
                            <Button onClick={getProductTransactions} variant="danger">اعادة المحاولة</Button>
                            </Alert>
                        </div>
                    }
                    {
                        !transactionsLoader &&
                        EmptyObjectChecker(transactionsFailer) &&
                        productTransactions.length > 0 &&
                        <div className="px-2 py-2 h-100 bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white">
                            <div>
                                <h2>حركات المادة</h2>
                            </div>
                            <div className="w-100">
                                <div className={'d-flex justify-content-start align-items-center gap-3'}>
                                    <label htmlFor="pageSize">عدد العناصر في الصفحة: {filter.pageSize}</label>
                                    <select
                                        name="pageSize"
                                        id="pageSize"
                                        className="form-select form-select-sm w-auto"
                                        value={filter.pageSize}
                                        onChange={handleChangePageSize}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                                <DataViewer 
                                    specialStyle="mt-2"
                                    headData={[
                                    {
                                        label: "وصف",
                                        value: "note"
                                    },
                                    {
                                        label: "الكمية المتغيرة",
                                        value: "quantityChange"
                                    },
                                    {
                                        label: "معرف المرجع",
                                        value: "referenceID", 
                                    },
                                    {
                                        label: "نوع المرجع",
                                        value: "referenceType"
                                    },
                                    {
                                        label: "تاريخ الانشاء",
                                        value: "createdAt",
                                        dataType: 'date',
                                        dateFormat: 'full'
                                    }
                                    ]}
                                    bodyData={transactionsMapper()}
                                    enableGoToDetails={false}
                                />
                            </div>
                            <div className="w-100 d-flex justify-content-between align-items-center gap-2">
                                <Button 
                                    disabled={transactionsLoader || !pagination.hasPreviousPage}
                                    variant="dark"
                                    className="px-5"
                                    onClick={handlePreviousPage}
                                >السابق</Button>
                                <div>
                                    <strong>الصفحة: {pagination.pageNumber}/{pagination.totalPages}</strong>
                                </div>
                                <Button
                                    disabled={transactionsLoader || !pagination.hasNextPage}
                                    variant="dark"
                                    className="px-5"
                                    onClick={handleNextPage}
                                >التالي</Button>
                            </div>
                        </div>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default ProductDetails