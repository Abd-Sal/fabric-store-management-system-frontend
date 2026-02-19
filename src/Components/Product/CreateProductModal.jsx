import { IoIosAddCircleOutline } from "react-icons/io";
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import { useRef, useState } from 'react';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

const CreateProductModal = ({token, implementationsCreateProduct, setAddedProduct, SpecialStyling=''}) => {
    const productSchema = Yup.object().shape({
        name: Yup.string()
        .nullable()
        .max(250, 'اسم المنتج يجب أن يكون على الأكثر 250 حرف'),
        
        code: Yup.string()
        .required('كود المنتج مطلوب')
        .min(1, "كود المنتج يجب أن يكون على الأقل حرف واحد")
        .max(45, 'كود المنتج يجب أن يكون على الأكثر 45 حرف'),

        color: Yup.string()
        .when('$hasColors', {
          is: false,
          then: (schema) => schema.required('لون المنتج مطلوب'),
          otherwise: (schema) => schema.notRequired()
        })
        .min(1, "لون المنتج يجب أن يكون على الأقل حرف واحد")
        .max(45, 'لون المنتج يجب أن يكون على الأكثر 45 حرف'),

        unit: Yup.string()
        .required('وحدة القياس مطلوبة')
        .min(1, "وحدة القياس يجب أن تكون على الأقل حرف واحد")
        .max(25, 'وحدة القياس يجب أن تكون على الأكثر 25 حرف'),

        material: Yup.string()
        .nullable()
        .max(150, 'مادة المنتج يجب أن تكون على الأكثر 150 حرف')
    });
    const subRef = useRef(null);
    const colorRef = useRef(null);
    const [show, setShow] = useState(false);
    const handleClose = () => {
      setShow(false);
      setProductRequest({name: '', code: '', colors: [], unit: '', material: ''});
      setFailer({})
    };
    const handleShow = () => { 
      setShow(true);
      setProductRequest({name: '', code: '', colors: [], unit: '', material: ''});
      setFailer({})
    };
    const [failer, setFailer] = useState({});
    const [loader, setLoader] = useState(false);
    const [productRequest, setProductRequest] = useState({
      name: '',
      code: '',
      colors: [],
      unit: '',
      material: ''
    });

    const triggerSubmit = () => {
      subRef.current?.click();
    }

    const createFunc = () => {
      implementationsCreateProduct({
        token: token,
        product: productRequest,
        colors: productRequest.colors,
        setLoader: setLoader,
        setFailer: setFailer,
        onSuccess: () => {
          setAddedProduct(true);
          handleClose();
        }
      })
    }

    return (
      <div className="d-flex justify-content-end mb-2">
        <Button
          title="اضافة منتج جديد"
          variant="primary"
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
            <Modal.Title>اضافة منتج</Modal.Title>
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
              initialValues={{ name: '', code: '', color: '', unit: '', material: '' }}
              validationSchema={productSchema}
              onSubmit={(values, { setSubmitting }) => {
                setProductRequest({
                  name: values.name,
                  code: values.code,
                  unit: values.unit,
                  material: values.material,
                  colors: productRequest.colors
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

                // Update productRequest (except for color field - don't update colors array here)
                if (name !== 'color') {
                  setProductRequest(prev => ({
                    ...prev,
                    [name]: value
                  }));
                }
              };

              const handleAddColor = () => {
                  if(productRequest.colors.includes(values.color)) return;
                  setProductRequest(prev => ({
                    ...prev,
                    colors: [...prev.colors, values.color]
                  }));
                  values.color = '';
                  colorRef.current?.focus();
              }
              
              const handleRemoveColor = (colorToRemove) => {
                  setProductRequest(prev => ({
                    ...prev,
                    colors: prev.colors.filter(color => color !== colorToRemove)
                  }));
              }

              return (
                <form
                  onSubmit={handleSubmit}
                  className='form d-flex flex-column gap-3'
                >
                  {/* Product Name */}
                  <div className='form-group'>
                    <input
                        className='form-control'
                        type="text"
                        name="name"
                        onChange={handleFormChange}
                        onBlur={handleBlur}
                        value={values.name}
                        placeholder='اسم المنتج'
                    />
                    {errors.name && touched.name && <p className='text-danger mb-0 pb-0'>{errors.name}</p>}
                  </div>

                  {/* Product Code */}
                  <div className='form-group'>
                    <input
                        className='form-control'
                        type="text"
                        name="code"
                        onChange={handleFormChange}
                        onBlur={handleBlur}
                        value={values.code}
                        placeholder='كود المنتج'
                    />
                    {errors.code && touched.code && <p className='text-danger mb-0 pb-0'>{errors.code}</p>}
                  </div>

                  {/* Product Colors */}
                  <div className='form-group'>
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <input
                          className='form-control w-75'
                          type="text"
                          name="color"
                          onChange={handleFormChange}
                          onBlur={handleBlur}
                          value={values.color}
                          placeholder='لون المنتج'
                          ref={colorRef}
                      />
                      <Button
                        variant="secondary w-25"
                        onClick={handleAddColor}
                        disabled={!values.color || errors.color || productRequest.colors.includes(values.color)}
                      >
                        اضافة لون
                      </Button>                        
                    </div>
                    <div className="d-flex justify-content-start align-items-center gap-2 mt-1 flex-wrap">
                      {
                        productRequest.colors.map((color, index) => (
                          <div key={index} className="badge bg-secondary me-1 d-flex justify-content-center align-items-center gap-2">
                            {color}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="ms-2 p-0 d-flex justify-content-center align-items-center"
                              onClick={() => handleRemoveColor(color)}
                            >
                              &times;
                            </Button>
                          </div>
                        ))
                      }
                    </div>
                    {errors.color && touched.color && <p className='text-danger mb-0 pb-0'>{errors.color}</p>}
                  </div>

                  {/* Product Unit */}
                  <div className='form-group'>
                    <input
                        className='form-control'
                        type="text"
                        name="unit"
                        onChange={handleFormChange}
                        onBlur={handleBlur}
                        value={values.unit}
                        placeholder='وحدة القياس'
                    />
                    {errors.unit && touched.unit && <p className='text-danger mb-0 pb-0'>{errors.unit}</p>}
                  </div>

                  {/* Product Material */}
                  <div className='form-group'>
                    <input
                        className='form-control'
                        type="text"
                        name="material"
                        onChange={handleFormChange}
                        onBlur={handleBlur}
                        value={values.material}
                        placeholder='مادة المنتج'
                    />
                    {errors.material && touched.material && <p className='text-danger mb-0 pb-0'>{errors.material}</p>}
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
            <Button variant="success" disabled={loader} onClick={triggerSubmit}>
              اضافة
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}

export default CreateProductModal