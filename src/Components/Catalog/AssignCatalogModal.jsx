import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";
import AutoCompletor from "../../Components/Common/AutoCompletor";

const AssignCatalogModal = ({title, token, catalogID, requestSender, setNeedRefresh, searcher}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setSelectedCustomer(null)
        setInputCustomerValue('')
        setShow(false);
    };
    const handleShow = () => { 
        setShow(true);
    };

    const [inputCustomerValue, setInputCustomerValue] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    const customerSearcher = (query) => {
        return searcher({
            token: token,
            search: query
        })
    }
    const customerDataMapper = (customers) => {
        return customers.map(item => ({
            value: item,
            label: `${item.firstName} ${item.lastName} ${item.phone ? `(الهاتف: ${item.phone})` : ''} ${item.email ? `(البريد الالكتروني:${item.email})`: ''} `,
        }));
    }

    const [failer, setFailer] = useState(null);
    const [loader, setLoader] = useState(false);

    const success = () => {
        setNeedRefresh(true)
        handleClose();
    }

    const sendRequest = () => {
        if(!EmptyObjectChecker(selectedCustomer)){
            requestSender({
                token: token,
                catalogID: catalogID,
                customerID: selectedCustomer.value.id,
                setLoader: setLoader,
                setFailer: setFailer,
                onSuccess: success
            })
        }
    }

    return (
      <div className="d-flex justify-content-end">
        <Button
            variant="primary"
            className="fw-bold px-5 py-3 border border-3 border-white rounded-4"
            onClick={handleShow}
        >اعارة لعميل</Button>
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
            <div className={`form-group w-100`}>
                <label htmlFor="customer-selector">اختر العميل</label>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" disabled={loader} onClick={handleClose}>
              الغاء
            </Button>
            <Button variant="success" disabled={loader || EmptyObjectChecker(selectedCustomer) || inputCustomerValue == ''} onClick={sendRequest}>
              تأكيد
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}

export default AssignCatalogModal