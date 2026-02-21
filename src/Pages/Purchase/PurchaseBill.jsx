import { useContext, useState } from "react";
import { Col, Container, Row } from "react-bootstrap"
import { GlobalContext } from "../../Context/GlobalContext";
import Button from 'react-bootstrap/Button';
import PurchaseBillDetailsViewer from "../../Components/Purchase/PurchaseBillDetailsViewer";
import AutoCompletor from "../../Components/Common/AutoCompletor";
import { ProductImplementations } from "../../Code/ProductImplementations";
import { EmptyObjectChecker } from '../../HelperTools/EmptyObjectChecker'
import { SupplierImplementations } from '../../Code/SupplierImplementations'
import Modal from 'react-bootstrap/Modal';
import { PurchaseImplementations } from '../../Code/PurchaseImplementations'
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

const PurchaseBill = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {authInfo} = useContext(GlobalContext)
    const [failer, setFailer] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [inputProductValue, setInputProductValue] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [inputSupplierValue, setInputSupplierValue] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [billDetails, setBillDetails] = useState([])
    const [paidAmount, setPaidAmount] = useState(0)
    const productImplementations = ProductImplementations;
    const purchaseImplementations = PurchaseImplementations;
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
    
    const supplierImplemetations = SupplierImplementations;
    const supplierSearcher = (query) => {
        return supplierImplemetations.SupplierSearchForBill({
            token: authInfo.Token,
            search: query
        })
    }
    const supplierDataMapper = (suppliers) => {
        return suppliers.map(item => ({
            value: item,
            label: `${item.name} ${item.phone ? `(الهاتف: ${item.phone})` : ''} ${item.email ? `(البريد الالكتروني:${item.email})`: ''} `,
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
                handleShow();
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
                    quantity: '',
                    total: '0'
                }
            }));
            return;
        }
        if(/^\d*\.?\d{0,2}$/.test(inpValue)) {
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
                    unitPrice: '',
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
        setSelectedSupplier(null)
        setSelectedProduct(null)
    }
    const handleClearBill = () => {
        setBillDetails([])
        setSelectedProduct(null)
        setSelectedSupplier(null)
        setInputSupplierValue('')
        setInputProductValue('')
        setPaidAmount(0)
    }
    const handlePaidAmount = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setPaidAmount('')
            return;
        }
        if(/^\d*\.?\d{0,3}$/.test(inpValue)) {
            let amount = parseFloat(calculateTotalBillAmount());
            let paid = parseFloat(inpValue);
            if(paid <= amount){
                setPaidAmount(inpValue)
            }
        }
    }
    const handleCreateBill = () => {
        const purchaseItems = billDetails.map(item => ({
            productID: item.id,
            quantity: parseFloat(item.quantity),
            unitCost: parseFloat(item.unitPrice)
        }))
        const bill = {
            supplierID: selectedSupplier.value.id,
            paidAmount: parseFloat(paidAmount),
            purchaseItems: purchaseItems
        }
        console.log(bill);
        purchaseImplementations.CreatePurchase({
            token: authInfo.Token,
            bill: bill,
            setFailer: setFailer,
            setLoader: setIsLoading,
            onSuccess: handleClearBill
        })
    }

    return (
        <Container fluid className="text-white">
            <Row>
                <Col lg={12}>
                    <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">فاتورة مشتريات جديدة</h2>
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header
                            className="bg-danger text-white"
                        >
                            <Modal.Title>خطأ</Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                            className="bg-danger text-white"
                        >
                            هذا المنتج موجود بالفعل في الفاتورة
                        </Modal.Body>
                        <Modal.Footer
                            className="bg-danger text-white"
                        >
                            <Button className="bg-white text-black" onClick={handleClose}>
                                حسنا
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
            <Row>
                <Col lg={8}>
                    <div className="d-flex flex-column justify-content-between align-items-start gap-3 w-100 h-100">
                        <div className="border border-success rounded w-100 p-2">
                            <div className="d-flex justify-content-between align-items-center mb-0">
                                <strong>اجمالي قيمة الفاتورة:</strong>
                                <div className="bg-success rounded-2 ps-5 pe-5 pt-2 pb-2">{billDetails.length ? `${calculateTotalBillAmount()}$`: '0$'}</div>
                            </div>
                        </div>
                        <PurchaseBillDetailsViewer
                            specialStyle={`w-100 bg-secondary flex-grow-1 ${billDetails.length >= 5 ? 'h-75' : 'pb-5'}`}
                            billDetails={billDetails}
                            setBillDetails={setBillDetails}
                        />
                        {/* Select Supplier */}
                        <div className={`form-group w-100 ${billDetails.length == 0 ? 'd-none' : '' }`}>
                            <label htmlFor="supplier-selector">اختر المورد</label>
                            <AutoCompletor
                                setInputValue={setInputSupplierValue}
                                inputValue={inputSupplierValue}
                                placeholder={'ادخل حرفين على الأقل'}
                                dataMapper={supplierDataMapper}
                                fetchData={supplierSearcher}
                                selected={selectedSupplier}
                                setSelected={setSelectedSupplier}
                                onSearchMessage="ادخل حرفين"
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
                                disabled={EmptyObjectChecker(selectedSupplier)}
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
                                id="quantity"
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
                        className="bg-danger text-white"
                    >
                        <Modal.Title>جاري الحفظ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        className="bg-danger text-white"
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
                            disabled={EmptyObjectChecker(selectedSupplier) || paidAmount == '' || billDetails.length == 0}
                            onClick={handleCreateBill}
                        >حفظ</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default PurchaseBill