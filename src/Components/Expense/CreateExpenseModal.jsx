import { IoIosAddCircleOutline } from "react-icons/io";
import { Formik } from 'formik';
import { useRef, useState } from 'react';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

const CreateExpenseModal = ({token, implementationsCreateExpense, setAddedExpense, SpecialStyling=''}) => {
    const expenseSchema = Yup.object().shape({
        message: Yup.string()
            .min(3, 'الوصف بجب ان يكون على الأقل 3 أحرف')
            .max(100, 'الوصف يجب أن يكون على الأكثر 100 حرف')
            .required('الوصف مطلوب'),

        dollarPriceInSyr: Yup.number()
            .typeError('يجب أن يكون رقماً صحيحاً')
            .required('سعر الدولار مطلوب')
            .test(
            'max-decimal-places',
            'لا يمكن ان يحتوي سعر الدولار على اكثر من ثلاث خانات عشرية',
            (value) => {
                if (!value) return false;
                const valueStr = value.toString();
                const decimalPart = valueStr.split('.')[1];
                return !decimalPart || decimalPart.length <= 3;
            }),

        syrianAmount: Yup.number()
            .typeError('يجب أن يكون رقماً صحيحاً')
            .required('قيمة الدفع مطلوبة')
            .test(
            'max-decimal-places',
            'لا يمكن ان يحتوي السعر على اكثر من ثلاث خانات عشرية',
            (value) => {
                if (!value) return false;
                const valueStr = value.toString();
                const decimalPart = valueStr.split('.')[1];
                return !decimalPart || decimalPart.length <= 3;
            }),
    });
    const subRef = useRef(null);
    const [show, setShow] = useState(false);
    const [expenseRequest, setExpenseRequest] = useState({
        message: '',
        dollarPriceInSyr: 0,
        syrianAmount: 0,
    });
    const handleClose = () => {
        setShow(false);
        setExpenseRequest({message: '', dollarPriceInSyr: 0, syrianAmount: 0});
        setFailer({})
    };
    const handleShow = () => { 
        setShow(true);
        setExpenseRequest({message: '', dollarPriceInSyr: 0, syrianAmount: 0});    
        setFailer({})
    };
    const [failer, setFailer] = useState({});
    const [loader, setLoader] = useState(false);

    const triggerSubmit = () => {
        subRef.current?.click();
    }

    const createFunc = () => {
        implementationsCreateExpense({
            token: token,
            expenseReq: expenseRequest,
            setLoader: setLoader,
            setFailer: setFailer,
            onSuccess: () => {
                setAddedExpense(true);
                handleClose();
            }
        })
    }

    return (
        <div className="d-flex justify-content-end mb-2">
        <Button
            title="اضافة مصاريف جديدة"
            onClick={handleShow}
            className={`btn btn-success d-flex justify-content-center align-items-center ps-5 pe-5 ${SpecialStyling}`}
        ><IoIosAddCircleOutline fontSize={25}/></Button>
        <Modal
            centered
            show={show}
            onHide={handleClose}
            size="lg"
        >
            <Modal.Header>
            <Modal.Title>اضافة مصاريف</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                </Alert>
                </div>
            }
            <Formik
                initialValues={{ message: '', dollarPriceInSyr: 0, syrianAmount: 0}}
                validationSchema={expenseSchema}
                onSubmit={(values, { setSubmitting }) => {
                setExpenseRequest({
                    message: values.message,
                    dollarPriceInSyr: values.dollarPriceInSyr,
                    syrianAmount: values.syrianAmount,
                });
                createFunc();
                setTimeout(() => {
                    setSubmitting(false);
                }, 400);
                }}              
            >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => {
                const handleFormChange = (e) => {
                handleChange(e);
                const { name, value } = e.target;
                setExpenseRequest(prev => ({
                    ...prev,
                    [name]: value
                }));
                };

                return (
                    <form
                        onSubmit={handleSubmit}
                        className='form d-flex flex-column gap-3'
                    >
                        {/* Expense Message */}
                        <div className='form-group'>
                            <label htmlFor="message" className="fw-bold">وصف توضيحي</label>
                            <input
                                className='form-control'
                                type="text"
                                name="message"
                                onChange={handleFormChange}
                                onBlur={handleBlur}
                                value={values.message}
                                placeholder='الوصف توضيحي'
                                maxLength={250}
                            />
                            {errors.message && touched.message && <p className='text-danger mb-0 pb-0'>{errors.message}</p>}
                        </div>

                        {/* Expense DollarPriceInSyr */}
                        <div className='form-group'>
                            <label htmlFor="dollarPriceInSyr" className="fw-bold">سعر الدولار الان مقابل الليرة السورية الجديدة</label>
                            <input
                                className='form-control'
                                type="text"
                                name="dollarPriceInSyr"
                                onChange={handleFormChange}
                                onBlur={handleBlur}
                                value={values.dollarPriceInSyr}
                                placeholder='سعر الدولار الان'
                                maxLength={250}
                            />
                            {errors.dollarPriceInSyr && touched.dollarPriceInSyr && <p className='text-danger mb-0 pb-0'>{errors.dollarPriceInSyr}</p>}
                        </div>

                        {/* Expense SyrianAmount */}
                        <div className='form-group'>
                            <label htmlFor="syrianAmount" className="fw-bold">قيمة الدفع بالليرة السورية الجديدة</label>
                            <input
                                className='form-control'
                                type="text"
                                name="syrianAmount"
                                onChange={handleFormChange}
                                onBlur={handleBlur}
                                value={values.syrianAmount}
                                placeholder='القيمة المدفوعة'
                                maxLength={300}
                            />
                            {errors.syrianAmount && touched.syrianAmount && <p className='text-danger mb-0 pb-0'>{errors.syrianAmount}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                        hidden
                        className='btn btn-primary'
                        type="submit" disabled={isSubmitting}
                        ref={subRef}
                        >
                        Submit
                        </button>
                    </form>
                )
            }}
            </Formik>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" disabled={loader} onClick={handleClose}>
                الغاء
            </Button>
            <Button variant="success" disabled={loader} onClick={triggerSubmit}>
                اضافة
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}

export default CreateExpenseModal