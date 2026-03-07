import { Formik } from 'formik';
import { useRef, useState } from 'react';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { EmptyObjectChecker } from '../../HelperTools/EmptyObjectChecker';

const UpdateCustomerModal = ({token, oldCustomer, implementationsUpdateCustomer, setNeedRefresh, SpecialStyling=''}) => {
  const phoneRegex = /^\+?[0-9]+$/;
  const customerSchema = Yup.object().shape({
      firstName: Yup.string()
          .min(3, 'اسم الزبون بجب ان يكون على الأقل 3 أحرف')
          .max(250, 'اسم الزبون يجب أن يكون على الأكثر 250 حرف')
          .required('اسم الزبون مطلوب'),

      lastName: Yup.string()
          .min(3, 'اسم عائلة الزبون بجب ان يكون على الأقل 3 أحرف')
          .max(250, 'اسم عائلة الزبون يجب أن يكون على الأكثر 250 حرف')
          .required('اسم الزبون مطلوب'),
      
      email: Yup.string()
          .nullable()
          .transform((value) => value === "" ? undefined : value)
          .email('يجب ان يكون مطابق لشكل البريد الالكتروني')
          .min(3, "البريد الالكتروني يجب أن يكون على الأقل 3 أحرف")
          .max(300, 'البريد الالكتروني يجب أن يكون على الأكثر 300 حرف')
          .optional(),
      
      phone: Yup.string()
          .nullable()
          .transform((value) => value === "" ? undefined : value)
          .matches(phoneRegex, 'رقم الهاتف يجب ان يحتوي فقط ارقام')
          .min(4, "رقم الهاتف يجب أن يكون على الأقل 4 أحرف")
          .max(20, 'رقم الهاتف يجب أن يكون على الأكثر 20 حرف')
          .optional(),
      
      address: Yup.string()
          .nullable()
          .transform((value) => value === "" ? undefined : value)
          .min(3, "العنوان يجب أن يكون على الأقل 3 أحرف")
          .max(500, 'العنوان يجب أن يكون على الأكثر 500 حرف')
          .optional(),
  });
  const subRef = useRef(null);
  const [show, setShow] = useState(false);
  const [customerRequest, setCustomerRequest] = useState({
    firstName: oldCustomer.firstName,
    lastName: oldCustomer.lastName,
    email: oldCustomer.email,
    phone: oldCustomer.phone,
    address: oldCustomer.address
  });
  const handleClose = () => {
    setShow(false);
    setCustomerRequest({fistName: '', lastName: '', email: '', phone: '', address: ''});
    setFailer({})
  };
  const handleShow = () => { 
    setShow(true);
    setFailer({})
  };
  const [failer, setFailer] = useState({});
  const [loader, setLoader] = useState(false);

  const triggerSubmit = () => {
    subRef.current?.click();
  }

  const checkIfEdited = () => {    
    return oldCustomer.firstName !== customerRequest.firstName ||
        oldCustomer.lastName !== customerRequest.lastName ||
        oldCustomer.address !== customerRequest.address ||
        oldCustomer.email !== customerRequest.email ||
        oldCustomer.phone !== customerRequest.phone;
  }

  const updateFunc = () => {
    if(checkIfEdited()){
        implementationsUpdateCustomer({
          token: token,
          id: oldCustomer.id,
          newCustomer: customerRequest,
          setLoader: setLoader,
          setFailer: setFailer,
          onSuccess: () => {
            setNeedRefresh(true)
            handleClose();
          }
        })
    }
  }

  return (
    <div className="d-flex justify-content-end">
      <Button
        title="تعديل الزبون"
        onClick={handleShow}
        className={`btn btn-primary px-5 py-3 border border-3 border-white rounded-4 fw-bold d-flex justify-content-center align-items-center ${SpecialStyling}`}
      >تعديل بيانات العميل</Button>
      <Modal
        centered
        show={show}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>تعديل زبون</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            !EmptyObjectChecker(failer) &&
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
            initialValues={{ firstName: customerRequest.firstName, lastName: customerRequest.lastName, email: customerRequest.email != null ? customerRequest.email : '' , phone: customerRequest.phone != null ? customerRequest.phone : '', address: customerRequest.address }}
            validationSchema={customerSchema}
            onSubmit={(values, { setSubmitting }) => {
              setCustomerRequest({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                address: values.address,
              });
              updateFunc();
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
              setCustomerRequest(prev => ({
                  ...prev,
                  [name]: value
              }));
            };

            return (
              <form
                onSubmit={handleSubmit}
                className='form d-flex flex-column gap-3'
              >
                {/* Customer FirstName */}
                <div className='form-group'>
                  <input
                      className='form-control'
                      type="text"
                      name="firstName"
                      onChange={handleFormChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                      placeholder='اسم الزبون'
                      maxLength={250}
                  />
                  {errors.firstName && touched.firstName && <p className='text-danger mb-0 pb-0'>{errors.firstName}</p>}
                </div>

                {/* Customer LastName */}
                <div className='form-group'>
                  <input
                      className='form-control'
                      type="text"
                      name="lastName"
                      onChange={handleFormChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                      placeholder='اسم عائلة الزبون'
                      maxLength={250}
                  />
                  {errors.lastName && touched.lastName && <p className='text-danger mb-0 pb-0'>{errors.lastName}</p>}
                </div>

                {/* Customer Email */}
                <div className='form-group'>
                  <input
                      className='form-control'
                      type="email"
                      name="email"
                      onChange={handleFormChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder='البريد الالكتروني'
                      maxLength={300}
                  />
                  {errors.email && touched.email && <p className='text-danger mb-0 pb-0'>{errors.email}</p>}
                </div>

                {/* Customer Phone */}
                <div className='form-group'>
                  <input
                      className='form-control'
                      type="text"
                      name="phone"
                      onChange={handleFormChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      placeholder='رقم الهاتف'
                      maxLength={20}
                  />
                  {errors.phone && touched.phone && <p className='text-danger mb-0 pb-0'>{errors.phone}</p>}
                </div>

                {/* Customer Address */}
                <div className='form-group'>
                  <input
                      className='form-control'
                      type="text"
                      name="address"
                      onChange={handleFormChange}
                      onBlur={handleBlur}
                      value={values.address}
                      placeholder='العنوان'
                      maxLength={500}
                  />
                  {errors.address && touched.address && <p className='text-danger mb-0 pb-0'>{errors.address}</p>}
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
          <Button variant="danger" onClick={handleClose}>
            الغاء
          </Button>
          <Button variant="success" disabled={loader || !checkIfEdited()} onClick={triggerSubmit}>
            حفظ التعديلات
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UpdateCustomerModal