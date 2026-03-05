import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";

const PayRestAmount = ({token, id, oldPaid, totalAmount, requestSender, setNeedRefresh}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setPaidAmount(0)
        setShow(false);
    };
    const handleShow = () => { 
        setShow(true);
    };

    const [failer, setFailer] = useState({});
    const [loader, setLoader] = useState(false);
    const [paidAmount, setPaidAmount] = useState(0)
    const handlePaidAmount = (e) => {
        let inpValue = e.currentTarget.value;
        if(inpValue === '') {
            setPaidAmount('0')
            return;
        }
        if(/^\d*\.?\d{0,3}$/.test(inpValue)) {
            let restAmount = parseFloat(totalAmount) - parseFloat(oldPaid);
            let paid = parseFloat(inpValue);
            if(paid <= restAmount)
                setPaidAmount(inpValue);
        }
    }

    const success = () => {
        setNeedRefresh(true)
        handleClose();
    }

    const sendRequest = () => {
        requestSender({
            token: token,
            id: id,
            paidAmount: paidAmount,
            setLoader: setLoader,
            setFailer: setFailer,
            onSuccess: success
        })
    }

    return (
      <div className="d-flex justify-content-end mb-2">
        <Button
            variant="primary"
            className="fw-bold px-5 py-3 border border-3 border-white rounded-4"
            onClick={handleShow}
        >دفع باقي المستحقات</Button>
        <Modal
          centered
          show={show}
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title>اضافة منتج</Modal.Title>
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
            {
                !loader && EmptyObjectChecker(failer) &&
                <div className="group-form">
                    <label htmlFor="amount">القيمة المراد دفعها <span className="text-danger">(اقصى مبلغ يمكن جفعه:  ${parseFloat(totalAmount) - parseFloat(oldPaid)})</span></label>
                    <input
                        id="amount"
                        name="amount"
                        type="text"
                        className="form-control"
                        value={paidAmount}
                        onInput={handlePaidAmount}
                    />
                </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" disabled={loader} onClick={handleClose}>
              الغاء
            </Button>
            <Button variant="success" disabled={loader} onClick={sendRequest}>
              دفع
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}

export default PayRestAmount