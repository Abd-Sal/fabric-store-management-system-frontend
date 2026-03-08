import Button from 'react-bootstrap/Button';
import ProductSelector from './ProductSelector';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../Context/GlobalContext';
import { ProductImplementations } from '../../Code/ProductImplementations';
import { CatalogImplementations } from '../../Code/CatalogImplementations';
import Modal from 'react-bootstrap/Modal';
import AutoCompletor from "../../Components/Common/AutoCompletor";
import { SupplierImplementations } from '../../Code/SupplierImplementations'
import { EmptyObjectChecker } from '../../HelperTools/EmptyObjectChecker';

const PurchaseCatalog = () => {
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
    const [productCode, setProductCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [productItems, setProductItems] = useState([])
    const [productCount, setProductCount] = useState(1)
    const [inputSupplierValue, setInputSupplierValue] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [cut, setCut] = useState({
        supplierID: null,
        description: '',
        items : [],
        price: 0,
        paidAmount: 0,
        total: 0
    })
    
    const handleProductCodeInput = (e) => {
        setProductCode(e.currentTarget.value)
    }
    
    const catalogImplemetations = CatalogImplementations;
    const productImplementations = ProductImplementations;

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

    const getProductsByCode = () => {
        setProductItems([]);
        setCut({
            ...cut,
            items: [],
            description: ''
        })
        productImplementations.GetProductsByCode({
            token: authInfo.Token,
            code: productCode,
            handleShow: handleShow,
            setLoader: setLoading,
            setProducts: setProductItems
        })
    }

    const handleDescriptionInput = (e) => {
        setCut({
            ...cut,
            description: e.currentTarget.value
        })
    }

    const handleCatalogCount = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setProductCount('0')
            setCut(prev => ({
                ...prev,
                total: 0
            }))
            return;
        }
        if(/^\d+$/.test(inpValue)) {
            if(inpValue >= 1){
                setProductCount(inpValue)
                setCut(prev => ({
                    ...prev,
                    total: (parseFloat(prev.price) * parseInt(inpValue)).toFixed(3)
                }))
            }
        }
    }

    const handleSetPrice = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setCut(prev => ({
                ...prev,
                price: '0',
                total: 0
            }));
            return;
        }
        
        if(/^\d*\.?\d{0,2}$/.test(inpValue)) {
            setCut(prev => {
                const quantity = productCount;
                const unitPrice = parseFloat(inpValue) || 0;
                const total = (quantity * unitPrice).toFixed(3);                
                return {
                    ...prev,
                    price: inpValue,
                    total: total
                }
            });
        }
    }

    const handlePaidAmount = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setCut(prev => ({
                ...prev,
                paidAmount: '0'
            }));
            return;
        }
        if(/^\d*\.?\d{0,2}$/.test(inpValue)) {
            let amount = parseFloat(cut.total);
            let paid = parseFloat(inpValue);
            if(paid <= amount){
                setCut(prev => ({
                    ...prev,
                    paidAmount: inpValue
                }))
            }
        }
    }

    const handleClear = () => {
        setCut({
            supplierID: null,
            description: '',
            items : [],
            price: 0,
            paidAmount: 0,
            total: 0
        })
        setSelectedSupplier(null)
        setProductCode('')
        setProductItems([])
        setProductCount(1)
    }

    const handleSave = () => {
        let request = {
            supplierID: selectedSupplier ? selectedSupplier.value.id : null,
            description: cut.description,
            items: cut.items.map((item) => item.replace('product-', '')),
            price: cut.price,
            paidAmount: cut.paidAmount,
            total: cut.total
        }
        catalogImplemetations.PurchaseCatalog({
            handleShow: handleShow,
            request: request,
            setLoader: setLoading,
            token: authInfo.Token,
            catalogCount: productCount
        })
        handleClear()
    }

    useEffect(()=>{
        if(msgDetails.title && msgDetails.message)
            setShow(true)
    }, [msgDetails])

    return (
        <>
            <div>
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
                        className={msgDetails.style}
                    >
                        <Button
                            className={msgDetails.style}
                            onClick={handleClose}
                        >
                            حسنا
                        </Button>
                    </Modal.Footer>
                </Modal>
                <form
                    action=""
                    className='d-flex flex-column justify-content-center align-items-start gap-3 w-100'
                >
                    {/* Product Code */}
                    <div className='w-100 d-flex flex-column justify-content-center align-items-start gap-2'>
                        <div className='group-control w-100'>
                            <label htmlFor="product">كود المنتج</label>
                            <input
                                type="text"
                                name="product"
                                id="product"
                                className='form-control'
                                value={productCode}
                                onInput={handleProductCodeInput}
                            />
                        </div>
                        <div className='w-100'>
                            <Button
                                variant="primary"
                                className="w-100"
                                disabled={productCode.trim() === '' || loading}
                                onClick={getProductsByCode}
                            >
                                {
                                    loading ? 'تحميل...' : 'بحث'
                                }
                            </Button>
                        </div>
                    </div>

                    {/* Products For Select */}
                    <div className='w-100'>
                        <ProductSelector
                            products={productItems}
                            cut={cut}
                            setCut={setCut}
                        />
                    </div>
                    
                    {/* Supplier Selector */}
                    <div className={`form-group w-100 ${cut.items.length === 0 ? 'd-none' : ''}`}>
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

                    {/* Catalog Count */}
                    <div className={`group-control w-100 ${cut.items.length === 0 ? 'd-none' : ''}`}>
                        <label htmlFor="catalog-count">عدد الكاتالوغات</label>
                        <input
                            type="number"
                            id="catalog-count"
                            className='form-control'
                            disabled={productItems.length === 0}
                            value={productCount}
                            onInput={handleCatalogCount}
                            min={1}
                            max={100}
                            step={1}
                        />
                    </div>

                    {/* Catalog Price */}
                    <div className={`form-group w-100 ${cut.items.length == 0 ? 'd-none' : ''}`}>
                        <label htmlFor="price">سعر الكاتالوغ</label>
                        <input
                            id="price"
                            type="text"
                            className={`form-control text-center ${cut.price == 0  ? 'bg-danger' : ''}`}
                            value={cut.price}
                            disabled={cut.items.length === 0}
                            onInput={handleSetPrice}
                        />
                    </div>

                    {/* Total Price */}
                    <div className={`form-group w-100 ${cut.items.length == 0 ? 'd-none' : ''}`}>
                        <label htmlFor="total-price">إجمالي السعر</label>
                        <input
                            id="total-price"
                            type="text"
                            className="form-control text-center border border-2 border-success"
                            value={`${cut.total}$`}
                            disabled={true}
                            readOnly
                        />
                    </div>

                    {/* Paid Amount */}
                    <div className={`form-group w-100 ${productItems.length == 0 ? 'd-none' : '' }`}>
                        <label htmlFor="paid-amount">المبلغ المدفوع</label>
                        <input
                            id="paid-amount"
                            type="text"
                            className="form-control"
                            onInput={handlePaidAmount}
                            disabled={EmptyObjectChecker(selectedSupplier) || cut.items.length === 0}
                            value={cut.paidAmount}
                            placeholder="0.00$"
                        />
                    </div>

                    {/* Description */}
                    <div className="group-control w-100">
                        <label htmlFor="description">الوصف (اختياري)</label>
                        <textarea
                            name="description"
                            id="description"
                            style={{maxHeight: 300, minHeight: 150}}
                            className='form-control'
                            value={cut.description}
                            onInput={handleDescriptionInput}
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="pb-3 w-100 d-flex justify-content-between align-items-center gap-2">
                        <Button
                            variant="danger"
                            className="px-5"
                            onClick={handleClear}
                            disabled={loading}
                        >الغاء</Button>
                        <Button
                            variant="success"
                            className="px-5"
                            onClick={handleSave}
                            disabled={loading || cut.price == 0 || cut.total == 0|| cut.items.length === 0 || productCount == 0 || EmptyObjectChecker(selectedSupplier)}
                        >حفظ</Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default PurchaseCatalog