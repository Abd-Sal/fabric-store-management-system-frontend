//offcanves
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { CiMenuBurger } from "react-icons/ci";

const CustomOffCanves = ({children, title, shotBtnText = '', showBtnStyle='border-0 bg-dark text-white'}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                className={`${showBtnStyle}`}
                onClick={handleShow}>
                    {
                        shotBtnText ? 
                        shotBtnText :
                        <CiMenuBurger fontSize={35} />
                    }
            </Button>
            <Offcanvas
                show={show}
                onHide={handleClose}
                responsive="lg"
                className="bg-dark text-white"
            >
                <Offcanvas.Header 
                    closeVariant="primary"
                >
                    <Offcanvas.Title>
                        <Button
                        className="fw-bold border-secondary bg-dark text-white mb-3"
                        onClick={handleClose}>
                            X
                        </Button>
                        <h2>{title}</h2>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {children}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default CustomOffCanves