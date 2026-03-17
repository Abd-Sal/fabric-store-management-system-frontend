import { Col, Container, Row } from "react-bootstrap"
import DeveloperSocial from "./DeveloperSocial"

const Footer = () => {
  return (
    <div className="bg-dark text-white border-1 border-top border-gray py-3">
        <Container fluid>
            <Row>
                <Col md={4} className="d-flex justify-content-center  justify-content-md-start align-items-center">
                    <p className="mb-0"><strong>من تطوير :</strong> عبدالرحمن الصالح</p>
                </Col>
                <Col md={4} className="d-flex justify-content-center justify-content-md-center align-items-center">
                    <p className="mb-0"><strong>للتواصل مع المطور :</strong> 0982760361</p>
                </Col>
                <Col md={4} className="d-flex justify-content-center justify-content-md-end align-items-center">
                    <DeveloperSocial />
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default Footer