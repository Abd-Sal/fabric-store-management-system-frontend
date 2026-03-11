import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";

const ConfirmationExpenseModal = ({title, btnTitle, btnStyle, bodyTitle, token, id, requestSender, specialBehavior}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => { 
        setShow(true);
    };

    const [failer, setFailer] = useState({});
    const [loader, setLoader] = useState(false);

    const success = () => {
        handleClose();
        if(specialBehavior)
          specialBehavior()
    }

    const sendRequest = () => {
        requestSender({
            token: token,
            id: id,
            setLoader: setLoader,
            setFailer: setFailer,
            onSuccess: success
        })
    }

    return (
      <div className="d-flex justify-content-end">
        <Button
            variant={`${btnStyle}`}
            className="fw-bold px-5 py-3 border border-3 border-white rounded-4"
            onClick={handleShow}
        >{btnTitle}</Button>
        <Modal
          centered
          show={show}
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
                failer != null &&
                EmptyObjectChecker(failer) &&
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
            {bodyTitle}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" disabled={loader} onClick={handleClose}>
              الغاء
            </Button>
            <Button variant="success" disabled={loader} onClick={sendRequest}>
              تأكيد
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}

export default ConfirmationExpenseModal