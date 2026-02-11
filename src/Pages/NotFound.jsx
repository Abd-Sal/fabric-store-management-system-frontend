import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import { GlobalContext } from "../Context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { OurRoutes } from "../Routes/OurRoutes";

const NotFound = () => {
    const {isInitialized} = useContext(GlobalContext)
    const navigate = useNavigate();

    const redirectToHome = ()=>{
        if(isInitialized)
            navigate(OurRoutes.Home, { replace: true })
        else
            navigate(OurRoutes.Login, { replace: true })
    }

    return (
        <div className="w-100 vh-100 bg-dark">
            <Container className="h-100">
                <Row className="h-100">
                    <Col sm={12} className="text-white h-100 w-100 d-flex flex-column justify-content-center align-items-center gap-3">
                        <h1 className="notfound-404">404</h1>
                        <p className="mb-0">للأسف, الصفحة المطلوبة غير موجودة</p>
                        <Button
                            className="btn-danger"
                            type="button"
                            onClick={redirectToHome}
                        >الرجوع للصفحة الرئيسية</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default NotFound