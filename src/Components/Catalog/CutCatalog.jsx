import Button from 'react-bootstrap/Button';
import ProductSelector from './ProductSelector';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../Context/GlobalContext';
import { ProductImplementations } from '../../Code/ProductImplementations';
import { CatalogImplementations } from '../../Code/CatalogImplementations';
import Modal from 'react-bootstrap/Modal';

const CutCatalog = () => {
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
    const [quantity, setQuantity] = useState(0)
    const [productCount, setProductCount] = useState(1)
    const [cut, setCut] = useState({
        description: '',
        items : []
    })
    
    const handleProductCodeInput = (e) => {
        setProductCode(e.currentTarget.value)
    }
    
    const handleQuantityInput = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setQuantity('0')
            return;
        }
        if(/^\d*\.?\d{0,2}$/.test(inpValue)) {
            if(inpValue > 0.00)
                setQuantity(inpValue)
        }
    }

    const catalogImplemetations = CatalogImplementations;

    const productImplementations = ProductImplementations;

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
            return;
        }
        if(/^\d+$/.test(inpValue)) {
            if(inpValue >= 1)
                setProductCount(inpValue)
        }
    }

    const handleClear = () => {
        setCut({
            description: '',
            items : []
        })
        setProductCode('')
        setProductItems([])
        setQuantity(0)
        setProductCount(1)
    }

    const handleSave = () => {
        let request = {
            description: cut.description,
            items: cut.items.map((item) => ({
                productID: item.replace('product-', ''),
                quantity: quantity
            }))
        }
        catalogImplemetations.CreateCatalogOfStock({
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
                    
                    {/* Quantity */}
                    <div className='group-control w-100'>
                        <label htmlFor="quantity">الكمية (بالمتر)</label>
                        <input
                            type="number"
                            id="quantity"
                            className='form-control'
                            disabled={productCode.trim() === '' || cut.items.length === 0}
                            value={quantity}
                            onInput={handleQuantityInput}
                        />
                    </div>

                    {/* Catalog Count */}
                    <div className={`group-control w-100 ${quantity <= 0 ? 'd-none' : ''}`}>
                        <label htmlFor="catalog-count">عدد الكاتالوغات</label>
                        <input
                            type="number"
                            id="catalog-count"
                            className='form-control'
                            disabled={quantity <= 0}
                            value={productCount}
                            onInput={handleCatalogCount}
                            min={1}
                            max={100}
                            step={1}
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
                            disabled={loading || cut.items.length === 0 || quantity <= 0}
                        >حفظ</Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CutCatalog