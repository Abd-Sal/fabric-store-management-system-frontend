import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap"
import { GlobalContext } from "../../Context/GlobalContext";
import Button from 'react-bootstrap/Button';
import SaleBillDetailsViewer from "../../Components/Sale/SaleBillDetailsViewer";
import AutoCompletor from "../../Components/Common/AutoCompletor";
import { ProductImplementations } from "../../Code/ProductImplementations";
import { EmptyObjectChecker } from '../../HelperTools/EmptyObjectChecker'
import { CustomerImplementations } from '../../Code/CustomerImplementations'
import Modal from 'react-bootstrap/Modal';
import { SaleImplementations } from '../../Code/SaleImplementations'
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

const SaleBill = () => {
    const [show, setShow] = useState(false);
    const [msgDetails, setMsgDetails] = useState({
        title: 'خطأ',
        message: '',
        style: '',
        behavior: ()=>{}
    })
    const handleClose = () => {
        msgDetails.behavior()
        setShow(false);
    }
    const handleShow = (title, msg, style, behavior) => {
        setMsgDetails({
            ...msgDetails,
            title: title,
            message: msg,
            style: style,
            behavior: behavior
        })
    };

    const {authInfo} = useContext(GlobalContext)
    const [failer, setFailer] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [inputProductValue, setInputProductValue] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [inputCustomerValue, setInputCustomerValue] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [billDetails, setBillDetails] = useState([])
    const [paidAmount, setPaidAmount] = useState(0)
    const [discount, setDiscount] = useState(0)
    const productImplementations = ProductImplementations;
    const saleImplementations = SaleImplementations;
    const productSearcher = (query) => {
        return productImplementations.ProductSearchForBill({
            token: authInfo.Token,
            search: query
        })
    }
    const productDataMapper = (products) => {
        return products.map(item => ({
            value: item,
            label: `${item.product.productCode} (س.ر.م:${item.lastUnitCost}) (الكمية:${item.currentQuantity})`,
        }));
    }
    
    const customerImplemetations = CustomerImplementations;
    const customerSearcher = (query) => {
        return customerImplemetations.CustomerSearchForBill({
            token: authInfo.Token,
            search: query
        })
    }
    const customerDataMapper = (customers) => {
        return customers.map(item => ({
            value: item,
            label: `${item.firstName} ${item.lastName} ${item.phone ? `(الهاتف: ${item.phone})` : ''} ${item.email ? `(البريد الالكتروني:${item.email})`: ''} `,
        }));
    }

    const handleRemoveItemFromBillDetail = (e) => {
        const productID = e.currentTarget.getAttribute('data-id');        
        setBillDetails(prevBillDetails => {
            const products = prevBillDetails.filter(x => x.id != productID);
            return products;
        });
    }
    const handleAddToBillDetails = (e) => {
        let productID = selectedProduct?.value?.product.id
        if(billDetails.length > 0){
            let checkExistance = billDetails.filter(x => x.id == productID)
            if(checkExistance.length > 0){
                
                handleShow("خطأ", "هذا المنتج موجود بالفعل في الفاتورة",
                    'text-white bg-danger', ()=>{});
                return;
            }
        }
        let newProduct = {
            id: selectedProduct.value.product.id,
            productCode: selectedProduct.value.product.productCode,
            unitPrice: selectedProduct.value.unitPrice,
            quantity: selectedProduct.value.quantity,
            total: selectedProduct.value.total,
            remove: <button data-id={selectedProduct.value.product.id} onClick={handleRemoveItemFromBillDetail} className="btn btn-danger">مسح</button>
        }
        setBillDetails([...billDetails, newProduct])
        setSelectedProduct(null)
        setInputProductValue('')
    }
    const calculateTotalBillAmount = () => {
        let sum = parseFloat(0);
        billDetails.forEach((item) => {
            sum +=  parseFloat(item.total)
        })
        return sum.toFixed(3);
    }
    const handleSetQuantity = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setSelectedProduct(prev => ({
                ...prev,
                value: {
                    ...prev.value,
                    quantity: '0',
                    total: '0'
                }
            }));
            return;
        }
        if(/^\d*\.?\d{0,2}$/.test(inpValue)) {
            if(inpValue <= parseFloat(selectedProduct.value.currentQuantity))
            setSelectedProduct(prev => {
                const unitPrice = parseFloat(prev?.value?.unitPrice) || 0;
                const quantity = parseFloat(inpValue) || 0;
                const total = (quantity * unitPrice).toFixed(3);
                return {
                    ...prev,
                    value: {
                        ...prev?.value,
                        quantity: inpValue,
                        total: total
                    }
                };
            });
        }
    }
    const handleSetUnitPrice = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setSelectedProduct(prev => ({
                ...prev,
                value: {
                    ...prev?.value,
                    unitPrice: '0',
                    total: '0'
                }
            }));
            return;
        }
        
        if(/^\d*\.?\d{0,2}$/.test(inpValue)) {
            setSelectedProduct(prev => {
                const quantity = parseFloat(prev?.value?.quantity) || 0;
                const unitPrice = parseFloat(inpValue) || 0;
                const total = (quantity * unitPrice).toFixed(3);                
                return {
                    ...prev,
                    value: {
                        ...prev?.value,
                        unitPrice: inpValue,
                        total: total
                    }
                };
            });
        }
    }
    const handleClearItemPanel = () => {
        setSelectedCustomer(null)
        setSelectedProduct(null)
    }
    const handleClearBill = () => {
        setBillDetails([])
        setSelectedProduct(null)
        setSelectedCustomer(null)
        setInputCustomerValue('')
        setInputProductValue('')
        setPaidAmount(0)
        setDiscount(0)
    }
    const handlePaidAmount = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setPaidAmount('0')
            return;
        }
        if(/^\d*\.?\d{0,3}$/.test(inpValue)) {
            let amount = parseFloat(calculateBillNetAmount());
            let paid = parseFloat(inpValue);
            if(paid <= amount){
                setPaidAmount(inpValue)
            }
        }
    }
    const handleCreateBill = () => {
        const saleItems = billDetails.map(item => ({
            productID: item.id,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice)
        }))
        const bill = {
            customerID: selectedCustomer.value.id,
            paidAmount: parseFloat(paidAmount),
            discount: discount,
            saleItems: saleItems
        }       
        saleImplementations.CreateSale({
            token: authInfo.Token,
            bill: bill,
            setFailer: setFailer,
            setLoader: setIsLoading,
            onSuccess: handleClearBill
        })
    }
    const handleDiscount = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setDiscount('0')
            return;
        }
        if(/^\d*\.?\d{0,3}$/.test(inpValue)) {
            let amount = parseFloat(calculateTotalBillAmount());
            let discount = parseFloat(inpValue);
            if(discount <= amount){
                setDiscount(inpValue)
            }
        }
    }
    const calculateBillNetAmount = () =>{
        return (parseFloat(calculateTotalBillAmount()).toFixed(3) - parseFloat(discount == '' ? 0 : discount ).toFixed(3)).toFixed(3)
    }

    useEffect(()=>{
        setDiscount(0)
        setPaidAmount(0)
        if(billDetails.length == 0 && (discount != 0 || paidAmount != 0))
            setSelectedCustomer(null)
    }, [billDetails])

    useEffect(()=>{
        if(msgDetails.title && msgDetails.message)
            setShow(true)
    }, [msgDetails])

    useEffect(()=>{
        if(EmptyObjectChecker(selectedProduct) || !parseFloat(selectedProduct.value.currentQuantity) == 0) return
        handleShow('خطأ', 'هذا المنتج غير متوفر',
            'text-white bg-danger',
            () => {
                setSelectedProduct(null)
                setInputProductValue('')
            }
        )
        
    }, [selectedProduct])

    return (
        <Container fluid className="text-white">
            <Row>
                <Col lg={12}>
                    <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">فاتورة مبيعات جديدة</h2>
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header
                            className={msgDetails.style}
                        >
                            <Modal.Title>{msgDetails.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                            className={msgDetails.style}
                        >
                            {msgDetails.message}
                        </Modal.Body>
                        <Modal.Footer
                            className="bg-danger text-white"
                        >
                            <Button
                                className={msgDetails.style}
                                onClick={handleClose}
                            >
                                حسنا
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
            <Row>
                <Col lg={8}>
                    <div className="d-flex flex-column justify-content-between align-items-start gap-3 w-100 h-100">
                        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 border border-success rounded w-100 p-2">
                            <div className="w-100 d-flex justify-content-between align-items-center mb-0">
                                <strong>اجمالي قيمة الفاتورة:</strong>
                                <div className="bg-warning rounded-2 ps-5 pe-5 pt-2 pb-2">{billDetails.length ? `${calculateTotalBillAmount()}$`: '0$'}</div>
                            </div>
                            <div className="w-100 d-flex justify-content-between align-items-center mb-0">
                                <strong>اجمالي قيمة الفاتورة بعد الحسم:</strong>
                                <div className="bg-success rounded-2 ps-5 pe-5 pt-2 pb-2">{billDetails.length ? `${calculateBillNetAmount()}$`: '0$'}</div>
                            </div>
                        </div>
                        <SaleBillDetailsViewer
                            specialStyle={`w-100 bg-secondary flex-grow-1 ${billDetails.length >= 5 ? 'h-75' : 'pb-5'}`}
                            billDetails={billDetails}
                            setBillDetails={setBillDetails}
                        />
                        {/* Select Customer */}
                        <div className={`form-group w-100 ${billDetails.length == 0 ? 'd-none' : '' }`}>
                            <label htmlFor="customer-selector">اختر الزبون</label>
                            <AutoCompletor
                                setInputValue={setInputCustomerValue}
                                inputValue={inputCustomerValue}
                                placeholder={'ادخل حرفين على الأقل'}
                                dataMapper={customerDataMapper}
                                fetchData={customerSearcher}
                                selected={selectedCustomer}
                                setSelected={setSelectedCustomer}
                                onSearchMessage="ادخل حرفين"
                            />
                        </div>

                        {/* Discount */}
                        <div className={`form-group w-100 ${billDetails.length == 0 ? 'd-none' : '' }`}>
                            <label htmlFor="discount-amount" title="قيمة حسم على الفاورة كاملة">قيمة الحسم</label>
                            <input
                                id="discount-amount"
                                type="text"
                                className="form-control"
                                onInput={handleDiscount}
                                disabled={EmptyObjectChecker(selectedCustomer)}
                                value={discount}
                                placeholder="0.00$"
                            />
                        </div>

                        {/* Paid Amount */}
                        <div className={`form-group w-100 ${billDetails.length == 0 ? 'd-none' : '' }`}>
                            <label htmlFor="paid-amount">المبلغ المدفوع</label>
                            <input
                                id="paid-amount"
                                type="text"
                                className="form-control"
                                onInput={handlePaidAmount}
                                disabled={EmptyObjectChecker(selectedCustomer)}
                                value={paidAmount}
                                placeholder="0.00$"
                            />
                        </div>
                    </div>
                </Col>
                <Col lg={4}>
                    <div 
                        className="d-flex flex-column justify-content-center align-items-start gap-3 w-100"
                    >
                        {/* Select Product */}
                        <div className="form-group w-100">
                            <label htmlFor="product-selector">اختر المنتج</label>
                            <AutoCompletor
                                setInputValue={setInputProductValue}
                                inputValue={inputProductValue}
                                placeholder={'ادخل حرفين على الأقل'}
                                dataMapper={productDataMapper}
                                fetchData={productSearcher}
                                selected={selectedProduct}
                                setSelected={setSelectedProduct}
                                onSearchMessage="ادخل حرفين"
                            />
                        </div>

                        {/* Select UnitPrice */}
                        <div className={`form-group w-100 ${EmptyObjectChecker(selectedProduct) ? 'd-none' : ''}`}>
                            <label htmlFor="unit-price">سعر الوحدة</label>
                            <input
                                id="unit-price"
                                type="text"
                                className={`form-control text-center ${(EmptyObjectChecker(selectedProduct) || !Object.hasOwn(selectedProduct.value, 'unitPrice') ? 0 : selectedProduct.value.unitPrice) == 0 ? 'bg-danger' : ''}`}
                                value={EmptyObjectChecker(selectedProduct) || !Object.hasOwn(selectedProduct.value, 'unitPrice') ? '0' : selectedProduct.value.unitPrice}
                                disabled={EmptyObjectChecker(selectedProduct)}
                                onInput={handleSetUnitPrice}
                            />
                        </div>

                        {/* Select Quantity */}
                        <div className={`form-group w-100 ${EmptyObjectChecker(selectedProduct) ? 'd-none' : ''}`}>
                            <label htmlFor="quantity">الكمية</label>
                            <input
                                id="quantity"
                                type="text"
                                className={`form-control text-center ${(EmptyObjectChecker(selectedProduct) || !Object.hasOwn(selectedProduct.value, 'quantity') ? 0 : selectedProduct.value.quantity) == 0 ? 'bg-danger' : ''}`}
                                value={EmptyObjectChecker(selectedProduct) || !Object.hasOwn(selectedProduct.value, 'quantity') ? '0' : selectedProduct.value.quantity}
                                disabled={EmptyObjectChecker(selectedProduct)}
                                onInput={handleSetQuantity}
                            />
                        </div>

                        {/* Show Total*/}
                        <div className={`w-100 d-flex flex-column justify-content-center align-items-start gap-3 ${EmptyObjectChecker(selectedProduct) ? 'd-none' : ''}`}>
                            <div className="mb-0 w-100 d-flex justify-content-between align-items">
                                <strong>مجموع:</strong> 
                                <div className={`w-25 d-flex justify-content-center align-items-center rounded-5
                                    ${EmptyObjectChecker(selectedProduct) || !Object.hasOwn(selectedProduct.value, 'total') || selectedProduct.value.total == 0
                                        ? 'bg-danger' : 'bg-success'}`}>
                                    <strong>
                                        {EmptyObjectChecker(selectedProduct) ||
                                        !Object.hasOwn(selectedProduct.value, 'total')
                                        ? 0 : selectedProduct.value.total}
                                        $
                                    </strong>
                                </div>
                            </div>
                        </div>
                        
                        {/* Add/Clear Buttons */}
                        <div className={`form-group w-100`}>
                            <div className="d-flex justify-content-between align-items-center gap-3">
                                <Button
                                    className="w-50"
                                    variant="danger"
                                    onClick={handleClearItemPanel}
                                >مسح</Button>
                                <Button
                                    className="w-50"
                                    variant="success"
                                    onClick={handleAddToBillDetails}
                                    disabled={EmptyObjectChecker(selectedProduct) || !Object.hasOwn(selectedProduct.value, 'total')  || selectedProduct?.value?.total == 0}
                                    id={selectedProduct?.value?.product?.id || ''}
                                >اضافة للفاتورة</Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Modal
                    show={isLoading}
                    onHide={isLoading}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header
                        className="bg-warning text-white"
                    >
                        <Modal.Title>جاري الحفظ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        className="bg-warning text-white"
                    >
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Modal.Body>
                </Modal>
                <Col lg={12}>
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
                        <Button onClick={handleCreateBill} variant="danger">اعادة المحاولة</Button>
                        </Alert>
                    </div>
                }
                </Col>
                <Col lg={3}></Col>
                <Col lg={6}>
                    <div className={`d-flex justify-content-between align-items-center gap-3 mt-2 mb-2 ${billDetails.length == 0 ? 'd-none' : ''}`}>
                        <Button
                            className="w-50"
                            variant="danger"
                            onClick={handleClearBill}
                        >الغاء</Button>
                        <Button
                            className="w-50"
                            variant="success"
                            disabled={EmptyObjectChecker(selectedCustomer)}
                            onClick={handleCreateBill}
                        >حفظ</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default SaleBill